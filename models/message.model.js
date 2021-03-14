const { DataTypes } = require('sequelize')
const { sequelize } = require('../database')

const Message = sequelize.define('Message', {
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
	processed: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
})

module.exports = Message
