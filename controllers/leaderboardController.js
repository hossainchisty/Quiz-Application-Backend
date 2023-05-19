/* eslint-disable consistent-return */
// Basic Lib Imports
const asyncHandler = require('express-async-handler');
const Leaderboard = require('../models/leaderboardModels');

/**
 * @desc     Get Overall Leaderboard
 * @route   /api/v1/leaderboard/
 * @method  GET
 * @access  Public
 * @return  200 OK: Returns an array of leaderboard entries, including the user's name and score, sorted by the highest scores.
 */

const leaderBoard = asyncHandler(async (req, res) => {
  try {
    const leaderboard = await Leaderboard.aggregate([
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          name: '$user.full_name',
          avatar: '$user.avatar',
          score: '$totalScore',
        },
      },
      {
        $sort: { score: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * @desc     Get the leaderboard for a specific quiz, displaying the highest scoring users.
 * @route   /api/v1/leaderboard/:quizId
 * @method  GET
 * @access  Private
 * @param   {String} quizId: The ID of the quiz.
 * @return  200 OK: Returns an array of leaderboard entries, including the user's name and score, sorted by the highest scores.
 */

const leaderboardEntries = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  try {
    const leaderboard = await Leaderboard.find({ quiz: quizId })
      .sort({ score: -1 })
      .limit(10)
      .populate('user', 'full_name avatar')
      .lean();

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = {
  leaderBoard,
  leaderboardEntries,
};
