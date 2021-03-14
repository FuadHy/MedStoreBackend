const { DataTypes, DATE } = require('sequelize')
const { sequelize } = require('../database')
const config = require('../config.js')

const Category = require('./category.model')
const User = require('./user.model')
const Request = require('./request.model')
const Favorite = require('./favorite.model')
const SubCategory = require('./subCategory.model')

const Product = sequelize.define('Product', {
	// Model attributes are defined here
	_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	quantity: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
	},
	tags: {
		type: DataTypes.STRING,
		defaultValue: '',
	},
	brand: {
		type: DataTypes.STRING,
		defaultValue: '',
	},
	model: {
		type: DataTypes.STRING,
		defaultValue: '',
	},
	year: {
		type: DataTypes.DATEONLY,
		defaultValue: new Date(),
	},
	country: {
		type: DataTypes.STRING,
		defaultValue: '',
	},
	local_supplier: {
		type: DataTypes.STRING,
	},
	view_count: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	description: {
		type: DataTypes.TEXT,
		defaultValue: '',
	},
	characteristics: {
		type: DataTypes.STRING,
	},
	photo_urls: {
		type: DataTypes.STRING,
		defaultValue: '',
	},
	catalogue_url: {
		type: DataTypes.STRING,
		defaultValue: '',
	},
	company: {
		type: DataTypes.STRING,
	},
	condition: {
		type: DataTypes.STRING,
		defaultValue: config.product_condition.new,
	},
})

// Product.belongsTo(Category, { foreignKey: 'category' })
// Product.belongsTo(SubCategory, { foreignKey: 'subCategory' })
// Product.belongsToMany(User, { through: Request, foreignKey: 'product', uniqueKey: false })
// Product.belongsToMany(User, { through: Favorite, foreignKey: 'product', uniqueKey: false })

module.exports = Product

// productSchema.pre(/^find/, function (next) {
// 	this.populate({
// 		path: 'subCategory',
// 		select: 'name ',
// 	}).populate({
// 		path: 'category',
// 		select: '-__v -subCategories',
// 	})
// 	next()
// })

// }
// ProductSchema.index({
//     'name': 'text',
//     'tags': 'text',
//     'brand': 'text',
//     // 'category': 'text'
// });
