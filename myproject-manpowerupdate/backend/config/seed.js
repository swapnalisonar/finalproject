const Admin = require('../models/Admin');

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@manpower.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const exists = await Admin.findOne({ email });
  if (exists) return;

  await Admin.create({ email, password });
  console.log(`Seeded admin: ${email}`);
};

module.exports = { seedAdmin };
