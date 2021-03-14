const Message = require('../models/message.model')
const factory = require('./handleFactory')

exports.getAllMessage = factory.getAll(Message)
exports.getMessage = factory.getOne(Message)
exports.createMessage = factory.createOne(Message)
exports.updateMessage = factory.updateOne(Message)
exports.deleteMessage = factory.deleteOne(Message)
