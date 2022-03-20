const express = require('express');
const { isEmpty } = require('lodash');
const Participant = require('../models/participant');
const router = express.Router();
//const bodyParser = require('body-parser');

router.post('/add', async (req, res) => {
    if (isEmpty(req.body)) {
        return res.status(403).json({
            error: 'Body cannot be empty. Invalid request.',
            statusCode: 403
        });
    }

    const { participantID, sessionNumber } = req.body;

    const newParticipant = new Participant({
        participantID,
        sessionNumber
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

router.get('/find', async (req, res) => {
    const query = await Participant.findOne({
        participantID: Number(req.query.id)
    });
    res.json(query);
});

router.post('/update', async (req, res) => {
    await Participant.findOneAndUpdate({
        participantID: Number(req.body.id)
    }, {
        sessionNumber: Number(req.body.sessNum)
    });

    res.json({
        message: 'Updated participant ' + req.body.id + '\'s session number',
        statusCode: 200
    });
});

router.delete('/delete', async (req, res) => {
    const query = await Participant.findOneAndDelete({
        participantID: Number(req.query.id)
    });

    res.json({
        message: 'Successful deletion of participant ' + req.query.id,
        statusCode: 200
    });

});

module.exports = router;