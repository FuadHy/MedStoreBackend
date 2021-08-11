const Product = require('../models/product.model')
const factory = require('./handleFactory')
// const catchAsync = require('./../utils/catchAsync');

exports.getAllProduct = factory.getAll(Product)
exports.getRecentProduct = factory.getRecent(Product)
exports.getProduct = factory.getOne(Product)
exports.createProduct = factory.createOne(Product)
exports.updateProduct = factory.updateOne(Product)
exports.deleteProduct = factory.deleteOne(Product)

// needs new ways of implementaton
exports.getProductRating = (req, res, next) => {
	productServices
		.getProductRating(req.params.product_id)
		.then(data => {
			res.status(data.status).json(data)
		})
		.catch(err => {
			res.status(err.status).json(err)
		})
}

exports.getProductsByCategoryName = (req, res, next) => {
	productServices
		.getProductsByCategoryName(req.params.category_name)
		.then(data => {
			res.status(data.status).json(data)
		})
		.catch(err => {
			res.status(err.status).json(err)
		})
}

exports.searchProductByNameAndCategory = (req, res, next) => {
	productServices
		.searchProductByNameAndCategory(req.params.search_term)
		.then(data => {
			res.status(data.status).json(data)
		})
		.catch(err => {
			res.status(err.status).json(err)
		})
}
