var width = window.innerWidth;
var height = window.innerHeight;

var svg = d3.select("svg")
    .attr('height', height)
    .attr('width', width)
    .call(d3.zoom().on("zoom", function() {
        svg.attr("transform", d3.event.transform)
    }))
    .append('g');

var color = ['#ee6e73', '#ee6e73', '#78909C', '#78909C'];

d3.json("/rcrs/awesome-awesomeness.json", function(error, graph) { // may need to return all nodes as an array first and then take out the ones i don't need. 
    allnodes = graph.allnodes;
    delete graph.allnodes

    $(".btn1").on( "click", loadgraph);
    $(".btn2").on( "click", savegraph);

    var simulation = d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links).distance(200))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .alphaTarget(0)
        .on("tick", ticked)
        .on('end', function(){
          window.localStorage.moo= JSON.stringify(graph.nodes); 
        });

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

    restart();

    function restart() {
        node = node.data(graph.nodes, function(d) {
            return d.id;
        });
        node.exit().remove();
        newnodes = [];
        newnodes = node.enter().append('g').attr('class', 'nodeg');
        color = ['#ee6e73', '#ee6e73', '#78909C', '#78909C'];
        newcircles = newnodes.append("circle").attr("fill", function(d) {
            return color[d.layer];
        }).attr("r", 8).attr('title', function(d) {return d.title}).attr('id', function(d) {return d.id}).attr('clicked', 'false'); // this shouldn't be automatically false. 
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

    function loadgraph() {
      var nodedict=window.nodedict;
      graph.nodes= graph.nodes.filter( function(elt){ return nodedict[elt.id];}).map( function(elt){
        elt.x= nodedict[elt.id]['x'];
        elt.y= nodedict[elt.id]['y'];
        elt.fx= nodedict[elt.id]['fx'];
        elt.fy= nodedict[elt.id]['fy'];
        return elt;
      })
      graph.links= graph.links.filter(function(elt){
        return nodedict[elt.source.id] && nodedict[elt.target.id];
      })
      restart();
    };

    function savegraph() {
      var nodedict= {};
      graph.nodes.forEach(function(elt){
        nodedict[elt.id]={
          x: elt.x,
          y: elt.y,
          fx: elt.fx,
          fy: elt.fy
        };
      })
      window.nodedict= nodedict;
      console.log('saved')
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
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = d.x;
        d.fy = d.y;
    }

    function clicked(d) {
        var thisthing = d3.select(this);
        var thistitle = thisthing.attr('title');
        var thisindex = graph.nodes.findIndex(function(elt) {
            return elt.title == thistitle;
        })
        var newchild = []
        if (thisthing.attr('clicked') == 'false') { // add nodes and add links. 
            console.log('clicked')

            thischildren = allnodes[thistitle].children;

            if (thischildren.length > 0) {
                for (var i = 0; i < thischildren.length; i++) {
                    newchild.push(graph.nodes.length)
                    graph.nodes.push(allnodes[thischildren[i]])
                }
                restart();
                for (var i = 0; i < thischildren.length; i++) {
                    var link = {
                        source: graph.nodes[thisindex], // clicked==source
                        target: graph.nodes[newchild[i]] // target == children
                    };
                    graph.links.push(link)
                }
                restart();
                thisthing.attr('clicked', 'true')
            }
        } else {
          console.log('unclicked')
          thisthing.attr('clicked', 'false')
            start = graph.nodes.findIndex(function(elt) {
                return elt.title == allnodes[thistitle].children[0]
            })
            if (start!=-1){
              deletecount = allnodes[thistitle].children.length;
              graph.nodes.splice(start, deletecount) // remove all child nodes
              console.log(graph.nodes)
              
              for (var j= 0; j<deletecount; j++){
                index= graph.links.findIndex(function(elt) {
                    return elt.target.title == allnodes[thistitle].children[j]; 
                });
                graph.links[index]
                graph.links.splice(index,1) // remove all links to child nodes. 
              }
              restart()
            }
        }
    }
    
    function dblclicked(d) {
      console.log('doubleclicked');
      var thisthing = d3.select(this);
      var thistitle = thisthing.attr('title');
      var thisid = thisthing.attr('id');
      console.log(thistitle, thisid)
      if (thistitle!=thisid){
        window.open(thisid);
      }
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
    }
})