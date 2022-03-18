const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

const LogSchema = new Schema({
    participantID: Number,
    dateEntered: Date,
    dateLeft: Date,
    type: String,
    sessionNumber: Number,
    dataValidity, String
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;