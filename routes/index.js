const express = require('express');
const { isEmpty } = require('lodash');
const Participant = require('../models/participant');
const router = express.Router();

const bodyParser = require('body-parser').urlencoded({extended: true});


router.get('/ping', async (req, res) => {
    return res.json({
        message: 'hello world!'
    });
});

router.post('/addParticipant', bodyParser, async (req, res) => {
    if (isEmpty(req.body)) {
        return res.status(403).json({
            error: 'Body cannot be empty. Invalid request.',
            statusCode: 403
        });
    }

    const { participantID, coordXTrialOne, coordYTrialOne } = req.body;

    const newParticipant = new Participant({
        participantID,
        coordXTrialOne,
        coordYTrialOne,
        date: Date.now()
    });

    try {
        await newParticipant.save();
        res.json({
            message: 'Data successfully saved',
            statusCode: 200
        });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({
            message: 'Internal Server error',
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