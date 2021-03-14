class APIFeatures {
	constructor(option, queryString) {
		this.option = option
		this.queryString = queryString
	}

	filter() {
		const queryObj = { ...this.queryString }
		const excludedFields = ['page', 'sort', 'limit', 'fields']
		excludedFields.forEach(el => delete queryObj[el])

		if (!this.option.where) this.option.where = {}

		for (let key in queryObj) {
			this.option.where[key] = queryObj[key]
		}

		return this
	}

	sort() {
		this.option.order = []
		if (this.queryString.sort) {
			let sortBy = this.queryString.sort.split(',')
			sortBy.forEach(s => this.option.order.push([s, 'ASC']))
		} else {
			this.option.order.push(['createdAt', 'ASC'])
		}
		return this
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',')
			this.option.attributes = []
			fields.forEach(field => {
				this.option.attributes.push(field)
			})
		}
		return this
	}

	paginate() {
		const page = this.queryString.page * 1 || 1
		const limit = this.queryString.limit * 1 || 100
		const offset = (page - 1) * limit

		this.option.offset = offset
		this.option.limit = limit
		// this.query = this.query.skip(offset).limit(limit)

		return this
	}
}
module.exports = APIFeatures
