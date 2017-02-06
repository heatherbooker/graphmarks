chrome.bookmarks.getTree(function(bookmarks) {

  const nodes = [{id: 'root', title: 'root', parent: '', children: [], layer: 0}];
  const bkmrksBar = bookmarks[0].children[0];
  const bkmrks = bookmarks[0].children[1];

  addNodes(bkmrks, nodes[0].title, nodes[0].children, nodes, 1);
  console.log(nodes);
});

function addNodes(bkmrk, parent, parentsChildren, nodes, layer) {

  const newNode = {
    id: bkmrk.url || bkmrk.title,
    title: bkmrk.title,
    parent,
    children: [],
    layer
  };
  nodes.push(newNode);
  parentsChildren.push(newNode.id);

  if (typeof bkmrk.children !== 'undefined') {
    bkmrk.children.forEach(child => {
      addNodes(child, bkmrk.title, newNode.children, nodes, layer+1);
    });
  }
}

