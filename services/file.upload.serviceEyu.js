const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const os = require('os');


exports.uploadFile = (req, res, next) => {

    const form = formidable({
        multiples: true,
        keepExtensions: true,
        // uploadDir: UPLOAD_PATH
    });

    // var UPLOAD_PATH = path.join(__dirname, '../uploads/avatars/');
    let fileType = "";
    form
        .on('fileBegin', (name, file) => {
            if (name === 'products') {
                form.uploadDir = path.join(__dirname, '../public/img/uploads/products/');
                fileType = name;
            } else {
                form.uploadDir = path.join(__dirname, '../public/img/uploads/avatars/');
                fileType = name;
            }
        })
        .on('file', (name, file) => {
            fs.writeFile(file.path, fs.readFileSync(file.path), (err) => {
                if (err) { console.log(err); }
            });
        });


    form.parse(req, (err, fields, files) => {
        if (err) {
            res.json(err);
        } else {
            let data = files[fileType].map(photo => photo.path.substr(photo.path.indexOf(fileType)));
            res.json(
                {
                    status: 200,
                    success: true,
                    data: data,
                });
        }

    });
};


exports.uploadForm = (req, res) => {
    res.send(`<form action="uploads" method="post"  enctype="multipart/form-data">
    <input type="file" multiple name="photos"><br>
    <input type="submit">
    </form>`);
};