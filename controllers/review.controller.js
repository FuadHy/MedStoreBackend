const Review = require('../models/favorite.model')
const factory = require('./handleFactory')
// const catchAsync = require('./../utils/catchAsync');

exports.getAllReview = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)

exports.addUserProductID = (req, res, next) => {
	if (!req.body.user) req.body.user = req.user._id
	if (!req.body.product) req.body.product = req.params.product_id
	next()
}
