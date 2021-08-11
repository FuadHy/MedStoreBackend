const express = require('express')
const productController = require('../controllers/product.controller.js')
const authController = require('../controllers/auth.controller')
const requestRouter = require('../routes/request.routes')
const reviewRouter = require('../routes/review.routes')
const favoriteRouter = require('../routes/favorite.routes')

const productRouter = express.Router({ mergeParams: true })

productRouter.use('/:product_id/request', requestRouter)
productRouter.use('/:product_id/review', reviewRouter)
productRouter.use('/:product_id/favorite', favoriteRouter)

productRouter
	.route('/')
	.get(productController.getAllProduct)
	// .post(authController.protect,authController.restrictTo('admin'),productController.createProduct);
	.post(productController.createProduct)
productRouter.route('/recent').get(productController.getRecentProduct)

productRouter
	.route('/:id')
	.get(productController.getProduct)
	// .patch(authController.protect,authController.restrictTo('admin'),productController.updateProduct)
	.patch(productController.updateProduct)
	// .delete(authController.protect,authController.restrictTo('admin'), productController.deleteProduct);
	.delete(productController.deleteProduct)

// needs new ways of implementation
productRouter.route('/search/:search_term').get(productController.searchProductByNameAndCategory)

productRouter.route('/rating/:product_id').get(productController.getProductRating)

productRouter.route('/category/:category_name').get(productController.getProductsByCategoryName)

module.exports = productRouter
