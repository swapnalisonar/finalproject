const Company = require('../models/Company');

exports.get = async (req, res) => {
  const company = await Company.getSingleton();
  res.json(company);
};

exports.update = async (req, res) => {
  const company = await Company.getSingleton();
  Object.assign(company, req.body);
  await company.save();
  res.json(company);
};

exports.uploadOwnerPhoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const company = await Company.getSingleton();
  company.ownerPhotoUrl = `/uploads/${req.file.filename}`;
  await company.save();
  res.json({ ownerPhotoUrl: company.ownerPhotoUrl });
};
