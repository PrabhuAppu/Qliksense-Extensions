function callBubble(){
	DataBubble = BubbleData;
	var divName = "chart_bubble";
	 $("#chart_bubble").empty();
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
		width = $("#chart_bubble").width() - margin.left - margin.right,
		height =  $("#chart_bubble").height() - margin.top - margin.bottom- 20,
		//var width = 960,
  //  height = 700,
    radius = Math.min(width, height) / 2,
	padding = 5,
	duration = 1000;

	//d3.csv(csvData/*template_path+'fuel.csv'*/, function (error, data) {
//alert(JSON.stringify(data));
        //var width = 800, height = 800;
		var data=DataBubble;
		//alert(JSON.stringify(data));
        var fill = d3.scale.category10();//d3.scale.ordinal().range(['#827d92','#827354','#523536','#72856a','#2a3285','#383435'])
        var svg = d3.select("#chart_bubble").append("svg")
            .attr("width", width)
            .attr("height", height);

			var rad = d3.scale.linear()
				.range([0, 20])
				.domain([3,18]);
			
        for (var j = 0; j < data.length; j++) {
          data[j].radius = rad(+data[j].comb);
          data[j].x = Math.random() * width;
          data[j].y = Math.random() *height;
        }

        var padding = 2;
        var maxRadius = d3.max(_.pluck(data, 'radius'));

        var getCenters = function (vname, size) {
          var centers, map;
          centers = _.uniq(_.pluck(data, vname)).map(function (d) {
            return {name: d, value: 1};
          });

          map = d3.layout.treemap().size(size).ratio(1/1);
          map.nodes({children: centers});

          return centers;
        };

        var nodes = svg.selectAll("circle")
          .data(data);
		  /*var nodes = svg.selectAll("text")
          .data(data);*/
		  console.log(nodes);
//alert("a");
        nodes.enter().append("circle")
          .attr("class", "bubble")
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function (d) { return d.y; })
          .attr("r", function (d) { return d.radius; })
          .style("fill", function (d) { return colors(d.Reason); })
          .on("mouseover", function (d) { showPopover.call(this, d); })
          .on("mouseout", function (d) { removePopovers(); });
		  
		   /*nodes.enter().append("rect")
          .attr("class", "bubble")
          .attr("x", function (d) { return d.x; })
          .attr("y", function (d) { return d.y; })
          .attr("width", function (d) { return d.radius; })
		  .attr("height", function (d) { return d.radius; })
          .style("fill", function (d) { return fill(d.Reason); })
          .on("mouseover", function (d) { showPopover.call(this, d); })
          .on("mouseout", function (d) { removePopovers(); });*/
		  
		 /* nodes.enter().append("text")
          .attr("class", "bubbleText")
          .attr("x", function (d) { return d.x; })
          .attr("y", function (d) { return d.y; })
          //.attr("width", function (d) { return d.radius*5; })
		  //.attr("height", function (d) { return d.radius; })
		  .text(function (d) { return d.Reason; })
          .attr("fill", function (d) { return fill(d.Reason); })
		  .attr("font-size","20px")
          .on("mouseover", function (d) { showPopover.call(this, d); })
          .on("mouseout", function (d) { removePopovers(); });
		  */
		  //.attr("opacity",0.8);
//alert("a");
		/*         var nodes = svg.selectAll("rect")
          .data(data);
		 nodes.enter().append("rect")
          .attr("class", "node")
          .attr("x", function (d) { return d.x; })
          .attr("y", function (d) { return d.y; })
          .attr("width", function (d) { return d.radius; })
		  .attr("height", function (d) { return d.radius; })
          .style("fill", function (d) { return fill(d.make); })
          .on("mouseover", function (d) { showPopover.call(this, d); })
          .on("mouseout", function (d) { removePopovers(); }) */
		  
        var force = d3.layout.force()
		.gravity(0)
		  .charge(-30)
		  .friction(0)
		   .nodes(nodes)
		   .alpha(1);

        draw($( "#selector .btn.active" ).attr('id'));//'EMP_ID');

        $( "#selector .btn" ).click(function() {
          draw(this.id);
        });
		//Axis
		/*var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1, 1);

		var y = d3.scale.ordinal()
			.domain(['3590894', '379799', '379817'])
			.rangeBands([0, height - 60], .1);
			//.range([height, 0]);
		
		x.domain(data.map(function(d) { return (d.Date); }));
		//y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
		
		var xAxis_bot = d3.svg.axis()
		.scale(x)
		.orient("bottom");

    svg.append("g")
		  .attr("class", "x axis xAxis")
		  .attr("transform", "translate(0," + (height-100) + ")")
		  .call(xAxis_bot);
		
		nodes.each(collide(0.11))
              .attr("cx", function (d) { console.log("nodes",d); return x(d.Date); })
			  .attr("cy", function (d) { console.log("nodes",d); return y(d.EMP_ID); });
		
		*/

        function draw (varname) {
		
          var centers = getCenters(varname, [width, height]);
		  console.log((centers));
          force
		  .on("tick", tick(centers, varname));
          labels(centers)
		  force.start();
        }

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
            nodes.each(collide(0.11))
              .attr("cx", function (d) { return d.x; })
              .attr("cy", function (d) { return d.y; });
			/*  nodes.each(collide(0.11))
              .attr("x", function (d) { return d.x; })
              .attr("y", function (d) { return d.y; });*/
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

        function removePopovers () {
          $('.popover').each(function() {
            $(this).remove();
          }); 
        }

        function showPopover (d) {
          $(this).popover({
            placement: 'auto top',
            container: '#'+divName,
            trigger: 'manual',
            html : true,
            content: function() { 
              return "Country: " + d.Country + "<br/>Month: " + d.Month + 
                     "<br/>Product: " + d.Product + "<br/>Oty: " + d.comb; 
            }
          });
          $(this).popover('show')
        }

        function collide(alpha) {
          var quadtree = d3.geom.quadtree(data);
          return function (d) {
            var r = d.radius + maxRadius + padding,
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
              if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + padding;
                if (l < r) {
                  l = (l - r) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
                }
              }
              return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
          };
        }
}

