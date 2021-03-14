const { DataTypes } = require('sequelize')
const { sequelize } = require('../database')

const Favorite = sequelize.define('Favorite', {
	// Model attributes are defined here
	_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
})

module.exports = Favorite
