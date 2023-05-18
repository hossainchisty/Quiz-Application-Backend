// Basic Lib Imports
const asyncHandler = require('express-async-handler');
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

    const quizzes = await Quiz.create({ title, description, categories, questions });

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
 * @method  POST
 * @access  Private
 * @return  Updated Question on quiz object
 */

const updateQuestionInQuiz = asyncHandler(async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const { question, options, correctAnswer } = req.body;

    const updatedQuiz = await Quiz.findOneAndUpdate(
      { _id: quizId, 'questions._id': questionId },
      {
        $set: {
          'questions.$.question': question,
          'questions.$.options': options,
          'questions.$.correctAnswer': correctAnswer,
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
 * @method  POST
 * @access  Private
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

module.exports = {
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestionToQuiz,
  updateQuestionInQuiz,
  deleteQuestionInQuiz,
};
