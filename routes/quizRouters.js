// Basic Lib Imports
const express = require('express');

const router = express.Router();

const { getQuiz, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizControllers');

// eslint-disable-next-line no-unused-vars
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getQuiz).post(createQuiz);
router.route('/:quizId').put(updateQuiz).delete(deleteQuiz);

// Exporting the Router
module.exports = router;
