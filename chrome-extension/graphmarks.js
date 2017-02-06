chrome.bookmarks.getTree(function(bookmarks) {

  const nodes = [{id: 'root', title: 'root', children: []}];
  const bkmrksBar = bookmarks[0].children[0];
  const bkmrks = bookmarks[0].children[1];

  addNodes(bkmrks, nodes[0].title, nodes[0].children, nodes);
  console.log(nodes);
});

function addNodes(bkmrk, parent, parentsChildren, nodes) {

  const newNode = {
    id: bkmrk.url || bkmrk.title,
    title: bkmrk.title,
    parent,
    children: [],
    layer: 1
  };
  nodes.push(newNode);
  parentsChildren.push(newNode.id);

  if (typeof bkmrk.children !== 'undefined') {
    bkmrk.children.forEach(child => {
      addNodes(child, bkmrk.title, newNode.children, nodes);
    });
  }
}

