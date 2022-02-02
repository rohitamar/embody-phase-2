const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

const ParticipantSchema = new Schema({
    participantID: Number,
    coordX: Array,
    coordY: Array,
    date: String
});

const Participant = mongoose.model('Participant', ParticipantSchema);

module.exports = Participant;
3