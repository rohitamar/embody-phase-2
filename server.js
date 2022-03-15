const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const participantRouter = require('./routes/participant');
const downloadRouter = require('./routes/downloadFiles');
//const emailRouter = require('./routes/email');
//const logRouter = require('./routes/log');

const app = express();
const PORT = process.env.PORT || 8080;

try {
    mongoose.connect( 
        process.env.MONGODB_URI || 'mongodb+srv://bodilymap:Alcohol$@coordinates.pmwd4.mongodb.net/ParticipantData', 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
} catch(e) {
    console.log(e);
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/participant', participantRouter);
app.use('/download', downloadRouter);
//app.use('/email', emailRouter);
app.use('/log', logRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
    });
}

app.listen(PORT, () => {
    console.log(`Server is starting at PORT: ${PORT}`);
});

