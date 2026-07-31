const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { get, update, uploadOwnerPhoto } = require('../controllers/companyController');

router.get('/', get);
router.put('/', auth, update);
router.post('/owner-photo', auth, upload.single('photo'), uploadOwnerPhoto);

module.exports = router;
