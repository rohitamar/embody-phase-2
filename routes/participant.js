const express = require('express');
const { isEmpty } = require('lodash');
const AWS = require('aws-sdk');

const Participant = require('../models/participant');
const router = express.Router();

const bodyParser = require('body-parser').urlencoded({extended: true});

const AWS_ACCESS_KEY_ID = 'AKIA43TAELT6XCCTV4F2';
const AWS_SECRET_ACCESS_KEY = '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';

/*
const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});
*/

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

router.post('/pushBodilyMap', bodyParser, (req, res) => {
    const params = {
        Bucket: 'bodilysensationimages',
        Key: req.body.participantImagePath,
        Body: req.body.participantImageData,
    };

    s3.putObject(params, (s3err, data) => {
        if(s3err) throw s3err;
        console.log(data);
    });

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