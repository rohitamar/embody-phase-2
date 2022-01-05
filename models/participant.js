const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

const ParticipantSchema = new Schema({
        _id: new ObjectID(),
        participantID: Number,
        coordXTrialOne: Array,
        coordYTrialOne: Array
});

const Participant = mongoose.model('Participant', ParticipantSchema);

module.exports = Participant;