const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

const EventSchema = new Schema({
    participantID: Number,
    date: String
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;