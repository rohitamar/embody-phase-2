const express = require('express');
const { isEmpty } = require('lodash');
const Participant = require('../models/participant');
const router = express.Router();
const fs = require('fs');
const { time } = require('console');
const zip = require('express-easy-zip');

const bodyParser = require('body-parser').urlencoded({extended: true});
const createCSVWriter = require('csv-writer').createObjectCsvWriter;

router.use(zip());

//Header of the CSV file
//Can be changed depending on how you want the CSV file to be organized
//In this case, time, coordX, and coordY are the columns of the CSV file
const header = [
    { id: 'date', title: 'date' },
    { id: 'coordX', title: 'coordX' },
    { id: 'coordY', title: 'coordY' }
]

//This function builds an array of JS objects that can be passed into the csvWriter library
//to quickly create CSV files
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
    csvWriter.writeRecords(dataCSV).then(() => {
        console.log('hello world');
    });
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

module.exports = router;
