const express = require('express')
const messageController = require('../controllers/message.controller')
const authController = require('../controllers/auth.controller')

const router = express.Router({ mergeParams: true })

// router.use(authController.protect)

// router.use(authController.isLoggedIn)

router.route('/').post(messageController.createMessage).get(messageController.getAllMessage)

router
	.route('/:id')
	.get(messageController.getMessage)
	.patch(messageController.updateMessage)
	.delete(messageController.deleteMessage)

module.exports = router
