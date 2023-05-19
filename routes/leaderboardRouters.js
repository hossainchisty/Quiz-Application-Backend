// Basic Lib Imports
const express = require('express');

const router = express.Router();

const { leaderboardEntries, leaderBoard } = require('../controllers/leaderboardController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(leaderBoard);
router.route('/:quizId').get(protect, leaderboardEntries);

// Exporting the Router
module.exports = router;
