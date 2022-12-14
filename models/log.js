const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

const LogSchema = new Schema({
    participantID: String,
    dateEntered: Date,
    dateLeft: Date,
    type: String,
    sessionNumber: Number,
    dataValidity: String
});
//t

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;