/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
// Basic Lib Imports
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [String],
        correctAnswer: Number,
      },
    ],
    userAnswers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: false,
        },
        selectedAnswer: Number,
        isCorrect: Boolean,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Instance method to calculate the user's score and update the userAnswers array
quizSchema.methods.calculateScore = function () {
  let score = 0;
  this.userAnswers.forEach((answer) => {
    const question = this.questions.find((question) => question._id.equals(answer.questionId));
    if (question && question.correctAnswer === answer.selectedAnswer) {
      answer.isCorrect = true;
      score++;
    } else {
      answer.isCorrect = false;
    }
  });
  return score;
};

// Instance method to get the user's progress through the quiz
quizSchema.methods.getProgress = function () {
  const totalQuestions = this.questions.length;
  const answeredQuestions = this.userAnswers.filter((answer) => answer.isCorrect).length;
  const progress = (answeredQuestions / totalQuestions) * 100;
  return progress;
};

module.exports = mongoose.model('Quiz', quizSchema);
