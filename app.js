const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//set JSON Parser
app.use(bodyParser.json());

//Route config
const questionRoute = require('./routes/questions');
app.use('/question-gen', questionRoute);

// DB connect
const db = process.env.MongoURI;
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Db has connected. . .'))
    .catch((err) => console.log({msg: err}));

// Run Server
app.listen(PORT, () => {
    console.log('Server is running at PORT: ' + PORT);
})

