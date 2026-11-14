const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant reference is required'],
    },
    // Alias field to maintain backwards compatibility
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employer reference is required'],
    },
    // Alias field
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview Scheduled',
        'Rejected',
        'Hired',
        // Also support lowercase/hyphenated for compatibility
        'applied',
        'under-review',
        'shortlisted',
        'interview',
        'rejected',
        'hired',
      ],
      default: 'Applied',
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume is required to apply'],
    },
    resumeOriginalName: {
      type: String,
      default: 'Resume.pdf',
    },
    coverLetter: {
      type: String,
      default: '',
      maxlength: [3000, 'Cover letter cannot exceed 3000 characters'],
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    expectedSalary: {
      type: Number,
      default: 0,
    },
    noticePeriod: {
      type: String,
      default: 'Immediate',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    recruiterNotes: [
      {
        note: { type: String, required: true },
        authorName: { type: String, default: 'Recruiter' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    interviewDetails: {
      date: { type: Date },
      scheduledDate: { type: Date },
      time: { type: String, default: '' },
      mode: {
        type: String,
        enum: ['Google Meet', 'Zoom', 'In-Person', 'Phone Call', 'Microsoft Teams'],
        default: 'Google Meet',
      },
      meetingLink: { type: String, default: '' },
      link: { type: String, default: '' },
      notes: { type: String, default: '' },
      status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'scheduled', 'completed', 'cancelled'],
        default: 'Scheduled',
      },
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Populate candidate & recruiter aliases automatically before save
applicationSchema.pre('save', function (next) {
  if (this.applicant && !this.candidate) {
    this.candidate = this.applicant;
  }
  if (this.employer && !this.recruiter) {
    this.recruiter = this.employer;
  }
  next();
});

// Important indexes specified in prompt
// Prevent duplicate applications from the same user for the same job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ employer: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
