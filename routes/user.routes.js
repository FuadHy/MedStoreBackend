const express = require('express')
const userController = require('../controllers/user.controller.js')
const authController = require('../controllers/auth.controller.js')
const requestRouter = require('../routes/request.routes')
const reviewRouter = require('../routes/review.routes')
const favoriteRouter = require('../routes/favorite.routes')

const userRouter = express.Router()

userRouter.use('/:user_id/request', requestRouter)
userRouter.use('/:user_id/review', reviewRouter)
userRouter.use('/:user_id/favorite', favoriteRouter)

userRouter.post('/signup', authController.signup)
userRouter.post('/login', authController.login)
userRouter.post('/profile', authController.profile)

userRouter.post('/forgotpassword', authController.forgotPassword)
userRouter.patch('/resetpassword/:token', authController.resetPassword)

userRouter.get('/logout', authController.logout)

userRouter.use(authController.protect)

userRouter.patch('/updateMyPassword', authController.updatePassword)

userRouter.use(authController.restrictTo('admin'))
userRouter.route('/').get(userController.getAllUser).post(userController.createUser)
userRouter
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser)

module.exports = userRouter
