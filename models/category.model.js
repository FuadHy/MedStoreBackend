const { DataTypes } = require('sequelize')
const { sequelize } = require('../database')

const SubCategory = require('./subCategory.model')
const Product = require('./product.model')

const Category = sequelize.define('Category', {
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
	description: DataTypes.TEXT,
})

// Category.hasMany(Product, { foreignKey: 'category' })
// Category.hasMany(SubCategory, { foreignKey: 'category' })

module.exports = Category
