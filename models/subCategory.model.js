const { DataTypes } = require('sequelize')
const { sequelize } = require('../database')
const Category = require('./category.model')
const Product = require('./product.model')

const SubCategory = sequelize.define('SubCategory', {
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

// SubCategory.belongsTo(Category, { foreignKey: 'category' })
// SubCategory.hasMany(Product, { foreignKey: 'subCategory' })

module.exports = SubCategory
