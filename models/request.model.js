const { DataTypes, DATE } = require('sequelize')
const { sequelize } = require('../database')

const Request = sequelize.define('Request', {
	// Model attributes are defined here
	_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	name: DataTypes.STRING,
	message: DataTypes.TEXT,
	email: DataTypes.STRING,
	phone: DataTypes.STRING,
	address: DataTypes.STRING,
	quantity: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
	},
	processed: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
})

module.exports = Request

// requestSchema.pre(/^find/, function (next) {
// 	this.populate({
// 		path: 'user',
// 		select: 'name email phone city country subscription',
// 	}).populate({
// 		path: 'product',
// 		select: 'name brand model company quantity -category -subCategory',
// 	})
// 	next()
// })
