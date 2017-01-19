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

function parseInnerNodes(data, urlRegex, isTitleFirst, group=1) {

  const innerNodes = [];
  let result;

  while (result = urlRegex.exec(data)) {
    const node = {group}; // Group is 1 for urls, 2 for tags.
    if (isTitleFirst) {
      node.title = result[1];
      node.id = result[2];
    } else {
      node.id = result[1];
      node.title = result[2];
    }

    innerNodes.push(node);
  }
  console.log('got some inner nodes:', innerNodes);
  return innerNodes;
}

function createLinks(tagId, urls) {
  return urls.map(url => {
    console.log('creating links for', tagId, url.id);
    return {
      source: tagId,
      target: url.id,
      value: 1
    };
  });
}

const outerTagRegex = /\s##\s(.+?)\n/g;
let secondOuterTag;

function findEndIndexForTag(data, startTag, regex) {

  // Find next outerTag in order to collect only urls under this heading.
  if (secondOuterTag = regex.exec(data)) {

    // But we aren't consuming it yet!
    regex.lastIndex = secondOuterTag.index;
    console.log('theres a second outer tag', secondOuterTag[1]);

    let dataForThisOuterTag = data.slice(startTag.index, secondOuterTag.index);

    return dataForThisOuterTag;

    // let innerTags = parseData(dataForThisOuterTag, tagRegex, isTitleFirst);
    // let links = createLinks(outerTag.id, innerTags);
    // infoForGraph.nodes.push(...innerTags);
    // infoForGraph.links.push(...links);

  }
  console.log('no more outer tags');
  return false;
}

function parseData(data, tagRegex, urlRegex, isTitleFirst) {

  const infoForGraph = {
    nodes: [],
    links: []
  };

  let firstTag, firstOuterTag, secondTag, dataForThisTag;

  // bookmarkParser only.
  // if (!tagRegex) {
  //   let urls = parseUrls(data, urlRegex, isTitleFirst);
  //   infoForGraph.nodes = urls;
  //   return infoForGraph;
  // }

  while (firstOuterTag = outerTagRegex.exec(data)) {

    let outerTag = {
      id: firstOuterTag[1],
      title: firstOuterTag[1],
      group: 2
    };
    console.log('theres a first outer Tag:', firstOuterTag[1]);

    infoForGraph.nodes.push(outerTag);
    console.log('pushing node(s)');

    let dataForThisOuterTag = findEndIndexForTag(data, firstOuterTag, outerTagRegex);
    if (!dataForThisOuterTag) {
      break;
    }
    let isLastSubTagDone = false;

    while (firstTag = tagRegex.exec(dataForThisOuterTag)) {
      console.log('theres a first inner tag!', firstTag[1]);

      let tag = {
        id: firstTag[1],
        title: firstTag[1],
        group: 2
      };

      infoForGraph.nodes.push(tag);
      console.log('pushing node(s)');
      infoForGraph.links.push(...createLinks(outerTag.id, [tag]));

      // Find next tag in order to collect only urls under this heading.
      if (secondTag = tagRegex.exec(dataForThisOuterTag)) {
        console.log('theres a second inner tag!', secondTag[1]);

        // But we aren't consuming it yet!
        tagRegex.lastIndex = secondTag.index;

        dataForThisTag = dataForThisOuterTag.slice(firstTag.index, secondTag.index);
        console.log('about to parse some inner nodes of', firstTag[1], 'until', secondTag[1]);
      
        let innerNodes = parseInnerNodes(dataForThisTag, urlRegex, isTitleFirst);
        let links = createLinks(tag.id, innerNodes);
        infoForGraph.nodes.push(...innerNodes);
        console.log('pushing node(s)');
        infoForGraph.links.push(...links);

      } else if (!isLastSubTagDone) {
        console.log('(last one!) about to parse some inner nodes of', firstTag[1], 'until', secondOuterTag[1]);

        // outerTagRegex.lastIndex = outerTagRegex.lastIndex + 5;
        tagRegex.exec(dataForThisOuterTag);
        dataForThisTag = dataForThisOuterTag.slice(firstTag.index);
        isLastSubTagDone = true;        

        let innerNodes = parseInnerNodes(dataForThisTag, urlRegex, isTitleFirst);
        let links = createLinks(tag.id, innerNodes);
        infoForGraph.nodes.push(...innerNodes);
        console.log('pushing node(s)');
        infoForGraph.links.push(...links);

        break;

      } else {
        break;
      }



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

      fs.readFile('testdata/awesome.md', 'utf8', (err, data) => {

        if (err) {
          return console.error(err);
        }

        const infoForGraph = parseData(data, this.tagRegex, this.urlRegex, this.isTitleFirst);

        fs.writeFile('links.json', JSON.stringify(infoForGraph, null, 2));
      });

    });
  }

}

// module.exports = Parser;


const tagRegex = /###\s(.+?)\n/g;
const urlRegex = /[\*|\-]\s\[(.*)\]\((.*)\)/g;
const isTitleFirst = true;
const fileExtension = '.md';

const awesomeParser = new Parser(fileExtension, tagRegex, urlRegex, isTitleFirst);

awesomeParser.parse();
