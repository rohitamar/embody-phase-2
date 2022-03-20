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

router.get('/find:id', async (req, res) => {
    const query = await Participant.findOne({
        participantID: Number(req.query.id)
    });

    res.json(query);
});

router.put('/update/:id/:sessNum', async (req, res) => {
    console.log(req.query);
    await Participant.findOneAndUpdate({
        participantID: Number(req.params.id)
    }, {
        sessionNumber: Number(req.params.sessNum)
    });

    res.json({
        message: 'Updated participant ' + req.params.id + '\'s session number',
        statusCode: 200
    });
});

router.delete('/delete:id', async (req, res) => {
    const query = await Participant.findOneAndDelete({
        participantID: Number(req.params.id)
    });

    res.json({
        message: 'Successful deletion of participant ' + req.params.id,
        statusCode: 200
    });

});

module.exports = router;