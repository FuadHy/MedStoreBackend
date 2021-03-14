const Request = require('../models/request.model')
const factory = require('./handleFactory')
const User = require('../models/user.model')
// const catchAsync = require('./../utils/catchAsync');

exports.getAllRequest = factory.getAll(Request)
exports.getRequest = factory.getOne(Request)
exports.createRequest = factory.createOne(Request)
exports.updateRequest = factory.updateOne(Request)
exports.deleteRequest = factory.deleteOne(Request)

exports.addUserProductID = (req, res, next) => {
	if (!req.body.user && req.user) req.body.user = req.user._id
	if (!req.body.product) req.body.product = req.params.product_id
	next()
}

exports.populateUserInfo = async (req, res, next) => {
	if (req.body.user) {
		// req.body.user is the id of the user which is set by addUserProductID middleware
		let user = await User.findById(req.body.user)
		if (user) {
			req.body.phone = user.name
			req.body.email = user.email
			req.body.address = user.city
			req.body.phone = user.phone
		}
	}
	next()
}
