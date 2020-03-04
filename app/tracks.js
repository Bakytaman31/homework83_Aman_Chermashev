const express = require('express');

const Track = require('../models/Track');

const router = express.Router();

router.get('/', async (req, res) => {
    if (req.query.album) {
        const tracks = await Track.find({album: req.query.album}).populate('album');
        res.send(tracks);
    } else {
        const tracks = await Track.find().populate('album');
        res.send(tracks);
    }
});

router.post('/', async (req, res) => {
    const track = new Track(req.body);
    await track.save();
    res.send("Saved");
});

module.exports = router;