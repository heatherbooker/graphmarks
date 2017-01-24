const cheerio = require('cheerio');
const fs = require('fs');
let $ = cheerio.load(fs.readFileSync('testdata/awesome.html'));
$ = cheerio.load($('.markdown-body').html());


function parse() {

  const infoForGraph = {nodes: [], links: []};

  let parentNode;
  let firstTag = $('h2').first();

  recurse(firstTag, parentNode);

  function recurse(firstTag, parentNode) {

    infoForGraph.nodes.push(createNode($(firstTag).text()));

    if (typeof parentNode !== 'undefined') {
      console.log('parent node:', parentNode.text());
      infoForGraph.links.push(createLink(parentNode, firstTag));
    }

    let secondTag = $(firstTag).next();

    if (['H2', 'H3'].includes(secondTag.prop('tagName'))) {
      recurse(secondTag, firstTag);
    } else if (secondTag.prop('tagName') === 'UL') {
      recurse(secondTag, parentNode);
    }

  }


  console.log(infoForGraph);
}

parse()

function createNode(id, title) {

  let group = 1; // Group 1 is urls, group 2 is tags.
  if (typeof title === 'undefined') {
    title = id;
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
    source: parent.text(),
    target: child.text(),
    value: 1 // Value is the strength of the association.
  };
}
