const express = require('express');

const fileUploadService = require('../services/file.upload.service.js');


const uploadRoutes = new express.Router();

uploadRoutes.route('/')
    .get(fileUploadService.uploadForm)
    .post(fileUploadService.uploadFile);

module.exports = uploadRoutes;