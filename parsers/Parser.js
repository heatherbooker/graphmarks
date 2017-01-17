const fs = require('fs');
const readline = require('readline');
const path = require('path');


function parseLinks(data, regex, isTitleFirst) {

  const links = [];
  let result;

  while (result = regex.exec(data)) {
    const newLink = {group: 1}; // Group is arbitrary.
    if (isTitleFirst) {
      newLink.title = result[1];
      newLink.id = result[2];
    } else {
      newLink.id = result[1];
      newLink.title = result[2];
    }
    links.push(newLink);
  }

  return links;

}

class Parser {

  constructor(fileExtension, regex, isTitleFirst) {

    this.fileExtension = fileExtension;
    this.regex = regex;
    this.isTitleFirst = isTitleFirst;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  parse() {
    this.rl.question(`enter the path to the *${this.fileExtension} file containing the list of awesome links:\n`, response => {

      this.rl.close();

      let fileName = response.trim();
      let fileExtRegex = new RegExp('\\' + this.fileExtension);
      if (!fileExtRegex.test(response)) {
        fileName += this.fileExtension;
      }
      const filePath = path.join(process.cwd(), fileName);

      fs.readFile(filePath, 'utf8', (err, data) => {

        if (err) {
          return console.error(err);
        }

        const links = parseLinks(data, this.regex, this.isTitleFirst);

        fs.writeFile('links.json', JSON.stringify(links, null, 2));
      });

    });
  }

}

module.exports = Parser;
