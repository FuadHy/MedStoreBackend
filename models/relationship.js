const SubCategory = require('./subCategory.model')
const Product = require('./product.model')
const Category = require('./category.model')
const User = require('./user.model')
const Request = require('./request.model')
const Favorite = require('./favorite.model')

exports.addRelationship = function () {
	// Category and subCategory
	SubCategory.belongsTo(Category, {
		foreignKey: 'category',
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	Category.hasMany(SubCategory, {
		foreignKey: 'category',
	})
	// Category and Product
	Product.belongsTo(Category, { foreignKey: 'category', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	Category.hasMany(Product, { foreignKey: 'category' })
	// subCategory and Product
	Product.belongsTo(SubCategory, {
		foreignKey: 'subCategory',
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	SubCategory.hasMany(Product, {
		foreignKey: 'subCategory',
	})
	// Product and User through Request
	Product.belongsToMany(User, { through: Request, foreignKey: 'product', uniqueKey: false })
	User.belongsToMany(Product, { through: Request, foreignKey: 'user', uniqueKey: false })
	// product and Favorite through Favorite
	Product.belongsToMany(User, { through: Favorite, foreignKey: 'product', uniqueKey: false })
	User.belongsToMany(Product, { through: Favorite, foreignKey: 'user', uniqueKey: false })

	//request and Product
	Request.belongsTo(Product, { foreignKey: 'product', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	//request and user
	Request.belongsTo(User, { foreignKey: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

	//favorite and Product
	Favorite.belongsTo(Product, { foreignKey: 'product', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	//favorite and product
	Favorite.belongsTo(User, { foreignKey: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
}
