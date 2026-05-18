const express = require('express');
const {
  getStats,
  getWeeklySummary,
  getRecentTopics
} = require('../controllers/dashboardController');
const { protectRoute } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protectRoute);

router.get('/stats', getStats);
router.get('/weekly-summary', getWeeklySummary);
router.get('/recent-topics', getRecentTopics);

module.exports = router;
