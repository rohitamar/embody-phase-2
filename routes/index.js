const express = require('express');
const { isEmpty } = require('lodash');
const Participant = require('../models/participant');
const router = express.Router();

router.get('/ping', async (req, res) => {
    return res.json({
        message: 'hello world!'
    });
});

router.post('/add', async (req, res) => {
    /*
    if (isEmpty(req.body)) {
        return res.status(403).json({
            error: 'Body cannot be empty. Invalid request.',
            statusCode: 403
        });
    }
    */

    const newParticipant = new Participant({
        id: 1,
        participantID: 101,
        coordXTrialOne: [],
        coordYTrialOne: [],     
    });

    try {
        await newParticipant.save();
        res.json({
            statusCode: 200
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Unable to add participant. Internal server error.',
            statusCode: 500
        });
    }
    
});

//Returns the id numbers and coordinates of every participant in the study
router.post('/allParticipants', async (req, res) => {
    try {
        const allParticipants = await Participant.find({});
        return res.json({
            allParticipants
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server error'
        });
    }
});

module.exports = router;