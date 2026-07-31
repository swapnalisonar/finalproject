const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    type: { type: String, default: 'Full-time', trim: true },
    category: { type: String, default: 'General', trim: true },
    salary: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    requirements: { type: [String], default: [] },
    vacancies: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
