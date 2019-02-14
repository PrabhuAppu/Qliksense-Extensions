function tree(){
	var margin = {top: 30, right: 20, bottom: 30, left: 20},
		width = $('.tree').width() - margin.left - margin.right,
		barHeight = 40,
		barWidth = width * .8;

	var i = 0,
		duration = 400,
		root;
//alert(d3.layout.tree());
	var tree = d3.layout.tree()
		.nodeSize([0, 20]);
	var color = function(d,i){ return (colors(i));};
	var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select(".tree").append("svg")
		.attr("width", width + margin.left + margin.right)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//d3.json("flare.json", function(error, flare) {
	  //if (error) throw error;

	  data.x0 = 0;
	  data.y0 = 0;
	  update(root = data);
	//});

	function update(source) {

	  // Compute the flattened node list. TODO use d3.layout.hierarchy.
	  var nodes = tree.nodes(root);

	  var height = Math.max($('.tree').height(), nodes.length * barHeight + margin.top + margin.bottom);
	  console.log(height);
	  d3.select(".tree").select("svg").transition()
		  .duration(duration)
		  .attr("height", height);

	  d3.select(self.frameElement).transition()
		  .duration(duration)
		  .style("height", height + "px");

	  // Compute the "layout".
	  var prev = -1;
	  var ii = 0;
	  nodes.forEach(function(n, i) {
		  n.x = (n.children||n._children)?(i*barHeight)+(ii*20):(i*barHeight)+(ii*20);//(n.depth==1 || n.depth==0)?(i) * barHeight*2:(i) * barHeight;
		  ii = (n.children||n._children)?ii+1:ii;
		//n.x = (n.depth!=prev)?(i*barHeight)+ii+20:(i*barHeight)+ii;//(n.depth==1 || n.depth==0)?(i) * barHeight*2:(i) * barHeight;
		//ii = (n.depth!=prev)?ii+20:ii;
		prev=n.depth;
	  });

	  // Update the nodes…
	  var node = svg.selectAll("g.node")
		  .data(nodes, function(d) { return d.id || (d.id = ++i); });

	  var nodeEnter = node.enter().append("g")
		  .attr("class", "node")
		  .attr("transform", function(d) { if(d.depth==1){return "translate(" + source.y0 + "," + (source.x0) + ")";}
										   else {return "translate(" + (source.y0) + "," + (source.x0) + ")";}
										 })
		  .style("opacity", 1e-6);

	  // Enter any new nodes at the parent's previous position.
	  nodeEnter.append("rect")
		  .attr("y", function(d,i){console.log(d.depth+";"+i+";"+d.name+";"+d.y);if(d.depth==1){return -barHeight / 2;}else{return -barHeight / 2;}})//-barHeight / 2)
		  .attr("height", function(d,i){if(d.depth<=1){return barHeight+20;}else{return barHeight;}})
		  .attr("width", barWidth)
		  .style("fill", color)
		  .on("click", click);

	 /* nodeEnter.append("text")
		  .attr("dy", 3.5)
		  .attr("dx", 5.5)
		  .text(function(d) { return d.name; });*/

	  // Transition nodes to their new position.
	  nodeEnter.transition()
		  .duration(duration)
		  .attr("transform", function(d) { if(d.depth==1){ return "translate(" + d.y + "," + (d.x) + ")"; }
								         else { return "translate(" + d.y + "," + (d.x) + ")"; }
										 })
		  .style("opacity", 1);

	  node.transition()
		  .duration(duration)
		  .attr("transform", function(d) {if(d.depth==1){ return "translate(" + d.y + "," + (d.x) + ")";  }
										  else{return "translate(" + d.y + "," + (d.x) + ")"; }
										 })
		  .style("opacity", 1)
		.select("rect")
		  .style("fill", color);

	  // Transition exiting nodes to the parent's new position.
	  node.exit().transition()
		  .duration(duration)
		  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		  .style("opacity", 1e-6)
		  .remove();

	  // Update the links…
	  /*var link = svg.selectAll("path.link")
		  .data(tree.links(nodes), function(d) { return d.target.id; });

	  // Enter any new links at the parent's previous position.
	  link.enter().insert("path", "g")
		  .attr("class", "link")
		  .attr("d", function(d) {
			var o = {x: source.x0, y: source.y0};
			return diagonal({source: o, target: o});
		  })
		.transition()
		  .duration(duration)
		  .attr("d", diagonal);

	  // Transition links to their new position.
	  link.transition()
		  .duration(duration)
		  .attr("d", diagonal);

	  // Transition exiting nodes to the parent's new position.
	  link.exit().transition()
		  .duration(duration)
		  .attr("d", function(d) {
			var o = {x: source.x, y: source.y};
			return diagonal({source: o, target: o});
		  })
		  .remove();*/

	  // Stash the old positions for transition.
	  nodes.forEach(function(d,i) {
		d.x0 = d.x;
		d.y0 = d.y;
	  });
	}

	// Toggle children on click.
	function click(d) {
	  if (d.children) {
		d._children = d.children;
		d.children = null;
	  } else {
		d.children = d._children;
		d._children = null;
	  }
	  update(d);
	}

	function color(d) {
	  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
	}
}


var data = {
	"name" : "root",
	"children" : [{
	   "name": "359084",
	   "children": [
			  {"name": "Qliktech Session", "size": 5},
			  {"name": "Onsite Counter part was on leave", "size": 2},
			  {"name": "Status Call", "size": 1},
			  {"name": "Colleague was on leave", "size": 7},
			  {"name": "KT Session", "size": 5},
			  {"name": "Onsite Holiday", "size": 2},
			  {"name": "Critical Project Delivery", "size": 1}
			 ]
	},
	{
	   "name": "379799",
	   "children": [
			  {"name": "Qliktech Session", "size": 5},
			  {"name": "Onsite Counter part was on leave", "size": 2},
			  {"name": "Status Call", "size": 1},
			  {"name": "Colleague was on leave", "size": 7},
			  {"name": "KT Session", "size": 5},
			  {"name": "Onsite Holiday", "size": 2},
			  {"name": "Critical Project Delivery", "size": 1}
			 ]
	},
	{
	   "name": "387900",
	   "children": [
			  {"name": "Qliktech Session", "size": 5},
			  {"name": "Onsite Counter part was on leave", "size": 2},
			  {"name": "Status Call", "size": 1},
			  {"name": "Colleague was on leave", "size": 7},
			  {"name": "KT Session", "size": 5},
			  {"name": "Onsite Holiday", "size": 2},
			  {"name": "Critical Project Delivery", "size": 1}
			 ]
	}]
}
;
/*,
{
   "name": "379799",
   "children": [
		  {"name": "Qliktech Session", "size": 5},
		  {"name": "Onsite Counter part was on leave", "size": 2},
		  {"name": "Status Call", "size": 1},
		  {"name": "Colleague was on leave", "size": 7},
		  {"name": "KT Session", "size": 5},
		  {"name": "Onsite Holiday", "size": 2},
		  {"name": "Critical Project Delivery", "size": 1}
		 ]
},
{
   "name": "387900",
   "children": [
		  {"name": "Qliktech Session", "size": 5},
		  {"name": "Onsite Counter part was on leave", "size": 2},
		  {"name": "Status Call", "size": 1},
		  {"name": "Colleague was on leave", "size": 7},
		  {"name": "KT Session", "size": 5},
		  {"name": "Onsite Holiday", "size": 2},
		  {"name": "Critical Project Delivery", "size": 1}
		 ]
}
};*/