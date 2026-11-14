const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Job Seeker)
const applyJob = async (req, res, next) => {
  try {
    const {
      jobId,
      resumeUrl,
      resumeOriginalName,
      coverLetter,
      phone,
      expectedSalary,
      noticePeriod,
      portfolioUrl,
    } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required to submit an application',
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }

    if (job.status !== 'Active' && job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer accepting new applications',
      });
    }

    // Check if user has already applied
    const existing = await Application.findOne({
      job: jobId,
      $or: [{ applicant: req.user._id }, { candidate: req.user._id }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position',
      });
    }

    // Final resume resolution
    const finalResumeUrl = resumeUrl || req.user.resumeUrl;
    const finalResumeName = resumeOriginalName || req.user.resumeOriginalName || 'Resume.pdf';

    if (!finalResumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload or attach your resume before applying',
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      candidate: req.user._id,
      employer: job.employer,
      recruiter: job.employer,
      status: 'Applied',
      resumeUrl: finalResumeUrl,
      resumeOriginalName: finalResumeName,
      coverLetter: coverLetter || '',
      phone: phone || req.user.phone || '',
      expectedSalary: expectedSalary ? Number(expectedSalary) : 0,
      noticePeriod: noticePeriod || 'Immediate',
      portfolioUrl: portfolioUrl || '',
      statusHistory: [
        {
          status: 'Applied',
          note: 'Application submitted successfully',
          updatedAt: new Date(),
        },
      ],
    });

    // Increment applicantsCount on Job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

    // Notify Employer
    await Notification.create({
      recipient: job.employer,
      sender: req.user._id,
      title: 'New Candidate Application',
      message: `${req.user.name} applied for "${job.title}"`,
      type: 'application_received',
      link: `/employer/applicants/${job._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Track progress in your dashboard.',
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job listing',
      });
    }
    next(error);
  }
};

// @desc    Get all applications submitted by logged-in job seeker
// @route   GET /api/applications/my
// @access  Private (Job Seeker)
const getMyApplications = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = {
      $or: [{ applicant: req.user._id }, { candidate: req.user._id }],
    };

    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'job',
        select: 'title companyName companyLogo location jobType minSalary maxSalary workMode category status',
        populate: { path: 'company', select: 'name logo website industry' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer & Admin)
const getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }

    // Verify ownership
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view applicants for your own listings',
      });
    }

    const { status, search } = req.query;
    const query = { job: req.params.jobId };

    if (status && status !== 'All') {
      query.status = status;
    }

    let applications = await Application.find(query)
      .populate('applicant', 'name email phone avatar headline location skills experience education resumeUrl')
      .populate('candidate', 'name email phone avatar headline location skills experience education resumeUrl')
      .sort({ createdAt: -1 });

    // Client/search filtering if requested
    if (search && search.trim() !== '') {
      const term = search.toLowerCase();
      applications = applications.filter((app) => {
        const cand = app.applicant || app.candidate;
        if (!cand) return false;
        return (
          cand.name?.toLowerCase().includes(term) ||
          cand.email?.toLowerCase().includes(term) ||
          cand.skills?.some((s) => s.toLowerCase().includes(term))
        );
      });
    }

    res.status(200).json({
      success: true,
      job,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications across all jobs for the logged in employer
// @route   GET /api/applications/employer/all
// @access  Private (Employer)
const getAllEmployerApplications = async (req, res, next) => {
  try {
    const { status, jobId } = req.query;
    const query = {
      $or: [{ employer: req.user._id }, { recruiter: req.user._id }],
    };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (jobId) {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate('job', 'title category location workMode')
      .populate('applicant', 'name email phone avatar headline location skills experience education resumeUrl resumeOriginalName')
      .populate('candidate', 'name email phone avatar headline location skills experience education resumeUrl resumeOriginalName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Shortlist, Interview, Reject, Hire, Under Review)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer & Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note, interviewDetails } = req.body;

    const validStatuses = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Rejected',
      'Hired',
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid application status. Allowed: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('job', 'title companyName')
      .populate('applicant', 'name email')
      .populate('candidate', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Authorization
    const employerId = application.employer || application.recruiter;
    if (employerId && employerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only update applications for your jobs',
      });
    }

    application.status = status;

    if (interviewDetails) {
      application.interviewDetails = {
        date: interviewDetails.date || interviewDetails.scheduledDate || new Date(),
        scheduledDate: interviewDetails.date || interviewDetails.scheduledDate || new Date(),
        time: interviewDetails.time || '11:00 AM',
        mode: interviewDetails.mode || 'Google Meet',
        meetingLink: interviewDetails.meetingLink || interviewDetails.link || '',
        link: interviewDetails.link || interviewDetails.meetingLink || '',
        notes: interviewDetails.notes || '',
        status: 'Scheduled',
      };
    }

    // Append to status history
    application.statusHistory.push({
      status,
      note: note || `Application status changed to ${status}`,
      updatedAt: new Date(),
    });

    if (note) {
      application.recruiterNotes.push({
        note,
        authorName: req.user.name,
        createdAt: new Date(),
      });
    }

    await application.save();

    // Create Notification for the Job Seeker
    const candidateId = application.applicant?._id || application.candidate?._id;
    if (candidateId) {
      let notifMsg = `Your application for "${application.job?.title}" has been updated to "${status}".`;
      let notifType = 'application_status';

      if (status === 'Interview Scheduled') {
        notifType = 'interview';
        notifMsg = `Interview Scheduled for "${application.job?.title}" on ${
          interviewDetails?.time ? `${interviewDetails.time}` : 'the scheduled date'
        }. Check details in My Applications.`;
      } else if (status === 'Hired') {
        notifMsg = `🎉 Congratulations! You have been marked as Hired for "${application.job?.title}" at ${application.job?.companyName}!`;
      }

      await Notification.create({
        recipient: candidateId,
        sender: req.user._id,
        title: `Application Status: ${status}`,
        message: notifMsg,
        type: notifType,
        link: '/my-applications',
      });
    }

    res.status(200).json({
      success: true,
      message: `Application marked as ${status}`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Job Seeker)
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('job', 'title employer');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const applicantId = application.applicant || application.candidate;
    if (applicantId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only withdraw your own applications',
      });
    }

    // Decrement applicantsCount on Job
    if (application.job) {
      await Job.findByIdAndUpdate(application.job._id, { $inc: { applicantsCount: -1 } });
    }

    // Notify Employer
    if (application.employer) {
      await Notification.create({
        recipient: application.employer,
        sender: req.user._id,
        title: 'Application Withdrawn',
        message: `${req.user.name} withdrew their application for "${application.job?.title}".`,
        type: 'system',
        link: `/employer/manage-jobs`,
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplicants,
  getAllEmployerApplications,
  updateApplicationStatus,
  withdrawApplication,
};
