const route = require('express').Router();
const questionBank = require('../models/Question');
const nlp = require('compromise');

const addNewQuestion = async (text, question, type) => {
    const newQuestion = new questionBank({
        text,
        question,
        type
    });
    const addNewQuestion = await newQuestion.save();
    return addNewQuestion;
}

const negativeGenText = async (text) => {
    let doc = await nlp(text);
    return await doc.sentences().toNegative().out('text');
}

const reduceNoun = async (text) => {
    return await nlp(text).nouns().out('array');
}

const blankGenText = async (str, text) => {
    return await text.toLowerCase().replace(str, '_____');
}

route.get('/', async (req, res) => {
    try {
        const dataQuestionBank = await questionBank.find();
        res.status(201).json(dataQuestionBank);
    } catch (err) {
        res.status(500).json({msg: err});
    }
});

route.post('/', async (req, res) => {
    let {text} = await req.body;
    text = await nlp(text).normalize().out('text');
    const data = text.split('.');
    console.log(data);
    try {
        // Blank question
        data.map(sentence => {
            reduceNoun(sentence)
                .then((data) => data.map(async str => {
                    //console.log(str);
                    blankGenText(str, sentence)
                    .then((ques) => addNewQuestion(sentence, ques, 'Blank'))
                    .catch(err => console.log({msg: err}));
                })).catch(err => console.log(err));
        // True/False question
            negativeGenText(sentence)
                .then((result) => { 
                    addNewQuestion(sentence, result, 'True/False');
                    addNewQuestion(sentence, sentence, 'True/False');
                }).catch(err => console.log(err));
        })
        res.status(200).json({msg: 'Gen Success !'});

    } catch(err) {
        res.json({msg: err});
    }
});

route.get('/:text', async (req, res) => {
    let text = await req.params.text;
    text = await nlp(text).normalize().out('text');
    const data = text.split('.');

    try {
        data.map(async sentence => {
            const questions = await questionBank.find({text: sentence});
            res.json(questions);
        })
    } catch (err) {
        res.json({msg: err});
    }
})

module.exports = route;