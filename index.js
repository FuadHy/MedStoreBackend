const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const route = require('./routes/index.js')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const dotenv = require('dotenv')
const helmet = require('helmet')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
dotenv.config({ path: './config.env' })
const database = require('./database')

process.on('uncaughtException', err => {
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
	console.log(err.name, err.message)
	process.exit(1)
})

const AppError = require('./utils/AppError')
const globalErrorHandler = require('./controllers/errorControllers')
const compression = require('compression')
const relationship = require('./models/relationship.js')
// const { database } = require('config.js')

const app = express()
const port = process.env.PORT || 3001

app.use(logger('dev'))
// statically accessed files
app.use(express.static(`${__dirname}/public`))

// parse incoming cookie
app.use(cookieParser())

// allow CORS
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')
	res.header('Access-Control-Allow-Headers', '*')
	next()
})
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Authorization', '*')
	res.setHeader('Access-Control-Allow-Credentials', true)
	if (req.method === 'OPTIONS') {
		console.log('gottti')
		res.sendStatus(200)
	} else {
		next()
	}
})

// set security HTTP header http://localhost:3001/ll/img/uploads/ad1.jpg
app.use(helmet())

// body parser
app.use('/uploads', express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//data sanitization againist NoSQL query injection
app.use(mongoSanitize())

// data sanitization
app.use(xss())

// prevent parameter polution
app.use(hpp())

//applying compression of txt sent to client
app.use(compression())

// used for testting only
// app.use((req, res, next) => {
// 	console.log(req.body)
// 	next()
// })
// used for testting only--- end ---

app.use('/', route)

relationship.addRelationship()
database.sequelize.sync()
// database.sequelize.sync({ force: true })
database.checkConnection()

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})
app.use(globalErrorHandler)

app.listen(port)
console.log(`Server listening on port: ${port}`)

process.on('unhandledRejection', err => {
	console.log('UNHANDLED REJECTION! 💥 Shutting down...')
	console.log(err.name, err.message)
	
})
