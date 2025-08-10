const Holiday = require('../model/holiday');


exports.addHoliday = async (req, res) => {
  try {
    const { title, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and Date are required' });
    }

    const holiday = new Holiday({ title, date });
    await holiday.save();

    res.status(201).json({ success: true, message: 'Holiday added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding holiday' });
  }
};


exports.getUpcomingHolidays = async (req, res) => {
  try {
    const today = new Date();

    const holidays = await Holiday.find({ date: { $gte: today } })
                                  .sort({ date: 1 });

    res.json({ success: true, holidays });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching holidays' });
  }
};
