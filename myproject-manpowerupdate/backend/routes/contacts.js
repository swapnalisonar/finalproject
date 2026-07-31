const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { exportToExcel } = require('../utils/exportExcel');
const Contact = require('../models/Contact');

const { create, list, remove } = require('../controllers/contactController');

router.post('/', create);
router.get('/', auth, list);
router.delete('/:id', auth, remove);

router.get('/export/excel', auth, async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  const rows = contacts.map((c) => ({
    name: c.name,
    email: c.email,
    phone: c.phone,
    subject: c.subject,
    message: c.message,
    sentAt: c.createdAt?.toISOString?.() || '',
  }));

  await exportToExcel(
    res,
    'contacts.xlsx',
    [
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Subject', key: 'subject' },
      { header: 'Message', key: 'message' },
      { header: 'Sent At', key: 'sentAt' },
    ],
    rows
  );
});

module.exports = router;
