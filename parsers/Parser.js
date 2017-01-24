const fs = require('fs');
const readline = require('readline');
const path = require('path');


function getFilePath(input, fileExtension) {

  let fileName = input.trim();

  let fileExtRegex = new RegExp('\\' + fileExtension);

  if (!fileExtRegex.test(fileName)) {
    fileName += fileExtension;
  }

  return path.join(process.cwd(), fileName);
}

function parseUrls(data, urlRegex, isTitleFirst) {

  const urls = [];
  let result;

  while (result = urlRegex.exec(data)) {
    const node = {group: 1}; // Group is 1 for urls, 2 for tags.
    if (isTitleFirst) {
      node.title = result[1];
      node.id = result[2];
    } else {
      node.id = result[1];
      node.title = result[2];
    }

    urls.push(node);
  }

  return urls;
}

function createLinks(tagId, urls) {
  return urls.map(url => {
    return {
      source: tagId,
      target: url.id,
      value: 1
    };
  });
}

function parseData(data, tagRegex, urlRegex, isTitleFirst) {

  const infoForGraph = {
    nodes: [],
    links: []
  };

  let firstTag, secondTag, dataForThisTag;

  if (!tagRegex) {
    let urls = parseUrls(data, urlRegex, isTitleFirst);
    infoForGraph.nodes = urls;
    return infoForGraph;
  }

  while (firstTag = tagRegex.exec(data)) {

    let tag = {
      id: firstTag[1],
      title: firstTag[1],
      group: 2
    };

    infoForGraph.nodes.push(tag);

    // Find next tag in order to collect only urls under this heading.
    if (secondTag = tagRegex.exec(data)) {

      // But we aren't consuming it yet!
      tagRegex.lastIndex = secondTag.index;

      dataForThisTag = data.slice(firstTag.index, secondTag.index);

      let urls = parseUrls(dataForThisTag, urlRegex, isTitleFirst);
      let links = createLinks(tag.id, urls);
      infoForGraph.nodes.push(...urls);
      infoForGraph.links.push(...links);

    } else {
      break;
    }
  }

  return infoForGraph;

}

class Parser {

  constructor(fileExtension, tagRegex, urlRegex, isTitleFirst) {

    this.fileExtension = fileExtension;
    this.tagRegex = tagRegex;
    this.urlRegex = urlRegex;
    this.isTitleFirst = isTitleFirst;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  parse() {
    this.rl.question(`enter the path to the *${this.fileExtension} file containing the list of awesome links:\n`, response => {

      this.rl.close();

      const filePath = getFilePath(response, this.fileExtension);

      fs.readFile(filePath, 'utf8', (err, data) => {

        if (err) {
          return console.error(err);
        }

        const infoForGraph = parseData(data, this.tagRegex, this.urlRegex, this.isTitleFirst);

        fs.writeFile(filePath.slice(0,-3)+'.json', JSON.stringify(infoForGraph, null, 2));
      });

    });
  }

}

module.exports = Parser;
