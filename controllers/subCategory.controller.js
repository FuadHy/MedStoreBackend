const SubCategory = require('../models/subCategory.model')
const factory = require('./handleFactory')
// const catchAsync = require('./../utils/catchAsync');

exports.getAllSubCategory = factory.getAll(SubCategory)
exports.getSubCategory = factory.getOne(SubCategory)
exports.createSubCategory = factory.createOne(SubCategory)
exports.updateSubCategory = factory.updateOne(SubCategory)
exports.deleteSubCategory = factory.deleteOne(SubCategory)
