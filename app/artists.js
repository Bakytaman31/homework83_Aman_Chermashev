const path = require('path');

const express = require('express');
const multer = require('multer');
const nanoid = require('nanoid');

const config = require('../config');

const Artist = require('../models/Artist');

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
    const artists = await Artist.find();
    res.send(artists);
});

router.post('/', upload.single('image'), async (req, res) => {
    const artistData = req.body;
    if (req.file) {
        artistData.image = req.file.filename;
    }
    const artist = new Artist(artistData);
    await artist.save();
    res.send('Saved')
});

module.exports = router;