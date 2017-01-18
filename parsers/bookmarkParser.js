const Parser = require('./Parser.js');


const tagRegex = null;
const urlRegex = /<a href="(.+?)".+?>(.+?)</gi;
const isTitleFirst = false;
const fileExtension = '.html';

const bookmarkParser = new Parser(fileExtension, tagRegex, urlRegex, isTitleFirst);

bookmarkParser.parse();
