const express = require('express');
const router = express.Router();
const IssueController = require('../controllers/issuecontroller');

const { identifier, authorize } = require('../middlewares/identification')

//For Admin Use
router.get('/all', identifier, authorize('admin'), IssueController.getAllIssues);
router.put('/reponse/:id', identifier, authorize('admin'), IssueController.respondToIssue);

//For Employee Use
router.post('/report', identifier, IssueController.reportIssue);
router.get('/get-response', identifier, IssueController.getResponse);

module.exports = router;