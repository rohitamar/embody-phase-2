const express = require('express');
const { isEmpty } = require('lodash');
const Participant = require('../models/participant');
const router = express.Router();

const bodyParser = require('body-parser').urlencoded({extended: true});

router.get('/ping', async (req, res) => {
    return res.json({
        message: 'Server available',
        statusCode: 200
    });
});

router.post('/add', bodyParser, async (req, res) => {
    if (isEmpty(req.body)) {
        return res.status(403).json({
            error: 'Body cannot be empty. Invalid request.',
            statusCode: 403
        });
    }

    const { participantID, coordXArray, coordYArray, date } = req.body;


    const newParticipant = new Participant({
        participantID,
        coordXArray,
        coordYArray,
        date
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

router.put('/update/:id', bodyParser, async (req, res) => {
    if(isEmpty(req.body)) {
        return res.status(403).json({
            error: 'Body cannot be empty. Invalid request.',
            statusCode: 403
        });
    }
});

//Returns the id numbers and coordinates of every participant in the study
router.post('/getAll', async (req, res) => {
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