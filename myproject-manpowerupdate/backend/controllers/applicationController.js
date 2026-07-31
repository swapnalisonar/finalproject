const Application = require('../models/Application');

exports.create = async (req, res) => {
  const { jobId, name, email, phone, coverLetter } = req.body;
  if (!jobId || !name || !email)
    return res.status(400).json({ message: 'Job ID, name and email are required' });

  const resumeUrl = req.file ? `/uploads/${req.file.filename}` : '';
  const resumeFileName = req.file ? req.file.originalname : '';

  const application = await Application.create({
    job: jobId,
    jobId,
    name,
    email,
    phone: phone || '',
    coverLetter: coverLetter || '',
    resumeUrl,
    resumeFileName,
  });

  res.status(201).json(application);
};

exports.list = async (req, res) => {
  const applications = await Application.find()
    .populate('job', 'title location')
    .sort({ createdAt: -1 });
  res.json(applications);
};

exports.remove = async (req, res) => {
  const app = await Application.findByIdAndDelete(req.params.id);
  if (!app) return res.status(404).json({ message: 'Application not found' });
  res.json({ message: 'Application deleted' });
};
