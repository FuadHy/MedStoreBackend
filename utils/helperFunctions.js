exports.resourceNeeded = baseURL => {
	let resources = baseURL.split('/')
	let len = resources.length
	let neededResouces = ['subCategory', 'product', 'request', 'favorite']
	let itInclude = false
	itInclude = neededResouces.includes(resources[len - 1])
	if (itInclude) return resources[len - 1]
	itInclude = neededResouces.includes(resources[len - 2])
	if (itInclude) return resources[len - 2]
	return 'jibrish'
}
