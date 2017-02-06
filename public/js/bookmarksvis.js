function visualize(graph){

var width = window.innerWidth;
var height = window.innerHeight;

var svg = d3.select("svg")
    .attr('height', height)
    .attr('width', width)
    .call(d3.zoom().on("zoom", function() {
        svg.attr("transform", d3.event.transform)
    }))
    .append('g');

var color = ['#ee6e73', '#78909C', '#ee6e73', '#78909C'];
// function makedict(ge){
//   nodedict={}
//   ge.forEach(function(elt, index){
//     nodedict[elt.id]= index; 
//   })
//   return nodedict
// }


  



allnodesobj = graph.allnodesobj;

// for (key in allnodesobj) {
//     if (allnodesobj[key].layer <= 2) {
//         graph.nodes.push(allnodesobj[key])
//     }
// }

// allnodes= graph.nodes; 
// nodedict= makedict(allnodes); 
// initlinks= graph.links; 
// graph.links=[];
// graph.nodes= allnodes.filter(function(elt, id){return elt.layer<=2; }) 

var simulation = d3.forceSimulation(graph.nodes)
    .force("link", d3.forceLink(graph.links).distance(200))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alphaTarget(0.3)
    .on("tick", ticked);

var link = svg.append("g").selectAll(".link");
var node = svg.append("g").selectAll(".node");
restart();
nodesnow = graph.nodes;
nodesnow.forEach(function(elt, i) {
    if (elt.parent != "") {
        parentindex = nodesnow.findIndex(function(belt) {
            return belt.title == elt.parent
        })
        graph.links.push({
            source: graph.nodes[i],
            target: graph.nodes[parentindex]
        })

    }
})
// initlinks.forEach(function(elt){
//   graph.links.push({source:graph.nodes[nodedict[elt.source]], target:graph.nodes[nodedict[elt.target]]})
// })       
console.log(graph.nodes)

restart();

console.log(graph.nodes)

function restart() {
    node = node.data(graph.nodes, function(d) {
        return d.id;
    });
    node.exit().remove();
    newnodes = [];
    newnodes = node.enter().append('g').attr('class', 'nodeg');

    newcircles = newnodes.append("circle").attr("fill", function(d) {
        return color[d.group];
    }).attr("r", 8).attr('title', function(d) {
        return d.title
    }).attr('clicked', 'false'); // this shouldn't be automatically false. 
    circle = svg.selectAll('circle');
    circle.on("click", clicked)
        .on("dblclick", dblclicked);
    circle.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    newtexts = newnodes.append("text").text(function(d) {
        return d.title;
    }).attr('class', 'txt');
    txt = svg.selectAll('.txt');
    newurls = newnodes.append("text").text(function(d) {
        return d.group == 1 ? d.id : "";
    }).attr('class', 'url');
    url = svg.selectAll('.url');

    node = node.merge(newnodes);

    link = link.data(graph.links, function(d) {
        return d.source.id + "-" + d.target.id;


    });
    link.exit().remove();
    link = link.enter().append("line").attr("class", "links").attr("stroke-width", function(d) {
        return Math.sqrt(d.value);
    }).merge(link);

    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);
    simulation.restart();
}

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
    if (!d3.event.active) simulation.alphaTarget(0.3);
    d.fx = d.x;
    d.fy = d.y;
}

function clicked(d) {
    var thisthing = d3.select(this);
    var thistitle = thisthing.attr('circletitle');
    var thisindex = graph.nodes.findIndex(function(elt) {
        return elt.title == this.title;
    })
    var newchild = []
    if (thisthing.attr('clicked') == 'false') { // add nodes and add links. 
        thischildren = allnodesobj[thistitle].children;
        if (thischildren.length > 0) {
            for (var i = 0; i < thischildren.length; i++) {
                newchild.push(graph.nodes.length)
                graph.nodes.push(allnodesobj[thischildren[i]])
            }
            restart();
            for (var i = 0; i < thischildren.length; i++) {
                var link = {
                    source: graph.nodes[thisindex],
                    target: graph.nodes[newchild[i]]
                };
                graph.links.push(link)
            }
            restart();
            thisthing.attr('clicked', 'true')
        }
    } else {
        console.log('already clicked')
    } // nothing yet! 
}
//     if (parents[thistitle]){
//       for i 
// 
//       graph.nodes.push(allnodesobj[allnodesobj[thistitle].children[i]])
//       graph.nodes= graph.nodes.concat(allnodesob[allnodesobj[thistitle].children)]; // would be nice to set x and y here as the clicked node's x and y. 
//       restart()
//       thisindex= nodedict[d3.select(this).attr('circleid')]; 
//       for (var i=1; i<=parents[thistitle].length; i++){
//         graph.links.push({source:graph.nodes[thisindex], target:graph.nodes[thisindex+i]})  // parents are sources, children are targets!
//       }
//       restart()
//       d3.select(this).attr('clicked', 'true')
//     }
//     
//     
//     
//   } else {                                // remove nodes and links
//     start= graph.nodes.findIndex(function(elt){return elt.name== parents[thisname][0]); 
//     deletecount= parents[thisname].length;
//     graph.nodes= graph.nodes.splice(start, deletecount)   // remove all child nodes
//     start= graph.links.findIndex(function(elt){return elt.source.name== thisname}); 
//     graph.links= graph.links.splice(start, deletecount)   // remove all links to child nodes. 
//     restart()
//   } 
// }
// 
// 

function dblclicked(d) {
    console.log('dblclick!')
}
//if this.title !=this.id new window with this.id}

function ticked() {
    circle.attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        });

    txt.attr("x", function(d) {
            return d.x + 10;
        })
        .attr("y", function(d) {
            return d.y + 10;
        });

    url.attr("x", function(d) {
            return d.x + 10;
        })
        .attr("y", function(d) {
            return d.y + 25;
        });

    link.attr("x1", function(d) {
            return d.source.x;
        })
        .attr("y1", function(d) {
            return d.source.y;
        })
        .attr("x2", function(d) {
            return d.target.x;
        })
        .attr("y2", function(d) {
            return d.target.y;
        });
}}