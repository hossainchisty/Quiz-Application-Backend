// Basic Lib Imports
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModels');

/**
 * @desc  Get all category
 * @route   /api/v1/category/
 * @method  GET
 * @access  Private
 * @return List of category
 */

const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.find({}).sort({
    createdAt: -1,
  });
  res.status(200).json(category);
});

/**
 * @desc    Create a new category
 * @route   /api/v1/category
 * @method  POST
 * @access  Private
 * @returns {object} Newly added category in json format
 */

const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!req.body.name) {
    res.status(400);
    throw new Error('Please add category name.');
  }

  const taskCategory = await Category.create({
    // user: req.user.id, TODO: Later we should add user
    name,
  });
  res.status(201).json(taskCategory);
});

/**
 * @desc    Update category
 * @route   /api/v1/category/:id
 * @method  PUT
 * @access  Private
 * @return Updated category object
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const category = await Category.findById(id).lean();
  if (!category) {
    res.status(400);
    throw new Error('Category not found');
  }

  // Make sure the logged in user matches the task user
  if (category.user.toString() !== userId) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await Category.updateOne({ _id: id, user: userId }, req.body);
  const updatedCategory = await Category.findById(id);
  res.status(200).json(updatedCategory);
});

/**
 * @desc    Delete category
 * @route   /api/v1/category/:id
 * @method  DELETE
 * @access  Private
 * @return  Deleted category
 */
const deleteCategory = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the category user
    if (category.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const deletedCategory = await Category.findByIdAndRemove(req.params.id, req.body, {
      new: true,
    });

    if (!deletedCategory) {
      res.status(400);
      throw new Error('Category not found');
    }
    res.status(200).json({
      data: deletedCategory,
      id: req.params.id,
      message: 'Category was deleted.',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
