const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employer ID is required'],
    },
    category: {
      type: String,
      required: [true, 'Please select a job category'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide job description'],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
      trim: true,
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'On-site',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    experienceRequired: {
      type: String,
      default: '1-3 years',
      trim: true,
    },
    minSalary: {
      type: Number,
      default: 0,
    },
    maxSalary: {
      type: Number,
      default: 0,
    },
    salaryCurrency: {
      type: String,
      default: 'INR',
    },
    vacancies: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 vacancy is required'],
    },
    educationQualification: {
      type: String,
      default: "Bachelor's Degree or equivalent",
      trim: true,
    },
    deadline: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Closed', 'Draft', 'active', 'closed', 'draft'],
      default: 'Active',
    },
    approvalStatus: {
      type: String,
      enum: ['Approved', 'Pending', 'Rejected'],
      default: 'Approved',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes requested by prompt
jobSchema.index({ title: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ employer: 1 });
jobSchema.index({ approvalStatus: 1 });
jobSchema.index({ minSalary: 1, maxSalary: 1 });
jobSchema.index({ createdAt: -1 });

// Full text search
jobSchema.index({
  title: 'text',
  description: 'text',
  companyName: 'text',
  requiredSkills: 'text',
  location: 'text',
});

module.exports = mongoose.model('Job', jobSchema);
