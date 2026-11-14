const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Please provide reason for reporting'],
      enum: [
        'Spam or Scam',
        'Misleading Job Title or Description',
        'Asking for Money or Sensitive Data',
        'Expired or Filled Listing',
        'Offensive or Inappropriate Content',
        'Other',
      ],
      default: 'Spam or Scam',
    },
    details: {
      type: String,
      default: '',
      maxlength: [1000, 'Details cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Dismissed', 'Action Taken'],
      default: 'Pending',
    },
    actionTaken: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ job: 1, reporter: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);

