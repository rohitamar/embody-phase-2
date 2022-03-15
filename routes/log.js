const express = require('express');
const { isEmpty } = require('lodash');
const router = express.Router();
const Log = require('../models/log');
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

    const { participantID, dateEntered, dateLeft } = req.body;

    const newLog = new Log({
        participantID,
        dateEntered,
        dateLeft
    });

    try {
        await newLog.save();
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

    Log.findByIdAndUpdate({ participantID: req.params.id }, req.body).then(() => {
        res.status(200).json({
            message: 'Successful update',
            statusCode: 200
        });
    });
    
});

module.exports = router;
