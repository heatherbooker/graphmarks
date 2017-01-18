const Parser = require('./Parser.js');

// need to handle tags within tags
const tagRegex = /###\s(.+?)\n/g;
const urlRegex = /[\*|\-]\s\[(.*)\]\((.*)\)/g;
const isTitleFirst = true;
const fileExtension = '.md';

const awesomeParser = new Parser(fileExtension, tagRegex, urlRegex, isTitleFirst);

awesomeParser.parse();
