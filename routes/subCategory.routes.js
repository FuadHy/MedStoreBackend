const express = require('express')
const subCategoryController = require('../controllers/subCategory.controller')
const authController = require('../controllers/auth.controller')
const productRoute = require('./product.routes')

const subCategoryRouter = express.Router({ mergeParams: true })

subCategoryRouter.use('/:subCategory_id/product', productRoute)

subCategoryRouter.route('/').get(subCategoryController.getAllSubCategory).post(
	// authController.protect,
	// authController.restrictTo('admin'),
	subCategoryController.createSubCategory
)

subCategoryRouter
	.route('/:id')
	.get(subCategoryController.getSubCategory)
	.patch(
		// authController.protect,
		// authController.restrictTo('admin'),
		subCategoryController.updateSubCategory
	)
	.delete(
		// authController.protect,
		// authController.restrictTo('admin'),
		subCategoryController.deleteSubCategory
	)

module.exports = subCategoryRouter
