const { Sequelize, DataTypes, STRING, NUMBER } = require('sequelize')

const sequelize = new Sequelize('medstoreet', 'root', '', { dialect: 'mysql' })
// const sequelize = new Sequelize('medstoreet_database', 'medstoreet_biruk', 'uL)pjb9zKU!(', {
// 	dialect: 'mysql',
// })

const checkConnection = async function () {
	try {
		await sequelize.authenticate()
		console.log('Connection has been established successfully.')
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
}

module.exports = {
	sequelize,
	checkConnection,
}