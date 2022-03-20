const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

const ParticipantSchema = new Schema({
    participantID: Number,
    coordXArray: Array,
    coordYArray: Array,
    sessionNumber: Number,
    date: Date
});

const Participant = mongoose.model('Participant', ParticipantSchema);

module.exports = Participant;