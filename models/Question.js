const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    question: {
        type: String,
    },
    type: {
        type: String
    }
});

module.exports = mongoose.model('QuestionBank', questionSchema);

