const Favorite = require('../models/favorite.model')
const factory = require('./handleFactory')
// const catchAsync = require('./../utils/catchAsync');

exports.getAllFavorite = factory.getAll(Favorite)
exports.getFavorite = factory.getOne(Favorite)
exports.createFavorite = factory.createOne(Favorite)
exports.updateFavorite = factory.updateOne(Favorite)
exports.deleteFavorite = factory.deleteOne(Favorite)

exports.addUserProductID = (req, res, next) => {
	if (!req.body.user) req.body.user = req.user._id
	if (!req.body.product) req.body.product = req.params.product_id
	next()
}
