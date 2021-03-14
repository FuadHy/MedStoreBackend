const express = require('express')
const categoryController = require('../controllers/category.controller')
const authController = require('../controllers/auth.controller')
const productRoute = require('./product.routes')
const subCategory = require('./subCategory.routes')

const categoryRouter = express.Router()

categoryRouter.use('/:category_id/product', productRoute)
categoryRouter.use('/:category_id/subCategory', subCategory)

categoryRouter.route('/').get(categoryController.getAllCategory).post(
	// authController.protect,
	// authController.restrictTo('admin'),
	categoryController.createCategory
)

categoryRouter
	.route('/:id')
	.get(categoryController.getCategory)
	.patch(
		// authController.protect,
		// authController.restrictTo('admin'),
		categoryController.updateCategory
	)
	.delete(
		// authController.protect,
		// authController.restrictTo('admin'),
		categoryController.deleteCategory
	)

module.exports = categoryRouter
