const base_url = '/api/v1'

module.exports = {
	app_name: 'medstore.et api',
	database: {
		local: '',
		remote: '',
	},
	user_level: {
		admin: 'admin',
		normal: 'normal_user',
	},
	user_subscription_type: {
		basic: 'basic',
		premium: 'premium',
	},
	product_condition: {
		new: 'brand_new',
		used: 'used',
	},
	company_type: {
		local_supplier: 'local_supplier',
		brand: 'brand',
		hospital: 'hospital',
	},
	category_type: {
		type_1: 'main category',
		type_2: 'sub category',
		type_3: 'sub-sub category',
	},
	base_url: '/api/v1',
	urls: {
		user: `${base_url}/user`,
		product: `${base_url}/product`,
		company: `${base_url}/company`,
		category: `${base_url}/category`,
		subCategory: `${base_url}/subCategory`,
		uploads: `${base_url}/uploads`,
		request: `${base_url}/request`,
		favorite: `${base_url}/favorite`,
		review: `${base_url}/review`,
		search: `${base_url}/search`,
		message: `${base_url}/message`,
	},
	server: {
		remote: '',
		local: 'localhost:3000',
	},
}
