const express = require('express')
const favoriteController = require('../controllers/favorite.controller')
const authController = require('../controllers/auth.controller')

const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router.use(favoriteController.addUserProductID)

router.route('/').post(favoriteController.createFavorite).get(favoriteController.getAllFavorite)

router
	.route('/:id')
	.get(favoriteController.getFavorite)
	.patch(favoriteController.updateFavorite)
	.delete(favoriteController.deleteFavorite)

module.exports = router