var DataBubble = [
{EMP_ID :'359084', Date : 16,Reason :'Colleague was on leave',comb: 1},
{EMP_ID :'359084', Date : 17,Reason :'Colleague was on leave',comb: 1},
{EMP_ID :'359084', Date : 17,Reason :'Colleague was on leave',comb: 1},
{EMP_ID :'379817', Date : 14,Reason :'Onsite Counter part was on leave',comb: 1},
{EMP_ID :'359084', Date : 16,Reason :'Onsite Counter part was on leave',comb: 1},
{EMP_ID :'359084', Date : 17,Reason :'Onsite Counter part was on leave',comb: 1},
{EMP_ID :'379817', Date : 14,Reason :'Onsite Holiday',comb: 1},
{EMP_ID :'359084', Date : 17,Reason :'Onsite Holiday',comb: 1},
{EMP_ID :'359084', Date : 17,Reason :'Qliktech Session',comb: 1},
{EMP_ID :'359084', Date : 18,Reason :'Qliktech Session',comb: 1},
{EMP_ID :'359084', Date : 16,Reason :'Status Call',comb: 1},
{EMP_ID :'359084', Date : 18,Reason :'Status Call',comb: 1},
{EMP_ID :'379817', Date : 14,Reason :'Qliktech Session',comb: 1},
{EMP_ID :'379817', Date : 16,Reason :'Onsite Counter part was on leave',comb: 1},
{EMP_ID :'379817', Date : 16,Reason :'Onsite Counter part was on leave',comb: 1},
{EMP_ID :'379817', Date : 15,Reason :'Onsite Holiday',comb: 1},
{EMP_ID :'359084', Date : 15,Reason :'Status Call',comb: 1},
{EMP_ID :'379817', Date : 17,Reason :'Onsite Holiday',comb: 1},
{EMP_ID :'379817', Date : 15,Reason :'Onsite Counter part was on leave',comb: 1},
{EMP_ID :'359084', Date : 15,Reason :'KT Session',comb: 1},
{EMP_ID :'379817', Date : 17,Reason :'Qliktech Session',comb: 1},
{EMP_ID :'379817', Date : 18,Reason :'Qliktech Session',comb: 1},
{EMP_ID :'379817', Date : 18,Reason :'Qliktech Session',comb: 1},
{EMP_ID :'379817', Date : 15,Reason :'Onsite Counter part was on leave',comb: 1},
{EMP_ID :'379817', Date : 18,Reason :'Qliktech Session',comb: 1},
{EMP_ID :'359084', Date : 15,Reason :'Status Call',comb: 1},
{EMP_ID :'379817', Date : 17,Reason :'Status Call',comb: 1},
{EMP_ID :'359084', Date : 15,Reason :'Onsite Counter part was on leave',comb: 1},
{EMP_ID :'379817', Date : 15,Reason :'Status Call',comb: 1},
{EMP_ID :'359084', Date : 16,Reason :'Colleague was on leave',comb: 1},
{EMP_ID :'359084', Date : 16,Reason :'Status Call',comb: 1},
{EMP_ID :'359084', Date : 16,Reason :'Onsite Holiday',comb: 1},
{EMP_ID :'379817', Date : 16,Reason :'Qliktech Session',comb: 1},


];

/*{EMP_ID :'400000000', Date : 42157,Reason :'Comp Off',comb: 1},
{EMP_ID :'2356', Date : 42158,Reason :'Forgot access card',comb: 1},
{EMP_ID :'359084', Date : 42159,Reason :'CompOff',comb: 1},
{EMP_ID :'359084', Date : 42160,Reason :'Forgot access card',comb: 1},
{EMP_ID :'359084', Date : 42161,Reason :'Sick leave',comb: 1},
{EMP_ID :'359084', Date : 42162,Reason :'CompOff',comb: 1},
{EMP_ID :'359084', Date : 42163,Reason :'Forgot access card',comb: 1},
{EMP_ID :'359084', Date : 42164,Reason :'Sick leave',comb: 1},
{EMP_ID :'359084', Date : 42165,Reason :'CompOff',comb: 1},
];*/