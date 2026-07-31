const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const { seedAdmin } = require('./config/seed');

const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');
const contactsRoutes = require('./routes/contacts');
const companyRoutes = require('./routes/company');
const authRoutes = require('./routes/auth');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/company', companyRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Manpower Recruitment API is running' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
