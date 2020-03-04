const path = require('path');

const express = require('express');
const multer = require('multer');
const nanoid = require('nanoid');

const config = require('../config');

const Album = require('../models/Album');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', async (req, res) => {
    if (req.query.artist) {
        const album = await Album.find({artist: req.query.artist}).populate('artist');
        res.send(album);
    } else {
        const albums = await Album.find().populate('artist');
        res.send(albums);
    }
});

router.get('/:id', async (req, res) => {
    if (req.params.id) {
        const album = await Album.findById(req.params.id).populate('artist');
        res.send(album);
    }
});

router.post('/', upload.single('image'),async (req, res) => {
    const albumData = req.body;
    if (req.file) {
        albumData.image = req.file.filename;
    }
    const album = new Album(albumData);
    await album.save();
    res.send('Saved')
});

module.exports = router;