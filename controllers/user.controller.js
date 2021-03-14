const User = require('../models/user.model')
const factory = require('./handleFactory')
// const catchAsync = require('./../utils/catchAsync');

exports.getAllUser = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.createUser = factory.createOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
