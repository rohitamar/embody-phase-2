const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const participantRouter = require('./routes/participant');
const downloadRouter = require('./routes/download');
const logRouter = require('./routes/log');

const app = express();
const PORT = process.env.PORT || 8080;

try {
    mongoose.connect( 
        process.env.MONGODB_URI || 'mongodb+srv://bodilymap:Alcohol%24@coordinates.pmwd4.mongodb.net/test?authSource=admin&replicaSet=atlas-fpn2ab-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
} catch(e) {
    console.log(e);
}

app.use(cors());
app.use(express.json({ 
    limit: '200mb',
    extended: true
}));

app.use(express.urlencoded({
    limit: '200mb', 
    extended: true, 
    parameterLimit: 1000000000

}));

app.use('/participant', participantRouter);
app.use('/download', downloadRouter);
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

