 function forceChart(){
	 var w = 960,
     h = 500;

var nodes = d3.range(5).map(function(i) {
  return {type: Math.random() * 5 | 0,
          radius: 30,
          fixed:true,
          type:i,
          x: (i+1) * (w / 6),
          y: h / 2};
    }),
    color = d3.scale.category10();

var force = d3.layout.force()
    .gravity(0)
    .charge(-30)
    .nodes(nodes)
	//.alpha(1)
    .size([w, h]);

force.start();

var svg = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

svg.append("svg:rect")
    .attr("width", w)
    .attr("height", h);

svg.selectAll("circle")
    .data(nodes)
  .enter().append("svg:circle")
    .attr("r", function(d) { return d.radius - 2; })
    .style("fill", function(d, i) { return color(d.type); });

force.on("tick", function(e) {
  var q = d3.geom.quadtree(nodes),
      k = e.alpha * .1,
      i = 0,
      n = nodes.length,
      o;

  while (++i < n) {
    o = nodes[i];
    if (o.fixed) continue;
    c = nodes[o.type];
    o.x += (c.x - o.x) * k;
    o.y += (c.y - o.y) * k;
    q.visit(collide(o));
  }

  svg.selectAll("circle")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
});

var p0;
var data = DataBubble;
var getCenters = function (vname, size) {
          var centers, map;
          centers = _.uniq(_.pluck(data, vname)).map(function (d) {
            return {name: d, value: 1};
          });

          map = d3.layout.treemap().size(size).ratio(1/1);
          map.nodes({children: centers});

          return centers;
        };
var nnodes;
svg.on("mousemove", function() {
  var p1 = d3.svg.mouse(this),
      node = {radius:Math.random() * 12 + 4, type: Math.random() * 5 | 0, x: p1[0], y: p1[1], px: (p0 || (p0 = p1))[0], py: p0[1]};
console.log(node);
  p0 = p1;

  nnodes = svg.append("svg:circle")
      .data([node])
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.radius - 2; })
      .style("fill", function(d) {return color(d.type);})
      .transition()
        .delay(3000)
        //.attr("r", 1e-6)
        .each("end", function() { nodes.splice(6, 1); })
        ;//.remove();

  nodes.push(node);
  
  var centers = getCenters('EMP_ID', [w, h]);
          force
		  .on("tick", tick(centers, 'EMP_ID'));
          labels(centers)
		  force.resume();
  
  //force.resume();
});

function tick (centers, varname) {
		
          var foci = {};
          for (var i = 0; i < centers.length; i++) {
            foci[centers[i].name] = centers[i];
          }
          return function (e) {
		  //var q = d3.geom.quadtree(nodes),
            for (var i = 0; i < data.length; i++) {
              var o = data[i];
              var f = foci[o[varname]];
              o.y += ((f.y + (f.dy / 2)) - o.y) * e.alpha;
              o.x += ((f.x + (f.dx / 2)) - o.x) * e.alpha;
			  //q.visit(collide(o));
            }
			//alert("A");
            nnodes.each(collide(0.11))
              .attr("cx", function (d) { return d.x; })
              .attr("cy", function (d) { return d.y; });
			  
			/*n = nodes.length,
			o;

			while (++i < n) {
				o = nodes[i];
				if (o.fixed) continue;
				
			}*/
			 // alert("A");
          }
        }
function labels (centers) {
          svg.selectAll(".label2").remove();

          svg.selectAll(".label2")
          .data(centers).enter().append("text")
          .attr("class", "label2")
          .text(function (d) { return d.name })
          .attr("transform", function (d) {
            return "translate(" + (d.x + (d.dx / 2)) + ", " + (d.y + 20) + ")";
          });
        }
function collide(node) {
  var r = node.radius + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .5;
        node.px += x * l;
        node.py += y * l;
      }
    }
    return x1 > nx2
        || x2 < nx1
        || y1 > ny2
        || y2 < ny1;
  };
}
 }
 
 var DataBubble = [{EMP_ID :'1', Date : 42157,Reason :'Comp Off',comb: 1},
{EMP_ID :'1', Date : 42158,Reason :'Forgot access card',comb: 1},
{EMP_ID :'1', Date : 42159,Reason :'CompOff',comb: 1},
{EMP_ID :'1', Date : 42160,Reason :'Forgot access card',comb: 1},
{EMP_ID :'2', Date : 42161,Reason :'Sick leave',comb: 1},
{EMP_ID :'2', Date : 42162,Reason :'CompOff',comb: 1},
{EMP_ID :'2', Date : 42163,Reason :'Forgot access card',comb: 1},
{EMP_ID :'2', Date : 42164,Reason :'Sick leave',comb: 1},
{EMP_ID :'2', Date : 42165,Reason :'CompOff',comb: 1},
];