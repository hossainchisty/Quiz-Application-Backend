// Basic Lib Imports
const express = require('express');

const router = express.Router();

const {
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const { protect } = require('../middleware/authMiddleware');

// Adding and getting categories
router.route('/').get(getCategory).post(addCategory);

// Deleting and updating categories
router.route('/:id').delete(protect, deleteCategory).put(protect, updateCategory);

// Exporting the Router
module.exports = router;
