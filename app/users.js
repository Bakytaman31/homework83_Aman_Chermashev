const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const TrackHistory = require('../models/TrackHistory');

const router = express.Router();

router.post('/', async (req, res) => {
    const user = new User(req.body);
    try {
        user.generateToken();
        await user.save();
        return res.send(user);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (!user) {
        return res.status(400).send({error: "Username not found"});
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
        return res.status(400).send({error: "Password is wrong"});
    }
    user.generateToken();
    await user.save();
    return res.send({token: user.token});
});

router.post('/track_history', async (req, res) => {
    const authorisationHeader = req.get('Authorisation');
    if (!authorisationHeader) {
        return res.status(401).send({error: 'No authorisation header'});
    }
    const [type, token] = authorisationHeader.split(' ');
    if (type !== 'Token' || !token) {
        return res.status(401).send({error: 'Authorisation type wrong or token not present'});
    }
    const user = await User.findOne({token});
    if (!user) {
        res.status(401).send({error: 'No user with this token'});
    }
    const obj = {
        userId: user._id,
        track: req.body.track
    };
    const trackHistory = new TrackHistory(obj);
    await trackHistory.save();
    return res.send(trackHistory);
});


module.exports = router;