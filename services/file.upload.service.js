const Formidable = require('formidable')
const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))
const path = require('path')

// Returns true if successful or false otherwise
async function checkCreateUploadsFolder(uploadsFolder) {
	try {
		await fs.statAsync(uploadsFolder)
	} catch (e) {
		if (e && e.code == 'ENOENT') {
			console.log("The uploads folder doesn't exist, creating a new one...")
			try {
				await fs.mkdirAsync(uploadsFolder)
			} catch (err) {
				console.log('Error creating the uploads folder 1')
				return false
			}
		} else {
			console.log('Error creating the uploads folder 2')
			return false
		}
	}
	return true
}

// Returns true or false depending on whether the file is an accepted type
function checkAcceptedExtensions(file) {
	const type = file.type.split('/').pop()
	const accepted = ['jpeg', 'jpg', 'png']
	if (accepted.indexOf(type) == -1) {
		return false
	}
	return true
}

function checkAcceptedExtensions2(file) {
	const type = file.type.split('/').pop()
	const accepted = ['pdf']
	if (accepted.indexOf(type) == -1) {
		return false
	}
	return true
}

const uploadFile = async (req, res, next) => {
	let form = Formidable.IncomingForm()
	const uploadsFolder = path.join(__dirname, '..', 'public', 'img', 'uploads', 'products')
	form.multiples = true
	form.uploadDir = uploadsFolder
	form.maxFileSize = 50 * 1024 * 1024 // 50 MB
	const folderCreationResult = await checkCreateUploadsFolder(uploadsFolder)
	if (!folderCreationResult) {
		return res.json({ ok: false, msg: "The uploads folder couldn't be created" })
	}

	form.parse(req, async (err, fields, files) => {
		let myUploadedFiles = []
		if (err) {
			console.log('Error parsing the incoming form')
			return res.json({ ok: false, msg: 'Error passing the incoming form' })
		}
		// If we are sending only one file:
		if (!files.products.length) {
			const file = files.products
			if (!checkAcceptedExtensions(file)) {
				console.log('The received file is not a valid type')
				return res.json({ ok: false, msg: 'The sent file is not a valid type' })
			}
			// const fileName = encodeURIComponent(file.name.replace(/&. *;+/g, '-'))
			const fileName = encodeURIComponent(file.name.replace(/;|&| *|/g, ''))
			// saving the file as image
			try {
				const timeStamp = Date.now().toString()
				const newFilePath = path.join(uploadsFolder, `${timeStamp}${fileName}`)
				await fs.renameAsync(file.path, newFilePath)
				myUploadedFiles.push(`${timeStamp}${fileName}`)
			} catch (e) {
				console.log('Error uploading the file')
				try {
					await fs.unlinkAsync(file.path)
				} catch (e) {}
				return res.json({ ok: false, msg: 'Error uploading the file' })
			}
		} else {
			for (let i = 0; i < files.products.length; i++) {
				const file = files.products[i]
				if (!checkAcceptedExtensions(file)) {
					console.log('The received file is not a valid type')
					return res.json({ ok: false, msg: 'The sent file is not a valid type' })
				}
				const fileName = encodeURIComponent(file.name.replace(/&. *;+/g, '-'))
				// saving the file as image
				try {
					const timeStamp = Date.now().toString()
					const newFilePath = path.join(uploadsFolder, `${timeStamp}${fileName}`)
					await fs.renameAsync(file.path, newFilePath)
					myUploadedFiles.push(`${timeStamp}${fileName}`)
				} catch (e) {
					console.log('Error uploading the file')
					try {
						await fs.unlinkAsync(file.path)
					} catch (e) {}
					return res.json({ ok: false, msg: 'Error uploading the file' })
				}
			}
		}
		res.json({
			status: 200,
			success: true,
			data: myUploadedFiles.map(fileName => path.join('img', 'uploads', 'products', fileName)),
		})
	})
}

const uploadPDF = async (req, res, next) => {
	let form = Formidable.IncomingForm()
	const uploadsFolder = path.join(__dirname, '..', 'public', 'pdfs')
	form.uploadDir = uploadsFolder
	form.maxFileSize = 50 * 1024 * 1024 // 50 MB
	const folderCreationResult = await checkCreateUploadsFolder(uploadsFolder)
	if (!folderCreationResult) {
		return res.json({ ok: false, msg: "The uploads folder couldn't be created" })
	}
	
	form.parse(req, async (err, fields, files) => {
		let myUploadedFiles = []
		if (err) {
			console.log('Error parsing the incoming form')
			return res.json({ ok: false, msg: 'Error passing the incoming form' })
		}
		// If we are sending only one file:
		if (!files.pdf) {
			const file = files.pdf
			if (!checkAcceptedExtensions2(file)) {
				console.log('The received file is not a valid type')
				return res.json({ ok: false, msg: 'The sent file is not a valid type' })
			}
			// const fileName = encodeURIComponent(file.name.replace(/&. *;+/g, '-'))
			const fileName = encodeURIComponent(file.name.replace(/;|&| *|/g, '-'))
			// saving the file as image
			try {
				const timeStamp = Date.now().toString()
				const newFilePath = path.join(uploadsFolder, `${timeStamp}${fileName}`)
				await fs.renameAsync(file.path, newFilePath)
				myUploadedFiles.push(`${timeStamp}${fileName}`)
			} catch (e) {
				console.log('Error uploading the file')
				try {
					await fs.unlinkAsync(file.path)
				} catch (e) {}
				return res.json({ ok: false, msg: 'Error uploading the file' })
			}
		} else {
			const file = files.pdf
			if (!checkAcceptedExtensions2(file)) {
				console.log('The received file is not a valid type')
				return res.json({ ok: false, msg: 'The sent file is not a valid type' })
			}
			const fileName = encodeURIComponent(file.name.replace(/;|&| *|/g, ''))
			console.log(fileName)
			// saving the file as image
			try {
				const timeStamp = Date.now().toString()
				const newFilePath = path.join(uploadsFolder, `${timeStamp}${fileName}`)
				await fs.renameAsync(file.path, newFilePath)
				myUploadedFiles.push(`${timeStamp}${fileName}`)
			} catch (e) {
				console.log('Error uploading the file')
				try {
					await fs.unlinkAsync(file.path)
				} catch (e) {}
				return res.json({ ok: false, msg: 'Error uploading the file' })
			}
			
		}
		res.json({
			status: 200,
			success: true,
			data: myUploadedFiles.map(fileName => path.join('pdfs', fileName)),
		})
	})
}
const uploadForm = (req, res) => {
	res.send(`<form action="uploads" method="post"  enctype="multipart/form-data">
    <input type="file" multiple name="photos"><br>
    <input type="submit">
    </form>`)
}

module.exports = {
	uploadForm,
	uploadFile,
	uploadPDF
}
