const User = require('../models/user.model')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const { promisify } = require('util')
const sendEmail = require('../utils/email')
const crypto = require('crypto')
const bcrypt = require('bcryptjs');

const createToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
}

const createSendToken = (user, statusCode, res) => {
	const token = createToken(user._id)
	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true, // make the cookie not to be modiefied by the browser
	}
	// the next line of code is only valid if the security is https
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

	res.cookie('jwt', token, cookieOptions)

	// Remove password from output
	user.password = undefined

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	})
}

exports.signup = catchAsync(async (req, res, next) => {
	const nUser = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		phone: req.body.phone,
		country: req.body.country,
		region: req.body.region,
		city: req.body.city,
	};
	let exists = await User.findOne({where: {email:nUser.email}});
	if(exists){
		return res.json({success:false, code:1002})
	}
	if (nUser.password !== req.body.passwordConfirm)
		return res.json({success:false, code:1001})
	nUser.password = bcrypt.hashSync(nUser.password, 10);
	const newUser = await User.create(nUser)
	createSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
	// check if the email and the password are provided
	const { email, password } = req.body
	let user
	if (!email || !password) return next(new AppError('Both name and password must be provided', 400))
	// check if email and password are  in the database
	if(req.body.admin){
		user = await User.findOne({where: { email, role:'admin' }});
	} else {
		user = await User.findOne({where: { email }});
	}
	if (!user || !(bcrypt.compareSync(password, user.password))){
		return next(new AppError('Email or password is incorrect', 401))
	}
	// send a respose with a token
	createSendToken(user, 200, res)
})

exports.logout = catchAsync(async (req, res, next) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true, // make the cookie not to be modiefied by the browser
	})
	res.status(200).json({ status: 'success' })
})

exports.protect = catchAsync(async (req, res, next) => {
	// Step 1: check if token is provided
	let token
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
		token = req.headers.authorization.split(' ')[1]
	else if (req.cookie.jwt) token = req.cookie.jwt

	if (!token) return next(new AppError('You are not logged in! please login to get access'))

	// Step 2: verification of token
	let decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

	// Step 3: check if user still exist
	const currentUser = await User.findOne({where:{_id:decode.id}})
	if (!currentUser)
		return next(new AppError('The user belonging to this token does no longer exist.', 401))

	// step 4: check if user changed password after the token is issued
	//if (currentUser.changedPasswordAfter(decode.iat))
		//return next(new AppError('User recently changed password! Please log in again.', 401))
	// GRANT ACCESS TO PROTECTED ROUTE
	req.user = currentUser
	next()
})

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			return next(new AppError('you do not have a permission to perform this action', 403))
		next()
	}
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// 1) Get user based on POSTed email
	const user = await User.findOne({ email: req.body.email })
	if (!user) {
		return next(new AppError('There is no user with email address.', 404))
	}

	// 2) Generate the random reset token
	const resetToken = user.createPasswordResetToken()
	await user.save({ validateBeforeSave: false })

	// 3) Send it to user's email
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

	try {
		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10 min)',
			message,
		})

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
		})
	} catch (err) {
		user.passwordResetToken = undefined
		user.passwordResetExpires = undefined
		await user.save({ validateBeforeSave: false })

		return next(new AppError('There was an error sending the email. Try again later!'), 500)
	}
})

exports.resetPassword = async (req, res, next) => {
	// 1) Get user based on the token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	})

	// 2) If token has not expired, and there is user, set the new password
	if (!user) {
		return next(new AppError('Token is invalid or has expired', 400))
	}
	user.password = req.body.password
	user.passwordConfirm = req.body.passwordConfirm
	user.passwordResetToken = undefined
	user.passwordResetExpires = undefined
	await user.save()

	// 3) Update changedPasswordAt property for the user
	// 4) Log the user in, send JWT
	createSendToken(user, 200, res)
}

exports.updatePassword = catchAsync(async (req, res, next) => {
	// 1) Get user from collection
	const user = await User.findById(req.user.id).select('+password')

	// 2) Check if POSTed current password is correct
	if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError('Your current password is wrong.', 401))
	}

	// 3) If so, update password
	user.password = req.body.password
	user.passwordConfirm = req.body.passwordConfirm
	await user.save()
	// User.findByIdAndUpdate will NOT work as intended!

	// 4) Log user in, send JWT
	createSendToken(user, 200, res)
})

exports.isLoggedIn = async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			// 1) verify token
			const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

			// 2) Check if user still exists
			const currentUser = await User.findById(decoded.id)
			if (!currentUser) {
				return next()
			}

			// 3) Check if user changed password after the token was issued
			if (currentUser.changedPasswordAfter(decoded.iat)) {
				return next()
			}

			// THERE IS A LOGGED IN USER
			req.user = currentUser
			return next()
		} catch (err) {
			return next()
		}
	}
	next()
}

exports.profile = async (req, res) => {
	const {token} = req.body
	await jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
		if (err){
			return res.sendStatus(403)
		}
		let vUser = await User.findOne({where:{_id:user.id}})
		vUser.password = undefined
		return res.json({success:true, user:vUser})
	})
}