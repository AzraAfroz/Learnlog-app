const Journal = require('../models/Journal');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Journal.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalStudyHours: { $sum: { $divide: ["$studyDuration", 60] } }
        }
      }
    ]);

    const result = stats[0] || { totalEntries: 0, totalStudyHours: 0 };

    res.status(200).json({
      success: true,
      data: {
        totalEntries: result.totalEntries,
        totalStudyHours: Number(result.totalStudyHours.toFixed(1))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWeeklySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const summary = await Journal.aggregate([
      { 
        $match: { 
          user: req.user._id,
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          duration: { $sum: { $divide: ["$studyDuration", 60] } }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayData = summary.find(s => s._id === dateStr);
      result.push({
        date: dateStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        duration: dayData ? Number(dayData.duration.toFixed(1)) : 0
      });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecentTopics = async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('topicName difficultyLevel createdAt studyDuration');

    res.status(200).json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
