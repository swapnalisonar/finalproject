const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { exportToExcel } = require('../utils/exportExcel');
const Application = require('../models/Application');

const { create, list, remove } = require('../controllers/applicationController');

router.post('/', upload.single('resume'), create);
router.get('/', auth, list);
router.delete('/:id', auth, remove);

router.get('/export/excel', auth, async (req, res) => {
  const apps = await Application.find()
    .populate('job', 'title location')
    .sort({ createdAt: -1 });

  const rows = apps.map((a) => ({
    name: a.name,
    email: a.email,
    phone: a.phone,
    jobTitle: a.job?.title || a.jobTitle || '',
    location: a.job?.location || '',
    coverLetter: a.coverLetter,
    resume: a.resumeUrl,
    appliedAt: a.createdAt?.toISOString?.() || '',
  }));

  await exportToExcel(
    res,
    'applications.xlsx',
    [
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Job Title', key: 'jobTitle' },
      { header: 'Location', key: 'location' },
      { header: 'Cover Letter', key: 'coverLetter' },
      { header: 'Resume', key: 'resume' },
      { header: 'Applied At', key: 'appliedAt' },
    ],
    rows
  );
});

module.exports = router;
