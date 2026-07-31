const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  list,
  publicList,
  get,
  create,
  update,
  remove,
} = require('../controllers/jobController');

router.get('/', list);
router.get('/public', publicList);
router.get('/:id', get);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;
