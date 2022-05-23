const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

const ParticipantDataSchema = new Schema({
    participantID: Number,
    coordXArray: Array,
    coordYArray: Array,
    sessionNumber: Number,
    date: Date
});

const ParticipantData = mongoose.model('ParticipantData', ParticipantDataSchema);

module.exports = ParticipantData; 