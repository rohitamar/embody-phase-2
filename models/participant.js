const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
        position: String,
        name: String,
        company: String,
        date: Date
});

const Participant = mongoose.model('Participant', ParticipantSchema);


module.exports = Participant;