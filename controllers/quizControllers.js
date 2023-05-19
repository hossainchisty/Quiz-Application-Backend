/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
// Basic Lib Imports
const asyncHandler = require('express-async-handler');
const Leaderboard = require('../models/leaderboardModels');
const Quiz = require('../models/quizModels');

/**
 * @desc  Get all quizzes
 * @route   /api/v1/quizzes
 * @method  GET
 * @access  Public
 * @return List of quiz
 */
const getQuiz = asyncHandler(async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('categories');
    res.json(quizzes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to get quizzes' });
  }
});

/**
 * @desc     Create a new quiz
 * @route   /api/v1/quizzes
 * @method  POST
 * @access  Private
 * @returns {object} Newly added quizzes in json format
 */

const createQuiz = asyncHandler(async (req, res) => {
  try {
    const { title, description, categories, questions } = req.body;

    const quizzes = await Quiz.create({
      user: req.user.id,
      title,
      description,
      categories,
      questions,
    });

    res.status(201).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

/**
 * @desc    Update quiz properties
 * @route   /api/v1/quizzes/:quizId
 * @method  PUT
 * @access  Private
 * @param {String} quizId: The id of the quiz
 * @return  Updated quiz properties
 */

const updateQuiz = asyncHandler(async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, description, questions } = req.body;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { title, description, questions },
      { new: true }
    );
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

/**
 * @desc    Delete quiz
 * @route   /api/v1/quizzes/:quizId
 * @method  DELETE
 * @access  Private
 * @param {String} quizID: The id of the quiz to delete.
 * @return  message: Quiz removed
 */

const deleteQuiz = asyncHandler(async (req, res) => {
  try {
    const { quizId } = req.params;
    await Quiz.findByIdAndRemove(quizId);
    res.json({ message: 'Quiz removed' });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

/**
 * @desc     Add a new question to a quiz
 * @route   /api/v1/quizzes/:quizId/questions
 * @method  POST
 * @access  Private
 * @param {String} quizID: The id of the quiz to add question
 * @return  Newly created Question on quiz object
 */

const addQuestionToQuiz = asyncHandler(async (req, res) => {
  try {
    const { quizId } = req.params;
    const { question, options, answers } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $push: { questions: { question, options, answers } } },
      { new: true }
    );

    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add question to quiz' });
  }
});

/**
 * @desc     Update a question in a quiz
 * @route   /api/v1/quizzes/:quizId/questions/:questionId
 * @method  PUT
 * @access  Private
 * @param   {String} quizId: The ID of the selected quiz.
 * @param   {String} questionId: The ID of the question to update.
 * @return  Updated Question on quiz object
 */

const updateQuestionInQuiz = asyncHandler(async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const { question, options, answers } = req.body;

    const updatedQuiz = await Quiz.findOneAndUpdate(
      { _id: quizId, 'questions._id': questionId },
      {
        $set: {
          'questions.$.question': question,
          'questions.$.options': options,
          'questions.$.answers': answers,
        },
      },
      { new: true }
    );

    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question in quiz' });
  }
});

/**
 * @desc    Delete a question from a quiz
 * @route   /api/v1/quizzes/:quizId/questions/:questionId
 * @method  DELETE
 * @access  Private
 * @param   {String} quizId: The ID of the selected quiz.
 * @param   {String} questionId: The ID of the selected question.
 * @return  Delete a question from a quiz
 */

const deleteQuestionInQuiz = asyncHandler(async (req, res) => {
  try {
    const { quizId, questionId } = req.params;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $pull: { questions: { _id: questionId } } },
      { new: true }
    );

    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question from quiz' });
  }
});

/**
 * @desc    Submit the user's answers for a specific quiz.
 * @route   /api/v1/quizzes/:quizId/submit
 * @method  POST
 * @access  Private
 * @param   {String} quizId: The ID of the selected quiz.
 * @return  200 OK: Returns the user's score and progress.
 */

const submitQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const answers = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the category user
    if (quiz.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Update the userAnswers array in the quiz model
    quiz.userAnswers = answers;

    // Calculate the score and get progress
    const score = quiz.calculateScore();
    const progress = quiz.getProgress();

    // Update leaderboard entry
    await Leaderboard.findOneAndUpdate(
      { quiz: quizId, user: req.user.id },
      { score },
      { upsert: true }
    );

    // Save the changes to the quiz
    await quiz.save();

    res.status(200).json({ score, progress });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to submit quiz answers' });
  }
});

/**
 * @desc     Get quiz results
 * @route   /api/v1/quizzes/:quizId/results
 * @method  GET
 * @access  Private
 * @param   {String} quizId: The ID of the selected quiz.
 * @return  Quiz results object
 */

const getQuizResult = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the category user
    if (quiz.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Calculate the score and get the question results
    const score = quiz.calculateScore();
    const questionResults = quiz.userAnswers.map((answer) => {
      const question = quiz.questions.find((q) => q._id.equals(answer.questionId));
      return {
        question: question.question,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.isCorrect,
      };
    });

    res.status(200).json({ score, questionResults });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz results' });
  }
});

/**
 * @desc    Get quizzes filtered by a specific category.
 * @route   /api/v1/quizzes/category/:categoryId
 * @method  GET
 * @access  Public
 * @param   {String} categoryId: The ID of the category.
 * @return  200 OK: Returns an array of quizzes that belong to the specified category.
 */

const getQuizbyCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  try {
    const quizzes = await Quiz.find({ categories: categoryId }).select(
      '-questions.correctAnswer -userAnswers'
    );
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

/**
 * @desc   Search quizzes by title or description using a keyword.
 * @route   /api/v1/quizzes/search/:keyword
 * @method  GET
 * @access  Public
 * @param   {String} keyword: The keyword to search for in quiz titles or descriptions.

 * @return  200 OK: Returns an array of quizzes that match the search criteria.
 */

const searchQuiz = asyncHandler(async (req, res) => {
  const { keyword } = req.params;
  try {
    const quizzes = await Quiz.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ],
    }).select('-questions.correctAnswer -userAnswers');
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

module.exports = {
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
};
