var request = require('request');
var cheerio = require('cheerio');
var showdown = require('showdown');
var converter = new showdown.Converter();
var fs = require('fs');

var moo = request('https://raw.githubusercontent.com/bayandin/awesome-awesomeness/master/README.md', function(error, response, body) {
    if (!error && response.statusCode == 200) {
        var bodyhtml = converter.makeHtml(body);
        var $ = cheerio.load(bodyhtml);
        var allnodesarr = [];
        var allnodesobj = {};
        var parents = {};

        $('a').each(function(i, elem) {
            object = {};
            parent = $(this).parent().parent().parent().text().split('\n')[0];
            grandparent = $(this).parent().parent().parent().parent().parent().text().split('\n')[0];
            title = $(this).text();
            object.parent = parent;
            object.id = $(this).attr('href');
            object.title = title;
            grandparent ? object.layer = 3 : object.layer = 2;
            object.children = [];

            allnodesobj[object.title] = object;
            //update or add parent
            if (allnodesobj[parent]) {
                allnodesobj[parent].children.push(title) // we know we havent seen before. 
            } else {
                allnodesobj[parent] = {
                    title: parent,
                    id: parent,
                    layer: 2,
                    children: [title]
                }
            }
            //update or add grandparent if it exists
            if (grandparent) {
                allnodesobj[parent].parent = grandparent;
                if (allnodesobj[grandparent]) {
                    if (allnodesobj[grandparent].children.indexOf(parent) == -1) {
                        allnodesobj[grandparent].children.push(parent)
                    }
                } else {
                    allnodesobj[grandparent] = {
                        title: grandparent,
                        id: grandparent,
                        layer: 1,
                        children: [parent]
                    }
                }
            }
        })
        graph = {};
        graph.nodes = [];

        for (key in allnodesobj) {
            if (allnodesobj[key].layer <= 2) {
                graph.nodes.push(allnodesobj[key])
            }
        }
        graph.links = [];
        graph.allnodes = allnodesobj;
        fs.writeFileSync('rcrs/awesome-awesomeness' + '.json', JSON.stringify(graph, null, 2));
    }
});