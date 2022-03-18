const express = require('express');
const { isEmpty } = require('lodash');
const Participant = require('../models/participant');
const Log = require('../models/log');
const router = express.Router();
const fs = require('fs');
const { time } = require('console');
const zip = require('express-easy-zip');
const AWS = require('aws-sdk');

const bodyParser = require('body-parser').urlencoded({extended: true});
const createCSVWriter = require('csv-writer').createObjectCsvWriter;


const AWS_ACCESS_KEY_ID = 'AKIA43TAELT6XCCTV4F2';
const AWS_SECRET_ACCESS_KEY = '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';

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});


router.use(zip());
//Header of the CSV file
//Can be changed depending on how you want the CSV file to be organized
//In this case, time, coordX, and coordY are the columns of the CSV file
const headerParticipant = [
    { id: 'date', title: 'date' },
    { id: 'coordX', title: 'coordX' },
    { id: 'coordY', title: 'coordY' }
]

const headerLog = [
    { id: 'fileName', title: 'File Name' },
    { id: 'participantID', title: 'ParticipantID' },
    { id: 'dateParticipant', title: 'Date of Study' },
    { id: 'timeEnteredActivation', title: 'Activation - Time Entered' }, 
    { id: 'timeLeftActivation', title: 'Activation - Time Left' },
    { id: 'timeEnteredDeactivation', title: 'Deactivation - Time Entered' },
    { id: 'timeLeftDeactivation', title: 'Deactivation - Time Left' }
]

//This function builds an array of JS objects that can be passed into the csvWriter library
//to quickly create CSV files
function buildMasterLogCSVData(path, header = headerLog, fileNames, participantIds, datesParticipant, timesEnteredActivation, timesEnteredDeactivation, timesLeftActivation, timesLeftDeactivation)
{
    const csvWriter = createCSVWriter({
        path,
        header,
    });
    dataCSV = []
    for(var i = 0; i<fileNames.length; i++) {
        let row = {
            fileName: fileNames[i],
            participantID: participantIds[i],
            dateParticipant: datesParticipant[i],
            timeEnteredActivation: timesEnteredActivation[i],
            timeEnteredDeactivation: timesEnteredDeactivation[i],
            timeLeftActivation: timesLeftActivation[i],
            timeLeftDeactivation: timesLeftDeactivation[i]
        }
        dataCSV.push(row);
    }
    csvWriter.writeRecords(dataCSV).then(() => {
        console.log('hello world');
    });
} 

function getTime(time) {
    return (time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
}

function getDate(time) {
    return time.getFullYear() + '-' + (time.getMonth() - 1) + '-' + time.getDate();
}

router.get('/dateRange', bodyParser, async (req, res) => {
    //Make folder named demo_subjects
    if(!fs.existsSync('./temporary')) {
        fs.mkdirSync('./temporary')
    }
    //Begin aggregation pipeline
    Participant.aggregate([
        //Stage 1: Sort by Participant ID
        {
            $sort: {
                participantID: 1,
            }
        },
        //Stage 2: Group based on participantID, then collect all coordinates into one array
        {
            $group: {
                _id: "$participantID", 
                dataXArray: { $push: "$coordXArray" },
                dataYArray: { $push: "$coordYArray" }
            }
        }
    ]).then((participants) => {
        //Once we have a collection of grouped participantIDs
        //we make separate folders for each participant and push the data of one array (out of 4) into unique CSV files
        participants.forEach((participant) => {
            let { _id, dataXArray, dataYArray } = participant
            const currDir = './temporary/' + _id + '/'
            if(!fs.existsSync(currDir)) {
                fs.mkdirSync(currDir)
            }
            let participantPath = currDir + participant._id + '.csv'
            buildCSVData(participantPath, header, 10000, dataXArray[0], dataYArray[0])

        });
    });

    await res.zip({
        files: [{
            path: './temporary',
            name: 'Package'
        }],
        filename: 'Package.zip'
    });
});

router.get('/createMasterLog:startDate:endDate', bodyParser, async (req, res) => {
    Log.aggregate([
        {
            $sort: {
                participantID: 1, 
            }
        },
        {
            $match: {
                "dateEntered": {
                    $gte: req.params.startDate,
                    $lte: req.params.endDate
                }
            }
        },
        {
            $group: {
                _id: {
                    participantID: "$participantID",
                    sessionNumber: "$sessionNumber",
                },
                entered: {
                    $push: "$dateEntered"
                },
                left: {
                    $push: "$dateLeft"
                }
            }
        }
    ]).then(async (logs) => {
        if(!fs.existsSync('./MASTERLOG')) {
            fs.mkdirSync('./MASTERLOG')
        }

        let participantIds = [], fileNames = [];
        let datesParticipant = [];
        let timesEnteredActivation = [], timesEnteredDeactivation = [], timesLeftActivation = [], timesLeftDeactivation = [];
        
        logs.forEach((log) => {
            let { _id, entered, left } = log;

            let dateParticipant = getDate(left[0]);
            datesParticipant.push(dateParticipant);

            let timeEnteredActivation = getTime(entered[0]);
            timesEnteredActivation.push(timeEnteredActivation);

            let timeEnteredDeactivation = getTime(entered[1]);
            timesEnteredDeactivation.push(timeEnteredDeactivation);

            let timeLeftActivation = getTime(left[0]);
            timesLeftActivation.push(timeLeftActivation);

            let timeLeftDeactivation = getTime(left[1]);
            timesLeftDeactivation.push(timeLeftDeactivation);

            participantIds.push(_id.participantID);
            
            let fileName = _id.participantID + '__' + _id.sessionNumber + '__' + dateParticipant;
            fileNames.push(fileName);

        });

        buildMasterLogCSVData('./MASTERLOG/MasterLog.csv', 
            headerLog, 
            fileNames, 
            participantIds, 
            datesParticipant, 
            timesEnteredActivation, 
            timesEnteredDeactivation, 
            timesLeftActivation, 
            timesLeftDeactivation
        )

        await res.zip({
            files: [{
                path: './MASTERLOG',
                name: 'MASTERLOG'
            }],
            filename: 'MASTERLOG.zip'
        });

    });
});

router.get('/downloadAllBodilyImages', bodyParser, async (req, res) => {

});

module.exports = router;
