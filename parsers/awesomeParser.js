const Parser = require('./Parser.js');


const regex = /[\*|\-]\s\[(.*)\]\((.*)\)/g;
const isTitleFirst = true;
const fileExtension = '.md';

const awesomeParser = new Parser(fileExtension, regex, isTitleFirst);

awesomeParser.parse();
