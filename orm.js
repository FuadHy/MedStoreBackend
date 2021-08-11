const { Sequelize, DataTypes, STRING, NUMBER } = require('sequelize')
const sequelize = new Sequelize('djangojs', 'root', '', { dialect: 'mysql' })

const checkConnection = async function () {
	try {
		await sequelize.authenticate()
		console.log('Connection has been established successfully.')
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
}
require('fs').writeFileSync('seql', JSON.stringify(sequelize), 'UTF-8')
checkConnection()
console.log(sequelize)
