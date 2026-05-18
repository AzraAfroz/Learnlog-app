const Journal = require('../models/Journal');


exports.addEntry = async (req, res) => {
  try {
    const { topicName, description, studyDuration, difficultyLevel } = req.body;

    const entry = await Journal.create({
      user: req.user.id,
      topicName,
      description,
      studyDuration,
      difficultyLevel
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getAllEntries = async (req, res) => {
  try {
    const { search, difficulty, date } = req.query;

    let query = { user: req.user.id };

    if (search) {
      query.topicName = { $regex: search, $options: 'i' };
    }

    if (difficulty) {
      query.difficultyLevel = difficulty;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const entries = await Journal.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getEntryById = async (req, res) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, user: req.user.id });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateEntry = async (req, res) => {
  try {
    let entry = await Journal.findOne({ _id: req.params.id, user: req.user.id });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    entry = await Journal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteEntry = async (req, res) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, user: req.user.id });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    await Journal.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Journal entry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
