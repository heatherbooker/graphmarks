const Parser = require('./Parser.js');


const regex = /<a href="(.+?)".+?>(.+?)</gi;
const isTitleFirst = false;
const fileExtension = '.html';

const bookmarkParser = new Parser(fileExtension, regex, isTitleFirst);

bookmarkParser.parse();
