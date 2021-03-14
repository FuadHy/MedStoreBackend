const catchAsync = require('../utils/catchAsync')
const Product = require('../models/product.model')
const { Op } = require('sequelize')

exports.search = catchAsync(async (req, res, next) => {
	// let products = await Product.find({
	// 	$or: [{ name: { $regex: req.body.keys[0] } }, { tags: { $regex: req.body.keys[0] } }],
	// })
	let products = await Product.findAll({
		where: {
			[Op.or]: [
				{ name: { [Op.substring]: req.body.keys[0] } },
				{ tags: { [Op.substring]: req.body.keys[0] } },
			],
		},
	})
	products = products.map(product => {
		return {
			name: product.name,
			_id: product._id,
		}
	})
	res.status(200).json({ status: 'success', data: products })
})
