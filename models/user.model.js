const { DataTypes, DATE } = require('sequelize')
const { sequelize } = require('../database')
const Product = require('./product.model')
const Favorite = require('./favorite.model')
const Request = require('./request.model')
const config = require('../config.js')

const User = sequelize.define('User', {
	// Model attributes are defined here
	_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING,
	},
	password: {
		type: DataTypes.STRING,
	},
	passwordChangedAt: new DATE(),
	passwordResetToken: DataTypes.STRING,
	passwordResetExpires: new DATE(),
	active: {
		type: DataTypes.BOOLEAN,
		default: true,
	},
	email: {
		type: DataTypes.STRING,
	},
	phone: {
		type: DataTypes.STRING,
	},
	city: {
		type: DataTypes.STRING,
		defaultValue: '',
	},
	region: {
		type: DataTypes.STRING,
		defaultValue: '',
	},
	country: {
		type: DataTypes.STRING,
		defaultValue: '',
	},
	avatar_url: {
		type: DataTypes.STRING,
		defaultValue: '/avatars/anonynous.png',
	},
	role: {
		type: DataTypes.STRING,
		defaultValue: config.user_level.normal,
	},
	subscription: {
		type: DataTypes.STRING,
		defaultValue: config.user_subscription_type.basic,
	},
})

// User.belongsToMany(Product, { through: Request, foreignKey: 'user', uniqueKey: false })
// User.belongsToMany(Product, { through: Favorite, foreignKey: 'user', uniqueKey: false })

module.exports = User

// userSchema.pre('save',async function(next){
//     // only run this function when the password is modified
//     if(!this.isModified('password')) return next();
//     // hash the password with a cost of 12
//     this.password = await bcrypt.hash(this.password, 12);
//     // delete password confirm field
//     this.passwordConfirm = undefined
//     next()
// });

// userSchema.pre('save', function(next) {
//     if (!this.isModified('password') || this.isNew) return next();
//     this.passwordChangedAt = Date.now() - 5000;
//     next();
// });

// userSchema.pre(/^find/, function(next) {
//     // this points to the current query
//     this.find({ active: { $ne: false } });
//     next();
// });

// userSchema.methods.comparePassword = async function(candidatePassword,userPassword){
//     return await bcrypt.compare(candidatePassword,userPassword)
// }
// userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
//     if (this.passwordChangedAt) {
//       const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
//       return JWTTimestamp < changedTimestamp;
//     }
//     // False means NOT changed
//     return false;
//   };

//   userSchema.methods.createPasswordResetToken = function() {
//     const resetToken = crypto.randomBytes(32).toString('hex');

//     this.passwordResetToken = crypto
//       .createHash('sha256')
//       .update(resetToken)
//       .digest('hex');

//     // console.log({ resetToken }, this.passwordResetToken);

//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//     return resetToken;
//   };

// userSchema.options.toJSON = {
//     transform: function (doc, ret, options) {
//         delete ret.password;
//         delete ret.token;
//         // delete ret._id;
//         delete ret.__v;

//     }
// };
