const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

const LogSchema = new Schema({
    participantID: Number,
    dateEntered: String,
    dateLeft: String
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;