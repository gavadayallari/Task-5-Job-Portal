const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      unique: true,
      trim: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    logo: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    industry: {
      type: String,
      default: 'Information Technology',
      trim: true,
    },
    companySize: {
      type: String,
      default: '50-200 employees',
    },
    foundedYear: {
      type: Number,
      default: 2015,
    },
    location: {
      type: String,
      default: 'Bengaluru, India',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    activeJobsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.index({ name: 'text', industry: 'text', location: 'text' });

module.exports = mongoose.model('Company', companySchema);

