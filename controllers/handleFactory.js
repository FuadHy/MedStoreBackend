const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const APIFeatures = require('../utils/APIFeatures')
const helperFunctions = require('../utils/helperFunctions')
const Category = require('./../models/category.model')
const SubCategory = require('./../models/subCategory.model')
const User = require('./../models/user.model')
const Product = require('./../models/product.model')
const Favorite = require('../models/favorite.model')
const jwt = require('jsonwebtoken')

exports.deleteOne = Model =>
	catchAsync(async (req, res, next) => {
		let doc = await Model.findByPk(req.params.id)
		if (!doc) {
			return next(new AppError('No document found with that ID', 404))
		}
		await doc.destroy()
		res.status(204).json({
			status: 'success',
			data: null,
		})
	})

exports.updateOne = (Model, ...arrayProperties) => {
	return catchAsync(async (req, res, next) => {
		let updated = await Model.findByPk(req.params.id)
		if (!updated) {
			return next(new AppError('No document found with that ID', 404))
		}
		for (key in req.body) {
			updated[key] = req.body[key]
			console.log(req.body[key])
		}
		let doc = await updated.save()
		if (helperFunctions.resourceNeeded(req.baseUrl) == 'product') {
			let category = await doc.getCategory()
			category = JSON.parse(JSON.stringify(category))
			let subCategory = await doc.getSubCategory()
			subCategory = JSON.parse(JSON.stringify(subCategory))
			doc = JSON.parse(JSON.stringify(doc))
			doc.Category = category
			doc.SubCategory = subCategory
			res.status(201).json({
				status: 'success',
				data: doc,
			})
			return
		} else if (helperFunctions.resourceNeeded(req.baseUrl) == 'subCategory') {
			let category = await doc.getCategory()
			category = JSON.parse(JSON.stringify(category))
			doc = JSON.parse(JSON.stringify(doc))
			doc.Category = category
			res.status(201).json({
				status: 'success',
				data: doc,
			})
			return
		}
		doc = JSON.parse(JSON.stringify(updated))
		res.status(200).json({
			status: 'success',
			data: doc,
		})
	})
}

exports.createOne = Model =>
	catchAsync(async (req, res, next) => {
		let doc = await Model.create(req.body)
		if (helperFunctions.resourceNeeded(req.baseUrl) == 'product') {
			let category = await doc.getCategory()
			category = JSON.parse(JSON.stringify(category))
			let subCategory = await doc.getSubCategory()
			subCategory = JSON.parse(JSON.stringify(subCategory))
			doc = JSON.parse(JSON.stringify(doc))
			doc.Category = category
			doc.SubCategory = subCategory
			res.status(201).json({
				status: 'success',
				data: doc,
			})
			return
		} else if (helperFunctions.resourceNeeded(req.baseUrl) == 'subCategory') {
			let category = await doc.getCategory()
			category = JSON.parse(JSON.stringify(category))
			doc = JSON.parse(JSON.stringify(doc))
			doc.Category = category
			res.status(201).json({
				status: 'success',
				data: doc,
			})
			return
		}
		doc = JSON.parse(JSON.stringify(doc))
		res.status(201).json({
			status: 'success',
			data: doc,
		})
	})

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let option = {}
		if (helperFunctions.resourceNeeded(req.baseUrl) == 'subCategory') {
			option.include = Category
		} else if (helperFunctions.resourceNeeded(req.baseUrl) == 'product') {
			option.include = [Category, SubCategory]
		} else if (helperFunctions.resourceNeeded(req.baseUrl) == 'request') {
			option.include = [User, Product]
			// option.include = Product
		}
		let doc = await Model.findByPk(req.params.id, option)
		if (!doc) {
			return next(new AppError('No document found with that ID', 404))
		}
		doc = JSON.parse(JSON.stringify(doc))
		res.status(200).json({
			status: 'success',
			data: doc,
		})
	})

exports.getAll = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		// To allow for nested GET requests on product (hack)
		let option = {}
		if (helperFunctions.resourceNeeded(req.baseUrl) == 'subCategory') {
			option.include = Category
		} else if (helperFunctions.resourceNeeded(req.baseUrl) == 'product') {
			option.include = [Category, SubCategory]
			option.itHasPath = true
		} else if (helperFunctions.resourceNeeded(req.baseUrl) == 'request') {
			option.include = [User, Product]
		} else if (helperFunctions.resourceNeeded(req.baseUrl) == 'favorite') {
			option.fav = true
			option.where = {user:req.body.user}
			option.include = [User, Product]
		}
		if (req.params.product_id) option.where = { product: req.params.product_id }
		else if (req.params.user_id) option.where = { user: req.params.user_id }
		else if (req.params.subCategory_id) {
			option.where = { subCategory: req.params.subCategory_id }
		} else if (req.params.category_id) option.where = { category: req.params.category_id }

		let features = new APIFeatures(option, req.query).filter().sort().limitFields().paginate()
		let resp = [], doc = await Model.findAll(features.option)

		if (option.itHasPath){
			resp[0] = doc[0].Category.name;
			resp[1] =  doc[0].SubCategory.name;
			let token
			if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
				token = req.headers.authorization.split(' ')[1]
				if(token){
					await jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
						if (!err){
							let vUser = await User.findOne({where:{_id:user.id}})
							if (vUser){
								doc = await Promise.all(doc.map(async pr => {
									let isFav = await Favorite.findOne({where:{product:pr._id, user:vUser._id}})
									
									if(isFav){
										pr.dataValues.faved = isFav._id
										return pr;
									} else return pr;
								}))
							}
						}
					})
				}
			}
		}
		if (option.fav){
			doc = doc.map(item => {
				return {
					product: item.Product,
					id: item._id
				}
			})
		}
		
		doc = JSON.parse(JSON.stringify(doc))
		// SEND RESPONSE
		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: doc,
			path: resp
		})
	})
