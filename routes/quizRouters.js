// Basic Lib Imports
const express = require('express');

const router = express.Router();

const {
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestionToQuiz,
  updateQuestionInQuiz,
  deleteQuestionInQuiz,
  submitQuiz,
  getQuizResult,
  getQuizbyCategory,
  searchQuiz,
} = require('../controllers/quizControllers');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getQuiz).post(protect, createQuiz);

router.route('/:quizId').put(protect, updateQuiz).delete(protect, deleteQuiz);

router.route('/:quizId/questions').post(protect, addQuestionToQuiz);

router.route('/:quizId/submit').post(protect, submitQuiz);

router.route('/:quizId/results').get(protect, getQuizResult);

router.route('/category/:categoryId').get(getQuizbyCategory);

router.route('/search/:keyword').get(searchQuiz);

router
  .route('/:quizId/questions/:questionId')
  .put(updateQuestionInQuiz)
  .delete(deleteQuestionInQuiz);

// Exporting the Router
module.exports = router;
