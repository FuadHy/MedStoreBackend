const express = require('express')
const requestController = require('../controllers/request.controller')
const authController = require('../controllers/auth.controller')

const router = express.Router({ mergeParams: true })

// router.use(authController.protect)

// router.use(authController.isLoggedIn)

router
	.route('/')
	.post(requestController.populateUserInfo, requestController.createRequest)
	.get(requestController.getAllRequest)

router
	.route('/:id')
	.get(requestController.getRequest)
	.patch(requestController.updateRequest)
	.delete(requestController.deleteRequest)

module.exports = router
