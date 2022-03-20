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

function buildCSVData(path, header, date, coordXArray, coordYArray)
{
    const csvWriter = createCSVWriter({
        path,
        header,
    });
    dataCSV = []
    for(var i = 0; i<coordXArray.length; i++) {
        let row = {
            date: date,
            coordX: coordXArray[i],
            coordY: coordYArray[i]
        }
        dataCSV.push(row);
    }
    csvWriter.writeRecords(dataCSV);
} 

function getTime(time) {
    if(time)
        return (time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
    else
        return 0;
}

function getDate(time) {
    if(time)
        return time.getFullYear() + '-' + (time.getMonth() - 1) + '-' + time.getDate();
    else
        return 0;
}

router.get('/dateRange', bodyParser, async (req, res) => {
    //Make folder named demo_subjects
    if(!fs.existsSync('./participantdata')) {
        fs.mkdirSync('./participantdata')
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
                _id: {
                    participantID: "$participantID",
                    sessionNumber: "$sessionNumber"
                },
                dataXArray: { $push: "$coordXArray" },
                dataYArray: { $push: "$coordYArray" },
                date: {
                    $push: "$date"
                }
            }
        }
    ]).then(async (participants) => {
        //Once we have a collection of grouped participantIDs
        //we make separate folders for each participant and push the data of one array (out of 4) into unique CSV files
        participants.forEach((participant) => {
            let { _id, dataXArray, dataYArray } = participant
            const currDir = './participantdata/' + _id.participantID + '/'
            if(!fs.existsSync(currDir)) {
                fs.mkdirSync(currDir)
            }

            console.log()
            let participantPath = currDir + participant._id.participantID + '__' + participant._id.sessionNumber + '__' + getDate(participant.date[0]).toString() + '__' + getTime(participant.date[0]).toString() + '.csv'
            dataXArray = dataXArray.flat();
            dataYArray = dataYArray.flat();

            buildCSVData(participantPath, headerParticipant, participant.date[0].getTime(), dataXArray, dataYArray)
        });

        let dateNow = Date.now();

        //console.log(dateNow);
        await res.zip({
            files: [{
                path: './participantdata',
                name: 'participantdata'
            }],
            filename: 'participantdata.zip'
        });
    });

    
});

router.get('/createMasterLog', bodyParser, async (req, res) => {
    Log.aggregate([
        {
            $sort: {
                participantID: 1, 
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
            //(the month of the date is wrong) 
            //the time is in UTC
            //add difference between activations and deactivations
            let { _id, entered, left } = log;

            let dateParticipant = getDate(left[0]);
            datesParticipant.push(dateParticipant);

            let timeEnteredActivation = getTime(entered[0]) || 0;
            timesEnteredActivation.push(timeEnteredActivation);

            let timeEnteredDeactivation = getTime(entered[1]) || 0;
            timesEnteredDeactivation.push(timeEnteredDeactivation);

            let timeLeftActivation = getTime(left[0]) || 0;
            timesLeftActivation.push(timeLeftActivation);

            let timeLeftDeactivation = getTime(left[1]) || 0;
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
