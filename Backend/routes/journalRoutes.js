const express = require('express');
const {
  addEntry,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry
} = require('../controllers/journalController');
const { protectRoute } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protectRoute);

router.post('/add', addEntry);
router.get('/all', getAllEntries);
router.get('/:id', getEntryById);
router.put('/update/:id', updateEntry);
router.delete('/delete/:id', deleteEntry);

module.exports = router;
