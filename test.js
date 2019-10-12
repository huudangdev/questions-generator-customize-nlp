const nlp = require('compromise');

const reduceNoun = async (text) => {
    return await nlp(text).nouns().out('array');
}

const blankGenText = async (str, text) => {
    return await text.toLowerCase().replace(str, '____');
}

const text = "Congratulate you on passing the recruitment process to be our Back-end Developer Intern from now on.";

reduceNoun(text)
    .then((data) => data.map(async str => {
        console.log(str);
        blankGenText(str, text)
            .then((ques) => console.log(ques))
            .catch(err => console.log({msg: err}));
    }))
    .catch(err => console.log(err));
