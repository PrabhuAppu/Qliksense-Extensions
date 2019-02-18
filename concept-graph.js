var CollapsibleTree = function(elt) {

  var m = [20, 120, 20, 120],
      w = 1280 - m[1] - m[3],
      h = 580 - m[0] - m[2],
      i = 0,
      root,
      root2;

  var tree = d3.layout.tree()
      // .size([h, w]);
      .size([h, w]);

  // var diagonal = d3.svg.diagonal()
  //     .projection(function(d) { return [d.y, d.x]; });

  var parentdiagonal = d3.svg.diagonal()
      .projection(function(d) { return [-d.y, d.x]; });

  var childdiagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

  var vis = d3.select(elt).append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .append("svg:g")
      // .attr("transform", "translate(" + m[3] + "," + m[0] + ")"); // left-right
      // .attr("transform", "translate(" + m[0] + "," + m[3] + ")"); // top-bottom
      .attr("transform", "translate("+h/2+",0)"); // bidirectional-tree


  var that = {
    init: function(url) {
      var that = this;
      d3.json(url, function(json) {
        root = json;

        // root.x0 = h / 2;
        // root.y0 = 0;
        root.y0 = w / 2;
        root.x0 = h / 2;

        // Initialize the display to show a few nodes.
        root.children.forEach(that.toggleAll);
        // that.toggle(root.children[1]);
        // that.toggle(root.children[1].children[2]);
        // that.toggle(root.children[9]);
        // that.toggle(root.children[9].children[0]);

        // that.updateParents(root);
        // that.updateChildren(root);
        that.updateBoth(root);
      });
    },
    updateBoth: function(source) {
      var duration = d3.event && d3.event.altKey ? 5000 : 500;

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse();

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth*120; });

      // Update the nodes…
      var node = vis.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("svg:g")
          .attr("class", "node")
          .attr("transform", function(d) {
              if(d.isparent){ 
              return "translate(" + -source.x0 + "," + source.y0 + ")";
              }else{
                  return "translate(" + source.x0 + "," + source.y0 + ")";
              } })
              
          .on("click", function(d) { that.toggle(d); that.updateBoth(d); });

      nodeEnter.append("svg:circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("svg:text")
          // .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("y", function(d) {
            if( that.isParent(d) ) {
              return -10;
            } else {
              return d.children || d._children ? -10 : 10;
            }
          })
          .attr("dx", ".35em")
          // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .attr("text-anchor", function(d) {
            if( that.isParent(d) ) {
              return "end";
            } else {
              return d.children || d._children ? "end" : "start";
            }
          })
          .attr("transform",function(d) {
            if( d != root ) {
              if( that.isParent(d) ) {
                return "rotate(0)";
              } else {
                return "rotate(0)";
              }            
            }
          })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) {
            if( that.isParent(d) ) {
              return "translate(" + -d.y + "," + d.x + ")";
            } else {
              return "translate(" + d.y + "," + d.x + ")";
            }
          });

      nodeUpdate.select("circle")
          .attr("r", 4.5)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          // .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .attr("transform", function(d) {
              if(d.isparent){ 
             return "translate(" + -source.y + "," + source.x + ")";
              }else{
                  return "translate(" + source.y + "," + source.x + ")";
              }
                })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-6);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = vis.selectAll("path.link")
          .data(tree.links_parents(nodes).concat(tree.links(nodes)), function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
          .attr("class", "link")
          
          .attr("d", function(d) {
            var o = {x: source.y0, y: source.x0};
            if( that.isParent(d.target) ) {
              return parentdiagonal({source: o, target: o});
            } else {
              // return parentdiagonal({source: o, target: o});
              return childdiagonal({source: o, target: o});
            }
          })
        .transition()
          .duration(duration)
          // .attr("d", parentdiagonal);
          .attr("d", function(d) {
            if( that.isParent(d.target) ) {
              return parentdiagonal(d);
            } else {
              // return parentdiagonal(d);
              return childdiagonal(d);
            }
          })

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          // .attr("d", parentdiagonal);
          .attr("d", function(d) {
            if( that.isParent(d.target) ) {
              return parentdiagonal(d);
            } else {
              return childdiagonal(d);
            }
          })

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            // return parentdiagonal({source: o, target: o});
            if( that.isParent(d.target) ) {
              return parentdiagonal({source: o, target: o});
            } else {
              return childdiagonal({source: o, target: o});
            }
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.y;
        d.y0 = d.x;
      });
    },
    updateParents: function(source) {
        
      var duration = d3.event && d3.event.altKey ? 5000 : 500;

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse();

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.x = d.depth * 180; });

      // Update the nodes…
      var node = vis.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("svg:g")
          .attr("class", "node")
          // .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", function(d) { that.toggle(d); that.updateParents(d); });

      nodeEnter.append("svg:circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("svg:text")
          .attr("y", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dx", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
          .attr("r", 4.5)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          // .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-6);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = vis.selectAll("path.link")
          .data(tree.links(nodes), function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.y0, y: source.x0};
            return parentdiagonal({source: o, target: o});
          })
        .transition()
          .duration(duration)
          .attr("d", parentdiagonal);//edit

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", parentdiagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.y, y: source.x};
            return parentdiagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.y;
        d.y0 = d.x;
      });
    },    
    updateChildren: function(source) {
      var duration = d3.event && d3.event.altKey ? 5000 : 500;

      // Compute the new tree layout.
      var nodes = tree.nodes(root2).reverse();

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth * 180; });

      // Update the nodes…
      var node = vis.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("svg:g")
          .attr("class", "node")
          // .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", function(d) { that.toggle(d); that.updateChildren(d); });

      nodeEnter.append("svg:circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeEnter.append("svg:text")
          .attr("y", function(d) { return d.children || d._children ? -10 : 10; })
          .attr("dx", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
          .duration(duration)
          // .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

      nodeUpdate.select("circle")
          .attr("r", 4.5)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

      nodeUpdate.select("text")
          .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
          .duration(duration)
          // .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

      nodeExit.select("circle")
          .attr("r", 1e-6);

      nodeExit.select("text")
          .style("fill-opacity", 1e-6);

      // Update the links…
      var link = vis.selectAll("path.link")
          .data(tree.links(nodes), function(d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {x: source.y0, y: source.x0};
            return childdiagonal({source: o, target: o});
          })
        .transition()
          .duration(duration)
          .attr("d", childdiagonal);

      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr("d", childdiagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
            var o = {x: source.y, y: source.x};
            return childdiagonal({source: o, target: o});
          })
          .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.y;
        d.y0 = d.x;
      });
    },

    isParent: function(node) {
      if( node.parent && node.parent != root ) {
        return this.isParent(node.parent);
      } else
      // if ( node.name == 'data' || node.name == 'scale' || node.name == 'util' ) {
      if( node.isparent ) {
        return true;
      } else {
        return false;
      }
    },

    // Toggle children.
    toggle: function(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      if (d.parents) {
        d._parents = d.parents;
        d.parents = null;
      } else {
        d.parents = d._parents;
        d._parents = null;
      }
    },
    toggleAll: function(d) {
        
      if (d.children) {
        d.children.forEach(that.toggleAll);
        that.toggle(d);
      }
      if (d.parents) {
          
        d.parents.forEach(that.toggleAll);
        that.toggle(d);
      }
    }

  }

  return that;
}
