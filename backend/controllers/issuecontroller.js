const Issue = require('../model/issue');


exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('employee', 'firstName lastName employeeId') // select only relevant fields
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


exports.respondToIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ success: false, message: 'Response is required' });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    issue.response = response;
    issue.updatedAt = new Date();
    await issue.save();

    res.status(200).json({ success: true, message: 'Response added successfully', data: issue });
  } catch (error) {
    console.error('Error responding to issue:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};




exports.reportIssue = async (req, res) => {
  try {
    const { subject, description } = req.body;
    const { userId } = req.user; 

    if (!subject || !description) {
      return res.status(400).json({ success: false, message: 'Subject and description are required' });
    }

    const newIssue = new Issue({
      employee: userId,
      subject,
      description
    });

    await newIssue.save();

    res.status(201).json({ success: true, message: 'Issue reported successfully', data: newIssue });
  } catch (error) {
    console.error('Error reporting issue:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


exports.getResponse = async (req, res) => {
  try {
    const { userId } = req.user; 

    const issues = await Issue.find({ employee: userId })
      .select('subject description response createdAt updatedAt') 
      .sort({ createdAt: -1 }); // recent issues first

    res.status(200).json({
      success: true,
      data: issues
    });

  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
