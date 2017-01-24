const cheerio = require('cheerio');
let $;
const fs = require('fs');
const readline = require('readline');


function parse($) {

  const infoForGraph = {nodes: [], links: []};

  let parentNode = $('h1').first();
  let firstTag = $('h2').first();

  recurse(firstTag, parentNode);

  function recurse(firstTag, parentNode) {

    if (['H2', 'H3'].includes(firstTag.prop('tagName'))) {
      infoForGraph.nodes.push(createNode(firstTag.text()));

    } else {
      let newNode = createNode(firstTag.text(), firstTag.attr('href'));
      infoForGraph.nodes.push(newNode);
    }

    infoForGraph.links.push(createLink(parentNode, firstTag));

    let secondTag = $(firstTag).next();

    if (['H2', 'H3'].includes(secondTag.prop('tagName'))) {
      recurse(secondTag, firstTag);
    } else if (secondTag.prop('tagName') === 'UL') {
      const infoFromList = iterateList(secondTag, firstTag);
      infoForGraph.nodes.push(infoFromList.nodes);
      infoForGraph.links.push(infoFromList.links);
      recurse($(secondTag).next(), parentNode);
    } else {
      const nextNode = getNext(secondTag);
      if (nextNode !== null) {
        recurse(nextNode, parentNode);
      }

      function getNext(curr) {
        try {
          const next = $(curr).next();
          // Accessing 'tagName' of empty tags will throw an error.
          if (['H2', 'H3', 'UL'].includes($(next).prop('tagName'))) {
            return next;
          }
          return getNext(next);
        } catch (e) {
          return null;
        }
      }

    }

  }

  function iterateList(UL, parentNode) {
    const nodes = [];
    const links = [];
    $(UL).children().each((index, liItem) => {
      const ATag = $(liItem).html(); // <a ...> tag, not just "a tag"!
      nodes.push(createNode($(ATag).text(), $(ATag).attr('href')));
      links.push(createLink(parentNode, ATag));
    });
    return {nodes, links};
  }

  //console.log(JSON.stringify(infoForGraph, null, 2));
  return infoForGraph;
}


function createNode(title, id) {

  let group = 1; // Group 1 is urls, group 2 is tags.
  if (typeof id === 'undefined') {
    id = title;
    group = 2;
  }

  return {
    id,
    title,
    group
  };
}


function createLink(parentNode, childNode) {
  return {
    source: $(parentNode).text(),
    target: $(childNode).text(),
    value: 1 // Value is the strength of the association.
  };
}

function main() {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(`enter the file path:\n`, filePath => {

    rl.close();

    $ = cheerio.load(fs.readFileSync(filePath || 'testdata/awesome.html'));
    $ = cheerio.load($('.markdown-body').html());

    const infoForGraph = parse($);

    fs.writeFileSync(filePath.slice(0,-5)+'.json', JSON.stringify(infoForGraph, null, 2));

  });
}

main();

