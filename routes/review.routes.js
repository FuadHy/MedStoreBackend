const express = require('express')
const reviewController = require('../controllers/review.controller')
const authController = require('../controllers/auth.controller')

const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router.use(reviewController.addUserProductID)

router.route('/').post(reviewController.createReview).get(reviewController.getAllReview)

router
	.route('/:id')
	.get(reviewController.getReview)
	.patch(reviewController.updateReview)
	.delete(reviewController.deleteReview)

module.exports = router
