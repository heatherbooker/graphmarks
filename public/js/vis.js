
var width = window.innerWidth;
var height= window.innerHeight;
var svg = d3.select("svg")
.attr('height', height)
.attr('width', width)
.call(d3.zoom().on("zoom", function () {
  svg.attr("transform", d3.event.transform)
}))
.append('g');

// var color = d3.scaleOrdinal(d3.schemeCategory20);
color=['#ee6e73','#78909C','#ee6e73','#78909C'];

var simulation = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.id; })
.distance(function(d){return d.value== 1? 300: 300;}))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width / 2, height / 2));

// function makerandomlinks(innode, tags) {
//   outlinks= []
// for (i=0; i<innode.length; i++) {
//       linkto= Math.floor(Math.random()*tags.length);
//       outlinks.push( {'source':innode[i].id, 'target': tags[linkto].id, 'value': 1} )
//   }
//   return outlinks
// }
// d3.json("links.json", function(error, nodette) {
//   tags=[]
//   for (i=0; i<nodette.length/3; i++){
//     tags.push({'title':"TAG"+i, 'id':"TAG"+i, 'group':2 })
//   }

d3.json("graphmarks/rcrs/awesomelinks.json", function(error, graph) {
  graph.nodes.push({"id": "AWESOME- Dot Files","title": "AWESOME- Dot Files","group": 2})
  var boo= graph.nodes.filter(function(elt){return elt.group==2})
  for (var i=0; i<boo.length; i++){
    graph.links.push({'source':"AWESOME- Dot Files", 'target':boo[i] , 'value': 2})
  }
  if (error) throw error;

  var link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter().append("line")
  .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
  .selectAll("circle")
  .data(graph.nodes)
  .enter()
  .append('g')
  .attr("class", function(d) { return d.group==1 ? "nodes": "tag"; })

  var circle=node.append("circle")
  .attr("r", 7)
  .attr("fill", function(d) { return color[d.group];})

  var txt=node.append("text")
  .text(function(d) { return d.title; })
  .attr('class','txt');

  var url=node.append("text")
  .text(function(d) { return d.group==1 ? d.id:""; })
  .attr('class','url');

  circle.call(d3.drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended));

  simulation.nodes(graph.nodes)
  .on("tick", ticked)
  .force("link")
  .links(graph.links);

  function ticked() {
    link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
    txt
    .attr("x", function(d) { return d.x+10; })
    .attr("y", function(d) { return d.y+10; });
    url
    .attr("x", function(d) { return d.x+10; })
    .attr("y", function(d) { return d.y+25; });
    circle
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = d.x;
  d.fy = d.y;
}

function resetted() {
// this should probably do something at some point
}
