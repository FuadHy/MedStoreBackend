const express = require('express');

const fileUploadService = require('../services/file.upload.service.js');


const uploadRoutes = new express.Router();

uploadRoutes.route('/')
    .get(fileUploadService.uploadForm)
    .post(fileUploadService.uploadFile);

uploadRoutes.route('/pdf')
	.post(fileUploadService.uploadPDF)

module.exports = uploadRoutes;