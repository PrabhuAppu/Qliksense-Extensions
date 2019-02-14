function DrawFastChange(csv){
	var csvFchangeData = csv;
	//console.log("hc",csvFchangeData);
	//console.log("passed",dataf);
	
//var cc = ["a","b","c"];


	$('#fchange').empty();
var monthArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var divName = "fchange";
var formatPercent = d3.format("0");
/*var svgContainer = d3.select("#"+divName).append("svg")
                                     .attr("width", 100)
                                     .attr("height", 400);*/





	var currChart=6;
	var duration = 0;
	
	$(".next").click(ShowNext);
	$(".previous").click(ShowPrev);
	$(".previous").addClass("disabled");
	
	function choose(){
		ShowNext();
	}
	
	function Show(){}
	
	function ShowNext(selection){
		currChart++;
		$(".previous").removeClass("disabled");
		if(currChart==7){
			stackedBar();
			$('.chartname').html("Stacked Bar");
		}else if(currChart==8){
			transposeBar();
			$('.chartname').html("Transposed Bar");
		}else if(currChart==9){
			donut();
			$('.chartname').html("Donut Chart");
		}else if(currChart==10){
			currChart=6;
			donutExplode();
			$('.chartname').html("Grouped Bar");
			$(".previous").addClass("disabled");
		}
		//$('.Nextval').html(currChart);
	}
	
	function ShowPrev(selection){
		if(currChart==7){
			backtoGroup();
			$(".previous").addClass("disabled");
			$('.chartname').html("Grouped Bar");
		}else if(currChart==8){
			backtostack();
			$('.chartname').html("Stacked Bar");
		}else if(currChart==9){
			backtotransposebar();
			$('.chartname').html("Transposed Bar");
		}
		currChart = currChart==6?currChart:currChart-1;
		//$('.Nextval').html(currChart);
	}
  	
		var m = [20, 50, 30, 20],
    w = parseInt($('#fchange').width()) - m[1] - m[3],
    h = parseInt($('#fchange').height()) - m[0] - m[2];
	//w = 960 - m[1] - m[3],
    //h = 500 - m[0] - m[2];

var x,
    y,
    duration = 1500,
    delay = 500;

/*var color = d3.scale.category10();
console.log("colors", color);
var color = colorbrewer.Dark2[8];//d3.scale.category10();
console.log("colors", color);

 var color = d3.scale.ordinal()
      .range(globalcolor);*/

var svg2 = d3.select("#"+divName).append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2]);
	
  var svg = svg2.append("g")
    .attr("transform", "translate(" + (m[3]+20) + "," + m[0] + ")");

	//Create the Scale we will use for the Axis
var axisScale = d3.scale.linear()
                         .domain([90, 0])
                         .range([0, 350]);

/*//Create the Axis
var xAxis = d3.svg.axis()
                   .scale(axisScale)
				   .orient("left");

var x_y = d3.scale.ordinal()
		.rangeRoundBands([0, w], .1, 1);
		
var xAxis_y = d3.svg.axis()
		.scale(x)
		.orient("bottom");

				   
//Create an SVG group Element for the Axis elements and call the xAxis function
var xAxisGroup = svg2.append("g");
xAxisGroup.attr("transform", "translate(" + (m[3]+15) + "," + (m[0]-10) + ")");
xAxisGroup.call(xAxis);
*/	
var stocks,
    symbols;

// A line generator, for the dark stroke.
var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

// A line generator, for the dark stroke.
var axis = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(h);

// A area generator, for the dark stroke.
var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y1(function(d) { return y(d.price); });


var csvData = [];
for(var i=0;i<csvFchangeData.length;i++)
{	//alert(csvFchangeData[i]);
	//var data = csvFchangeData[i].split("|");
	csvData.push({
		symbol: csvFchangeData[i][0],
		date: csvFchangeData[i][1],
		price: (csvFchangeData[i][2])
	});
}
//alert(JSON.stringify(csvData));

	
//d3.csv(template_path+"stocks.csv", function(data) {
  //var parse = d3.time.format("%b %Y").parse;
  var parse = d3.time.format("%b %Y").parse;

//alert(JSON.stringify(data));
  // Nest stock values by symbol.
  symbols = d3.nest()
      .key(function(d) { return d.symbol; })
      //.entries(stocks = data);
	  .entries(stocks = csvData);
	  
	  
//alert(JSON.stringify(symbol));
  // Parse dates and numbers. We assume values are sorted by date.
  // Also compute the maximum price per symbol, needed for the y-domain.
  var cnt=0;
  symbols.forEach(function(s) {
	
    s.values.forEach(function(d) { d.date = parse(d.date); d.price = +d.price; 
	cnt++;
	});
    s.maxPrice = d3.max(s.values, function(d) { return d.price; });
    s.sumPrice = d3.sum(s.values, function(d) { return d.price; });
	
  });
  
  ////alert(cnt);
  
  

  // Sort by maximum price, descending.
  symbols.sort(function(a, b) { return b.maxPrice - a.maxPrice; });

  var g = svg.selectAll("g")
      .data(symbols)
    .enter().append("g")
      .attr("class", "symbol");

lines();
horizons();
areas();
stackedArea();
streamgraph();
overlappingArea();
groupedBar();
  

function lines() {
 
  //currChart=1;
  x = d3.time.scale().range([0, w - 100]);
  y = d3.scale.linear().range([h / 4 - 20, 0]);

//alert(y);
  // Compute the minimum and maximum date across symbols.
  x.domain([
    //d3.min(symbols, function(d) { return "Jan"; }),
    //d3.max(symbols, function(d) { return "Feb"; })
	
	d3.min(symbols, function(d) { return d.values[0].date; }),
    d3.max(symbols, function(d) { return d.values[d.values.length - 1].date; })
  ]);
  
  
  
  var g = svg.selectAll(".symbol")
      //.attr("transform", function(d, i) { return "translate(0," + (i * h / 4+10) + ")"; });

  g.each(function(d) {
    var e = d3.select(this);

    /*e.append("path")
        .attr("class", "line");

    e.append("circle")
        .attr("r", 5)
        .style("fill", function(d) { return color(d.key); })
        .style("stroke", "#000")
        .style("stroke-width", "2px");*/

    e.append("text")
        .attr("x", 12)
        .attr("dy", ".31em")
        .text(d.key);
  });

  /*function draw(k) {
    g.each(function(d) {
      var e = d3.select(this);
      y.domain([0, d.maxPrice]);

      e.select("path")
          .attr("d", function(d) { 
		  
		  return line(d.values.slice(0, k + 1)); });

      e.selectAll("circle, text")
          .data(function(d) { return [d.values[k], d.values[k]]; })
          .attr("transform", function(d) { 
	  //alert("translate(" + x(d.date) + "," + y(d.price) + ")");
		  return "translate(" + x(d.date) + "," + y(d.price) + ")"; 
		  
		  });
    });
  }

 var k = 1, n = symbols[0].values.length;
//alert(line(d.values.slice(0, k + 1)));
  
  //alert(n);
  d3.timer(function() {
    draw(k);
    if ((k += 2) >= n - 1) {
      draw(n - 1);
      //setTimeout(horizons, 500);
      return true;
    }
  });
//setTimeout(stackedArea, 500);// + delay);
d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
  d3.select(".Next_text2").on("mousedown",Show);*/
}

function horizons() {
//currChart=2;
  /*svg.insert("defs", ".symbol")
    .append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", w)
      .attr("height", h / 4 - 20);*/

 /* var color = d3.scale.ordinal()
      .range(["#c6dbef", "#9ecae1", "#6baed6"]);*/

  var g = svg.selectAll(".symbol")
      .attr("clip-path", "url(#clip)");

  area
      .y0(h / 4 - 20);

  /*g.select("circle").transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + (w - 60) + "," + (-h / 4) + ")"; })
      .remove();*/

  g.select("text").transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + (w - 100) + "," + (h / 4 - 20) + ")"; })
      .attr("dy", "0em");

  /*g.each(function(d) {
    y.domain([0, d.maxPrice]);

    d3.select(this).selectAll(".area")
        .data(d3.range(3))
      .enter().insert("path", ".line")
        .attr("class", "area")
        .attr("transform", function(d) { return "translate(0," + (d * (h / 4 - 20)) + ")"; })
        .attr("d", area(d.values))
        .style("fill", function(d, i) { return color(i); })
        .style("fill-opacity", 1e-6);

    y.domain([0, d.maxPrice / 3]);

    d3.select(this).selectAll(".line").transition()
        .duration(duration)
        .attr("d", line(d.values))
        .style("stroke-opacity", 1e-6);

    d3.select(this).selectAll(".area").transition()
        .duration(duration)
        .style("fill-opacity", 1)
        .attr("d", area(d.values))
        .each("end", function() { d3.select(this).style("fill-opacity", null); });
  });

 // setTimeout(areas, duration + delay);
 d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
  d3.select(".Next_text2").on("mousedown",Show);*/
}

function areas() {

//currChart=3;

  var g = svg.selectAll(".symbol");

  axis
      .y(h / 4 - 21);

  g.select(".line")
      .attr("d", function(d) { return axis(d.values); });

  /*g.each(function(d) {
    y.domain([0, d.maxPrice]);

 /*   d3.select(this).select(".line").transition()
        .duration(duration)
        .style("stroke-opacity", 1)
        .each("end", function() { d3.select(this).style("stroke-opacity", null); });
		//.attr("y", parseInt(_this.GetHeight())-100);

    d3.select(this).selectAll(".area")
        .filter(function(d, i) { return i; })
      .transition()
        .duration(duration)
        .style("fill-opacity", 1e-6)
        .attr("d", area(d.values))
        .remove();

    d3.select(this).selectAll(".area")
        .filter(function(d, i) { return !i; })
      .transition()
        .duration(duration)
        .style("fill", color(d.key))
        .attr("d", area(d.values));
  });

  svg.select("defs").transition()
      .duration(duration)
      .remove();

  g.transition()
      .duration(duration)
      .each("end", function() { d3.select(this).attr("clip-path", null); });

  //setTimeout(stackedArea, duration + delay);
  d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
  d3.select(".Next_text2").on("mousedown",Show);*/
}

function stackedArea() {
//currChart=4;
  var stack = d3.layout.stack()
      .values(function(d) { return d.values; })
      .x(function(d) { return d.date; })
      .y(function(d) { return d.price; })
      .out(function(d, y0, y) { d.price0 = y0; })
      .order("reverse");

  stack(symbols);

  y
      .domain([0, d3.max(symbols[0].values.map(function(d) { return d.price + d.price0; }))])
      .range([h, 0]);

  line
      .y(function(d) { return y(d.price0); });

  area
      .y0(function(d) { return y(d.price0); })
      .y1(function(d) { return y(d.price0 + d.price); });

  /*var t = svg.selectAll(".symbol").transition()
      .duration(duration)
      .attr("transform", "translate(0,0)")
      .each("end", function() { d3.select(this).attr("transform", null); });

  t.select("path.area")
      .attr("d", function(d) { return area(d.values); });

  t.select("path.line")
      .style("stroke-opacity", function(d, i) { return i < 3 ? 1e-6 : 1; })
      .attr("d", function(d) { return line(d.values); });

  t.select("text")
      .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 100) + "," + y(d.price / 2 + d.price0) + ")"; });

  //setTimeout(streamgraph, duration + delay);
  d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
  d3.select(".Next_text2").on("mousedown",Show);*/
}

function streamgraph() {
//currChart=5;
  var stack = d3.layout.stack()
      .values(function(d) { return d.values; })
      .x(function(d) { return d.date; })
      .y(function(d) { return d.price; })
      .out(function(d, y0, y) { d.price0 = y0; })
      .order("reverse")
      .offset("wiggle");

  stack(symbols);

  line
      .y(function(d) { return y(d.price0); });

  /*var t = svg.selectAll(".symbol").transition()
      .duration(duration);

  t.select("path.area")
      .attr("d", function(d) { return area(d.values); });

  t.select("path.line")
      .style("stroke-opacity", 1e-6)
      .attr("d", function(d) { return line(d.values); });

  t.select("text")
      .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 100) + "," + y(d.price / 2 + d.price0) + ")"; });

  //setTimeout(overlappingArea, duration + delay);
  d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
  d3.select(".Next_text2").on("mousedown",Show);*/
}

function overlappingArea() {
//currChart=6;

  var g = svg.selectAll(".symbol");

  line
      .y(function(d) { return y(d.price0 + d.price); });

  g.select(".line")
      .attr("d", function(d) { return line(d.values); });

  y
      .domain([0, d3.max(symbols.map(function(d) { return d.maxPrice; }))])
      .range([h, 0]);

  area
      .y0(h)
      .y1(function(d) { return y(d.price); });

  line
      .y(function(d) { return y(d.price); });

  var t = g.transition()
      .duration(duration);

  /*t.select(".line")
      .style("stroke-opacity", 1)
      .attr("d", function(d) { return line(d.values); });

  t.select(".area")
      .style("fill-opacity", .5)
      .attr("d", function(d) { return area(d.values); });*/

  t.select("text")
      .attr("dy", ".31em")
      .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price) + ")"; });

  /*svg.append("line")
      .attr("class", "line")
      .attr("x1", 0)
      .attr("x2", w - 60)
      .attr("y1", h)
      .attr("y2", h)
      .style("stroke-opacity", 1e-6)
    .transition()
      .duration(duration)
      .style("stroke-opacity", 1);

  //setTimeout(groupedBar, duration + delay);
  d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
  d3.select(".Next_text2").on("mousedown",Show);*/
}

function groupedBar() {
//alert(monthArr[2]);

  x = d3.scale.ordinal()
      .domain(symbols[0].values.map(function(d) { return monthArr[(d.date).getMonth()]+"-"+(d.date).getFullYear(); }))
      .rangeBands([0, w - 60], .1);

  var x1 = d3.scale.ordinal()
      .domain(symbols.map(function(d) { return d.key; }))
      .rangeBands([0, x.rangeBand()]);

	  var xAxis_bot = d3.svg.axis()
		.scale(x)
		.orient("bottom");

    svg.append("g")
		  .attr("class", "x axis xAxis")
		  .attr("transform", "translate(0," + h + ")")
		  .call(xAxis_bot);
	
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(formatPercent);
	
	svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Hrs")
		  ;
		  
d3.select('.x').selectAll('.tick').select('text').attr("transform","rotate(0)");
	  
  var g = svg.selectAll(".symbol");

  /*var t = g.transition()
      .duration(duration);

  t.select(".line")
      .style("stroke-opacity", 1e-6)
      .remove();

  t.select(".area")
      .style("fill-opacity", 1e-6)
      .remove();*/
//alert(JSON.stringify(g)); 
//alert(y(10));
  g.each(function(p, j) {
 //alert(colors(p.key));
	//alert(JSON.stringify(d3.select(this).data()));
    d3.select(this).selectAll("rect")
        .data(function(d) { return d.values; })
      .enter().append("rect")
        .attr("x", function(d) { return x(monthArr[(d.date).getMonth()]+"-"+(d.date).getFullYear()) + x1(p.key); })
        .attr("y", function(d) {  return y(d.price); })
        .attr("width", x1.rangeBand())
        .attr("height", function(d) { return h - y(d.price); })
        .style("fill", colors(p.key))
        .style("fill-opacity", 1e-6)
      .transition()
        .duration(duration)
        .style("fill-opacity", 1);
  });

 // setTimeout(stackedBar, duration + delay);
 d3.selectAll(".symbol").selectAll('rect').on("mouseover",showtooltip).on("mouseleave",hidetooltip);
 d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
  d3.select(".Next_text2").on("mousedown",Show);
}

function stackedBar() {

  x.rangeRoundBands([0, w - 60], .1);

  var stack = d3.layout.stack()
      .values(function(d) { return d.values; })
      .x(function(d) { return d.date; })
      .y(function(d) { return d.price; })
      .out(function(d, y0, y) { d.price0 = y0; })
      .order("reverse");

  var g = svg.selectAll(".symbol");

  stack(symbols);

  y
      .domain([0, d3.max(symbols[0].values.map(function(d) { return d.price + d.price0; }))])
      .range([h, 0]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(formatPercent);
	
	/*svg.append("g")
		  .attr("class", "y axis")*/
		  d3.select('g .y.axis')
		  .transition()
		  .duration(duration)
		  .call(yAxis);
		/*.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Hrs")
		  ;*/
	  
  var t = g.transition()
      .duration(duration / 2);

  t.select("text")
      .delay(symbols[0].values.length * 10)
	  .attr("x","12")
	  .attr("dy","0.71em")
      .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")"; });

  t.selectAll("rect")
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.price0 + d.price); })
      .attr("height", function(d) { return h - y(d.price); })
      .each("end", function() {
        d3.select(this)
            .style("stroke", "#fff")
            .style("stroke-opacity", 1e-6)
          .transition()
            .duration(duration / 2)
            .attr("x", function(d) {  return x(monthArr[(d.date).getMonth()]+"-"+(d.date).getFullYear()); })
            .attr("width", x.rangeBand())
            .style("stroke-opacity", 1);
      });

  //setTimeout(transposeBar, duration + symbols[0].values.length * 10 + delay);
  d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
 
 d3.select(".Next_text2").on("mousedown",Show);
 
 //groupedBar();
 
 
}

function backtoGroup(){
	//start
	y
      .domain([0, d3.max(symbols.map(function(d) { return d.maxPrice; }))])
      .range([h, 0]);
	  
   x = d3.scale.ordinal()
      .domain(symbols[0].values.map(function(d) { return monthArr[(d.date).getMonth()]+"-"+(d.date).getFullYear(); }))
      .rangeBands([0, w - 60], .1);

  var x1 = d3.scale.ordinal()
      .domain(symbols.map(function(d) { return d.key; }))
      .rangeBands([0, x.rangeBand()]);

	/*  var xAxis_bot = d3.svg.axis()
		.scale(x)
		.orient("bottom");

    svg.append("g")
		  .attr("class", "x axis xAxis")
		  .attr("transform", "translate(0," + h + ")")
		  .call(xAxis_bot);*/
	
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(formatPercent);
	
	svg.select("g .y.axis").transition().duration(duration)
		  .call(yAxis)
		/*.append("text")
		 .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Hrs")*/
		  ;
		  
d3.select('.x').selectAll('.tick').select('text').attr("transform","rotate(0)");
	  
  var g = svg.selectAll(".symbol");

  g.select("text").transition().duration(duration)
      //.attr("dy", ".31em")
	  //.attr("x","25")
      .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w-60) + "," + y(d.price) + ")"; });
  
  /*var t = g.transition()
      .duration(duration);

  t.select(".line")
      .style("stroke-opacity", 1e-6)
      .remove();

  t.select(".area")
      .style("fill-opacity", 1e-6)
      .remove();*/
//alert(JSON.stringify(g)); 
//alert(y(10));
  g.each(function(p, j) {
	//alert(JSON.stringify(d3.select(this).data()));
    d3.select(this).selectAll("rect")
	.transition()
        .duration(duration/2)
        //.data(function(d) { return d.values; })
      //.enter().append("rect")
	  .attr("width", x1.rangeBand())
	  .attr("x", function(d) { return x(monthArr[(d.date).getMonth()]+"-"+(d.date).getFullYear()) + x1(p.key); })
		.each("end", function() {
			d3.select(this)
			 .transition()
            .duration(duration / 2)
			.attr("y", function(d) {  return y(d.price); })
			.attr("height", function(d) { return h - y(d.price); })
			.style("fill", colors(p.key))
			.style("fill-opacity", 1e-6)
			.style("fill-opacity", 1);
		});
        
  });
 //end
}

function backtostack(){
	
	//change x axis
	
	x = d3.scale.ordinal()
      .domain(symbols[0].values.map(function(d) { return monthArr[(d.date).getMonth()]+"-"+(d.date).getFullYear(); }))
      .rangeBands([0, w - 60], .1);

  var x1 = d3.scale.ordinal()
      .domain(symbols.map(function(d) { return d.key; }))
      .rangeBands([0, x.rangeBand()]);

	  var xAxis_bot = d3.svg.axis()
		.scale(x)
		.orient("bottom");

    svg.append("g")
		  .attr("class", "x axis xAxis")
		  .attr("transform", "translate(0," + h + ")")
		  .call(xAxis_bot);
		  
	//Change x axis
	
	x.rangeRoundBands([0, w - 60], .1);

  var stack = d3.layout.stack()
      .values(function(d) { return d.values; })
      .x(function(d) { return d.date; })
      .y(function(d) { return d.price; })
      .out(function(d, y0, y) { d.price0 = y0; })
      .order("reverse");

  var g = svg.selectAll(".symbol");

  stack(symbols);

  y
      .domain([0, d3.max(symbols[0].values.map(function(d) { return d.price + d.price0; }))])
      .range([h, 0]);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(formatPercent);
	
	/*svg.append("g")
		  .attr("class", "y axis")*/
		  d3.select('g .y.axis')
		  .transition()
		  .duration(duration)
		  .call(yAxis);
		/*.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Hrs")
		  ;*/
	  
  var t = g.transition()
      .duration(duration / 2);

  t.select("text")
      .delay(symbols[0].values.length * 10)
	  //.attr("x","12")
	  //.attr("dy","0")
	  .style("text-anchor", "start")
      .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")"; });

  t.selectAll("rect")
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.price0 + d.price); })
      .attr("height", function(d) { return h - y(d.price); })
      .each("end", function() {
        d3.select(this)
            .style("stroke", "#fff")
            .style("stroke-opacity", 1e-6)
          .transition()
            .duration(duration / 2)
            .attr("x", function(d) {  return x(monthArr[(d.date).getMonth()]+"-"+(d.date).getFullYear()); })
            .attr("width", x.rangeBand())
            .style("stroke-opacity", 1);
      });

  //setTimeout(transposeBar, duration + symbols[0].values.length * 10 + delay);
  d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
 
 d3.select(".Next_text2").on("mousedown",Show);
}

function transposeBar() {
	
	d3.select('.xAxis').remove();
	
  x
      .domain(symbols.map(function(d) { return d.key; }))
      .rangeRoundBands([0, w], .2);

  y
      .domain([0, d3.max(symbols.map(function(d) { return d3.sum(d.values.map(function(d) { return d.price; })); }))]);

	  var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(formatPercent);
	
	/*svg.append("g")
		  .attr("class", "y axis")*/
		  d3.select('g .y.axis')
		  .transition()
		  .duration(duration)
		  .call(yAxis);
		/*.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Hrs")
		  ;*/
	  
  var stack = d3.layout.stack()
      .x(function(d, i) { return i; })
      .y(function(d) { return d.price; })
      .out(function(d, y0, y) { d.price0 = y0; });
	  
  stack(d3.zip.apply(null, symbols.map(function(d) { return d.values; }))); // transpose!

  var g = svg.selectAll(".symbol");

  var t = g.transition()
      .duration(duration / 2);

  t.selectAll("rect")
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.price0 + d.price); })
      .attr("height", function(d) { return h - y(d.price) + 1; })
      .attr("x", function(d) { return x(d.symbol); })
      .attr("width", x.rangeBand())
      .style("stroke-opacity", 1e-6);

  t.select("text")
      .attr("x", 0)
      .attr("transform", function(d) { return "translate(" + (x(d.key) + x.rangeBand() / 2) + "," + (h+10) + ")"; })
      .attr("dy", "0.31em")
	  .style("text-anchor", "middle")
      .each("end", function() { d3.select(this).attr("x", null).attr("text-anchor", "middle"); });

  svg.select("line").transition()
      .duration(duration)
      .attr("x2", w)
	  .attr("y1",h-10)
	  .attr("y2",h-10);
	  //.attr("dy","-1em");

  //setTimeout(donut,  duration / 2 + symbols[0].values.length * 10 + delay);
  
  d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
  d3.select(".Next_text2").on("mousedown",Show);
}

function donut() {
  var g = svg.selectAll(".symbol");

  g.selectAll("rect").remove();

  var pie = d3.layout.pie()
      .value(function(d) { return d.sumPrice; });

  var arc = d3.svg.arc();
var pp=0;
  //alert(JSON.stringify(pie(symbols)[0]));
  g.append("path")
      .style("fill", function(d) { return colors(d.key); })
      .data(function() { return pie(symbols); })
	  .attr('class','arcpath')
      .transition()
      .duration(duration)
      .tween("arc", arcTween);

  g.select("text").transition()
      .duration(duration)
      .attr("dy", ".31em");

  svg.select("line").transition()
      .duration(duration)
      .attr("y1", 2 * h)
      .attr("y2", 2 * h)
      .remove();

  function arcTween(d) {
    var path = d3.select(this),
        text = d3.select(this.parentNode.appendChild(this.previousSibling)),
        x0 = x(d.data.key),
        y0 = h - y(d.data.sumPrice);

    return function(t) {
		
      var r = h / 2 / Math.min(1, t + 1e-3),
          a = Math.cos(t * Math.PI / 2),
          xx = (-r + (a) * (x0 + x.rangeBand()) + (1 - a) * (w + h) / 2),
          yy = ((a) * h + (1 - a) * h / 2),
		  //alert(a * (Math.PI / 2 - y0 / r) + (1 - a) * d.startAngle);
          f = {
            innerRadius: r - x.rangeBand() / (2 - a),
            outerRadius: r,
            startAngle: a * (Math.PI / 2 - y0 / r) + (1 - a) * d.startAngle,
            endAngle:  a * (Math.PI / 2) + (1 - a) * d.endAngle
          };
		//alert(a);// * (Math.PI / 2 - y0 / r) + (1 - a) * d.startAngle);
       path.attr("transform", "translate(" + xx + "," + yy + ")");
      path.attr("d", arc(f));
	  text
	  .attr("transform", "translate(" + arc.centroid(f) + ")translate(" + xx + "," + yy + ")rotate(" + ((f.startAngle + f.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")")
	  .style("text-anchor", "middle");
    };
  }
  
  
  
  d3.selectAll(".symbol").selectAll('path').on("mouseover",showtooltip).on("mouseleave",hidetooltip);
//  setTimeout(donutExplode, duration + delay);
d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
  d3.select(".Next_text2").on("mousedown",Show);
}

function backtotransposebar(){
	d3.selectAll('.arcpath').remove();
	d3.select('.xAxis').remove();
	
  x
      .domain(symbols.map(function(d) { return d.key; }))
      .rangeRoundBands([0, w], .2);

  y
      .domain([0, d3.max(symbols.map(function(d) { return d3.sum(d.values.map(function(d) { return d.price; })); }))]);

	  var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(formatPercent);
	
	/*svg.append("g")
		  .attr("class", "y axis")*/
		  d3.select('g .y.axis')
		  .transition()
		  .duration(duration)
		  .call(yAxis);
		/*.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Hrs")
		  ;*/
	  
  var stack = d3.layout.stack()
      .x(function(d, i) { return i; })
      .y(function(d) { return d.price; })
      .out(function(d, y0, y) { d.price0 = y0; });
	  
  stack(d3.zip.apply(null, symbols.map(function(d) { return d.values; }))); // transpose!

  var g = svg.selectAll(".symbol");
g.each(function(p, j) {
	//alert(JSON.stringify(d3.select(this).data()));
    d3.select(this).selectAll("rect")
        .data(function(d) { return d.values; })
      .enter().append("rect")
        //.attr("x", function(d) { return x(monthArr[(d.date).getMonth()]+"-"+(d.date).getFullYear()) + x1(p.key); })
        //.attr("y", function(d) {  return y(d.price); })
        //.attr("width", x1.rangeBand())
        //.attr("height", function(d) { return h - y(d.price); })
        .style("fill", colors(p.key))
        //.style("fill-opacity", 1e-6)
      //.transition()
        //.duration(duration)
        .style("fill-opacity", 1);
  });
  var t1 = g.transition()
      .duration(duration);

  var t = g.transition();
	  
  t1.selectAll("rect")
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.price0 + d.price); })
      .attr("height", function(d) { return h - y(d.price) + 1; })
      .attr("x", function(d) { return x(d.symbol); })
      .attr("width", x.rangeBand())
      .style("stroke-opacity", 1e-6);

  t.select("text")
      .attr("x", 0)
      .attr("transform", function(d) { return "translate(" + (x(d.key) + x.rangeBand() / 2) + "," + (h+10) + ")"; })
      .attr("dy", "0.31em")
      .each("end", function() { d3.select(this).attr("x", null).attr("text-anchor", "middle"); });

  svg.select("line").transition()
      .duration(duration)
      .attr("x2", w)
	  .attr("y1",h-10)
	  .attr("y2",h-10);
	  //.attr("dy","-1em");

  //setTimeout(donut,  duration / 2 + symbols[0].values.length * 10 + delay);
  d3.selectAll(".symbol").selectAll('rect').on("mouseover",showtooltip).on("mouseleave",hidetooltip);
  d3.select(".Next").on("mousedown",Show); 
  d3.select(".Next_text").on("mousedown",Show); 
  d3.select(".Next_text2").on("mousedown",Show);
}

d3.select('.change').on("click", backtotransposebar);

function changep(){
	d3.selectAll('.arcpath').transition().duration(duration).attr("transform","translate(-169880.7985187573,340)").attr("d","M169994.22016330773,-339.999773319206A169994.5601740744,169994.5601740744 0 0,1 169994.5601740744,7.549274990651362e-11L169900.5601740744,7.545100552078772e-11A169900.5601740744,169900.5601740744 0 0,0 169900.2203513197,-339.81176742855115Z");
}

function donutExplode() {
  var r0a = h / 2 - x.rangeBand() / 2,
      r1a = h / 2,
      r0b = 2 * h - x.rangeBand() / 2,
      r1b = 2 * h,
      arc = d3.svg.arc();

  svg.selectAll(".symbol path")
      .each(transitionExplode);

  function transitionExplode(d, i) {
    d.innerRadius = r0a;
    d.outerRadius = r1a;
    d3.select(this).transition()
        .duration(duration / 2)
        .tween("arc", tweenArc({
          innerRadius: r0b,
          outerRadius: r1b
        }));
  }

  function tweenArc(b) {
    return function(a) {
      var path = d3.select(this),
          text = d3.select(this.nextSibling),
          i = d3.interpolate(a, b);
      for (var key in b) a[key] = b[key]; // update data
      return function(t) {
        var a = i(t);
        path.attr("d", arc(a));
        text.attr("transform", "translate(" + arc.centroid(a) + ")translate(" + w / 2 + "," + h / 2 +")rotate(" + ((a.startAngle + a.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")");
      };
    }
  }

  setTimeout(function() {
    svg.selectAll("*").remove();
    svg.selectAll("g").data(symbols).enter().append("g").attr("class", "symbol");
    lines();
	horizons();
	areas();
	stackedArea();
	streamgraph();
	overlappingArea();
	groupedBar();
  }, duration);
}




function showtooltip(d){
		//alert(JSON.stringify(d.letter));
		//console.log(d.data.key);
		var item = this;
		if($('.chartname').html()==="Transposed Bar"){
			var acc = 0;
			var all = [];
			for(var i=0;i<csvData.length;i++){
				if(csvData[i].symbol==d.symbol){
					acc = acc + parseInt(csvData[i].price);
				}
			}
			d3.selectAll('.symbol').each(function(e){
				d3.selectAll('rect').each(function(f){
					if(f.symbol==d.symbol){
						item = this;
					}
				})
			});
			var html =	d.symbol + " : " + acc;
			//alert(html);
		}else if($('.chartname').html()==="Donut Chart"){
			var html =	d.data.key + " : " + d.value;
		}else{
			var html =	d.symbol + " : " + d.price;
		}
		
		$('.popover').each(function() {
            $(this).remove();
          }); 
		 $(item).popover({
			placement: 'top',
			container: '#fchange',
			trigger: 'manual',
			html : true,
			title : "Leave Days",
			content: function() { 
				
			  return html;//"Date : "+d.letter+"<br> Hours : "+d.frequency +" Hrs<br>Working Hours : "+(d.office_hrs+d.work_from_home)+"Hrs<br>Break Hrs : "+d.break_time+" Hrs"; 
			}
		  });
		  $(item).popover('show');
}


function hidetooltip(d){
	$('.popover').each(function() {
		$(this).remove();
	  }); 
}

	
}




var dataf = [["Comp Off","Mar 2015","6"],
["Comp Off","Apr 2015","4"],
["Comp Off","May 2015","7"],
["Comp Off","Jun 2015","7"],
["LOP","Mar 2015","3"],
["LOP","Apr 2015","1"],
["LOP","May 2015","8"],
["LOP","Jun 2015","2"],
["Sick Leave","Mar 2015","6"],
["Sick Leave","Apr 2015","9"],
["Sick Leave","May 2015","1"],
["Sick Leave","Jun 2015","3"],
["Vocation","Mar 2015","2"],
["Vocation","Apr 2015","3"],
["Vocation","May 2015","11"],
["Vocation","Jun 2015","10"]
];/*[
["MSFT","Jan 2000","39.81"],
["MSFT","Feb 2000","36.35"],
["MSFT","Mar 2000","43.22"],
["MSFT","Apr 2000","28.37"],
["MSFT","May 2000","25.45"],
["MSFT","Jun 2000","32.54"],
["MSFT","Jul 2000","28.4"],
["MSFT","Aug 2000","28.4"],
["MSFT","Sep 2000","24.53"],
["MSFT","Oct 2000","28.02"],
["MSFT","Nov 2000","23.34"],
["MSFT","Dec 2000","17.65"],
["MSFT","Jan 2001","24.84"],
["MSFT","Feb 2001","24"],
["MSFT","Mar 2001","22.25"],
["MSFT","Apr 2001","27.56"],
["MSFT","May 2001","28.14"],
["MSFT","Jun 2001","29.7"],
["MSFT","Jul 2001","26.93"],
["MSFT","Aug 2001","23.21"],
["MSFT","Sep 2001","20.82"],
["MSFT","Oct 2001","23.65"],
["MSFT","Nov 2001","26.12"],
["MSFT","Dec 2001","26.95"],
["MSFT","Jan 2002","25.92"],
["MSFT","Feb 2002","23.73"],
["MSFT","Mar 2002","24.53"],
["MSFT","Apr 2002","21.26"],
["MSFT","May 2002","20.71"],
["MSFT","Jun 2002","22.25"],
["MSFT","Jul 2002","19.52"],
["MSFT","Aug 2002","19.97"],
["MSFT","Sep 2002","17.79"],
["MSFT","Oct 2002","21.75"],
["MSFT","Nov 2002","23.46"],
["MSFT","Dec 2002","21.03"],
["MSFT","Jan 2003","19.31"],
["MSFT","Feb 2003","19.34"],
["MSFT","Mar 2003","19.76"],
["MSFT","Apr 2003","20.87"],
["MSFT","May 2003","20.09"],
["MSFT","Jun 2003","20.93"],
["MSFT","Jul 2003","21.56"],
["MSFT","Aug 2003","21.65"],
["MSFT","Sep 2003","22.69"],
["MSFT","Oct 2003","21.45"],
["MSFT","Nov 2003","21.1"],
["MSFT","Dec 2003","22.46"],
["MSFT","Jan 2004","22.69"],
["MSFT","Feb 2004","21.77"],
["MSFT","Mar 2004","20.46"],
["MSFT","Apr 2004","21.45"],
["MSFT","May 2004","21.53"],
["MSFT","Jun 2004","23.44"],
["MSFT","Jul 2004","23.38"],
["MSFT","Aug 2004","22.47"],
["MSFT","Sep 2004","22.76"],
["MSFT","Oct 2004","23.02"],
["MSFT","Nov 2004","24.6"],
["MSFT","Dec 2004","24.52"],
["MSFT","Jan 2005","24.11"],
["MSFT","Feb 2005","23.15"],
["MSFT","Mar 2005","22.24"],
["MSFT","Apr 2005","23.28"],
["MSFT","May 2005","23.82"],
["MSFT","Jun 2005","22.93"],
["MSFT","Jul 2005","23.64"],
["MSFT","Aug 2005","25.35"],
["MSFT","Sep 2005","23.83"],
["MSFT","Oct 2005","23.8"],
["MSFT","Nov 2005","25.71"],
["MSFT","Dec 2005","24.29"],
["MSFT","Jan 2006","26.14"],
["MSFT","Feb 2006","25.04"],
["MSFT","Mar 2006","25.36"],
["MSFT","Apr 2006","22.5"],
["MSFT","May 2006","21.19"],
["MSFT","Jun 2006","21.8"],
["MSFT","Jul 2006","22.51"],
["MSFT","Aug 2006","24.13"],
["MSFT","Sep 2006","25.68"],
["MSFT","Oct 2006","26.96"],
["MSFT","Nov 2006","27.66"],
["MSFT","Dec 2006","28.13"],
["MSFT","Jan 2007","29.07"],
["MSFT","Feb 2007","26.63"],
["MSFT","Mar 2007","26.35"],
["MSFT","Apr 2007","28.3"],
["MSFT","May 2007","29.11"],
["MSFT","Jun 2007","27.95"],
["MSFT","Jul 2007","27.5"],
["MSFT","Aug 2007","27.34"],
["MSFT","Sep 2007","28.04"],
["MSFT","Oct 2007","35.03"],
["MSFT","Nov 2007","32.09"],
["MSFT","Dec 2007","34"],
["MSFT","Jan 2008","31.13"],
["MSFT","Feb 2008","26.07"],
["MSFT","Mar 2008","27.21"],
["MSFT","Apr 2008","27.34"],
["MSFT","May 2008","27.25"],
["MSFT","Jun 2008","26.47"],
["MSFT","Jul 2008","24.75"],
["MSFT","Aug 2008","26.36"],
["MSFT","Sep 2008","25.78"],
["MSFT","Oct 2008","21.57"],
["MSFT","Nov 2008","19.66"],
["MSFT","Dec 2008","18.91"],
["MSFT","Jan 2009","16.63"],
["MSFT","Feb 2009","15.81"],
["MSFT","Mar 2009","17.99"],
["MSFT","Apr 2009","19.84"],
["MSFT","May 2009","20.59"],
["MSFT","Jun 2009","23.42"],
["MSFT","Jul 2009","23.18"],
["MSFT","Aug 2009","24.43"],
["MSFT","Sep 2009","25.49"],
["MSFT","Oct 2009","27.48"],
["MSFT","Nov 2009","29.27"],
["MSFT","Dec 2009","30.34"],
["MSFT","Jan 2010","28.05"],
["MSFT","Feb 2010","28.67"],
["MSFT","Mar 2010","28.8"],
["AMZN","Jan 2000","64.56"],
["AMZN","Feb 2000","68.87"],
["AMZN","Mar 2000","67"],
["AMZN","Apr 2000","55.19"],
["AMZN","May 2000","48.31"],
["AMZN","Jun 2000","36.31"],
["AMZN","Jul 2000","30.12"],
["AMZN","Aug 2000","41.5"],
["AMZN","Sep 2000","38.44"],
["AMZN","Oct 2000","36.62"],
["AMZN","Nov 2000","24.69"],
["AMZN","Dec 2000","15.56"],
["AMZN","Jan 2001","17.31"],
["AMZN","Feb 2001","10.19"],
["AMZN","Mar 2001","10.23"],
["AMZN","Apr 2001","15.78"],
["AMZN","May 2001","16.69"],
["AMZN","Jun 2001","14.15"],
["AMZN","Jul 2001","12.49"],
["AMZN","Aug 2001","8.94"],
["AMZN","Sep 2001","5.97"],
["AMZN","Oct 2001","6.98"],
["AMZN","Nov 2001","11.32"],
["AMZN","Dec 2001","10.82"],
["AMZN","Jan 2002","14.19"],
["AMZN","Feb 2002","14.1"],
["AMZN","Mar 2002","14.3"],
["AMZN","Apr 2002","16.69"],
["AMZN","May 2002","18.23"],
["AMZN","Jun 2002","16.25"],
["AMZN","Jul 2002","14.45"],
["AMZN","Aug 2002","14.94"],
["AMZN","Sep 2002","15.93"],
["AMZN","Oct 2002","19.36"],
["AMZN","Nov 2002","23.35"],
["AMZN","Dec 2002","18.89"],
["AMZN","Jan 2003","21.85"],
["AMZN","Feb 2003","22.01"],
["AMZN","Mar 2003","26.03"],
["AMZN","Apr 2003","28.69"],
["AMZN","May 2003","35.89"],
["AMZN","Jun 2003","36.32"],
["AMZN","Jul 2003","41.64"],
["AMZN","Aug 2003","46.32"],
["AMZN","Sep 2003","48.43"],
["AMZN","Oct 2003","54.43"],
["AMZN","Nov 2003","53.97"],
["AMZN","Dec 2003","52.62"],
["AMZN","Jan 2004","50.4"],
["AMZN","Feb 2004","43.01"],
["AMZN","Mar 2004","43.28"],
["AMZN","Apr 2004","43.6"],
["AMZN","May 2004","48.5"],
["AMZN","Jun 2004","54.4"],
["AMZN","Jul 2004","38.92"],
["AMZN","Aug 2004","38.14"],
["AMZN","Sep 2004","40.86"],
["AMZN","Oct 2004","34.13"],
["AMZN","Nov 2004","39.68"],
["AMZN","Dec 2004","44.29"],
["AMZN","Jan 2005","43.22"],
["AMZN","Feb 2005","35.18"],
["AMZN","Mar 2005","34.27"],
["AMZN","Apr 2005","32.36"],
["AMZN","May 2005","35.51"],
["AMZN","Jun 2005","33.09"],
["AMZN","Jul 2005","45.15"],
["AMZN","Aug 2005","42.7"],
["AMZN","Sep 2005","45.3"],
["AMZN","Oct 2005","39.86"],
["AMZN","Nov 2005","48.46"],
["AMZN","Dec 2005","47.15"],
["AMZN","Jan 2006","44.82"],
["AMZN","Feb 2006","37.44"],
["AMZN","Mar 2006","36.53"],
["AMZN","Apr 2006","35.21"],
["AMZN","May 2006","34.61"],
["AMZN","Jun 2006","38.68"],
["AMZN","Jul 2006","26.89"],
["AMZN","Aug 2006","30.83"],
["AMZN","Sep 2006","32.12"],
["AMZN","Oct 2006","38.09"],
["AMZN","Nov 2006","40.34"],
["AMZN","Dec 2006","39.46"],
["AMZN","Jan 2007","37.67"],
["AMZN","Feb 2007","39.14"],
["AMZN","Mar 2007","39.79"],
["AMZN","Apr 2007","61.33"],
["AMZN","May 2007","69.14"],
["AMZN","Jun 2007","68.41"],
["AMZN","Jul 2007","78.54"],
["AMZN","Aug 2007","79.91"],
["AMZN","Sep 2007","93.15"],
["AMZN","Oct 2007","89.15"],
["AMZN","Nov 2007","90.56"],
["AMZN","Dec 2007","92.64"],
["AMZN","Jan 2008","77.7"],
["AMZN","Feb 2008","64.47"],
["AMZN","Mar 2008","71.3"],
["AMZN","Apr 2008","78.63"],
["AMZN","May 2008","81.62"],
["AMZN","Jun 2008","73.33"],
["AMZN","Jul 2008","76.34"],
["AMZN","Aug 2008","80.81"],
["AMZN","Sep 2008","72.76"],
["AMZN","Oct 2008","57.24"],
["AMZN","Nov 2008","42.7"],
["AMZN","Dec 2008","51.28"],
["AMZN","Jan 2009","58.82"],
["AMZN","Feb 2009","64.79"],
["AMZN","Mar 2009","73.44"],
["AMZN","Apr 2009","80.52"],
["AMZN","May 2009","77.99"],
["AMZN","Jun 2009","83.66"],
["AMZN","Jul 2009","85.76"],
["AMZN","Aug 2009","81.19"],
["AMZN","Sep 2009","93.36"],
["AMZN","Oct 2009","118.81"],
["AMZN","Nov 2009","135.91"],
["AMZN","Dec 2009","134.52"],
["AMZN","Jan 2010","125.41"],
["AMZN","Feb 2010","118.4"],
["AMZN","Mar 2010","128.82"],
["IBM","Jan 2000","100.52"],
["IBM","Feb 2000","92.11"],
["IBM","Mar 2000","106.11"],
["IBM","Apr 2000","99.95"],
["IBM","May 2000","96.31"],
["IBM","Jun 2000","98.33"],
["IBM","Jul 2000","100.74"],
["IBM","Aug 2000","118.62"],
["IBM","Sep 2000","101.19"],
["IBM","Oct 2000","88.5"],
["IBM","Nov 2000","84.12"],
["IBM","Dec 2000","76.47"],
["IBM","Jan 2001","100.76"],
["IBM","Feb 2001","89.98"],
["IBM","Mar 2001","86.63"],
["IBM","Apr 2001","103.7"],
["IBM","May 2001","100.82"],
["IBM","Jun 2001","102.35"],
["IBM","Jul 2001","94.87"],
["IBM","Aug 2001","90.25"],
["IBM","Sep 2001","82.82"],
["IBM","Oct 2001","97.58"],
["IBM","Nov 2001","104.5"],
["IBM","Dec 2001","109.36"],
["IBM","Jan 2002","97.54"],
["IBM","Feb 2002","88.82"],
["IBM","Mar 2002","94.15"],
["IBM","Apr 2002","75.82"],
["IBM","May 2002","72.97"],
["IBM","Jun 2002","65.31"],
["IBM","Jul 2002","63.86"],
["IBM","Aug 2002","68.52"],
["IBM","Sep 2002","53.01"],
["IBM","Oct 2002","71.76"],
["IBM","Nov 2002","79.16"],
["IBM","Dec 2002","70.58"],
["IBM","Jan 2003","71.22"],
["IBM","Feb 2003","71.13"],
["IBM","Mar 2003","71.57"],
["IBM","Apr 2003","77.47"],
["IBM","May 2003","80.48"],
["IBM","Jun 2003","75.42"],
["IBM","Jul 2003","74.28"],
["IBM","Aug 2003","75.12"],
["IBM","Sep 2003","80.91"],
["IBM","Oct 2003","81.96"],
["IBM","Nov 2003","83.08"],
["IBM","Dec 2003","85.05"],
["IBM","Jan 2004","91.06"],
["IBM","Feb 2004","88.7"],
["IBM","Mar 2004","84.41"],
["IBM","Apr 2004","81.04"],
["IBM","May 2004","81.59"],
["IBM","Jun 2004","81.19"],
["IBM","Jul 2004","80.19"],
["IBM","Aug 2004","78.17"],
["IBM","Sep 2004","79.13"],
["IBM","Oct 2004","82.84"],
["IBM","Nov 2004","87.15"],
["IBM","Dec 2004","91.16"],
["IBM","Jan 2005","86.39"],
["IBM","Feb 2005","85.78"],
["IBM","Mar 2005","84.66"],
["IBM","Apr 2005","70.77"],
["IBM","May 2005","70.18"],
["IBM","Jun 2005","68.93"],
["IBM","Jul 2005","77.53"],
["IBM","Aug 2005","75.07"],
["IBM","Sep 2005","74.7"],
["IBM","Oct 2005","76.25"],
["IBM","Nov 2005","82.98"],
["IBM","Dec 2005","76.73"],
["IBM","Jan 2006","75.89"],
["IBM","Feb 2006","75.09"],
["IBM","Mar 2006","77.17"],
["IBM","Apr 2006","77.05"],
["IBM","May 2006","75.04"],
["IBM","Jun 2006","72.15"],
["IBM","Jul 2006","72.7"],
["IBM","Aug 2006","76.35"],
["IBM","Sep 2006","77.26"],
["IBM","Oct 2006","87.06"],
["IBM","Nov 2006","86.95"],
["IBM","Dec 2006","91.9"],
["IBM","Jan 2007","93.79"],
["IBM","Feb 2007","88.18"],
["IBM","Mar 2007","89.44"],
["IBM","Apr 2007","96.98"],
["IBM","May 2007","101.54"],
["IBM","Jun 2007","100.25"],
["IBM","Jul 2007","105.4"],
["IBM","Aug 2007","111.54"],
["IBM","Sep 2007","112.6"],
["IBM","Oct 2007","111"],
["IBM","Nov 2007","100.9"],
["IBM","Dec 2007","103.7"],
["IBM","Jan 2008","102.75"],
["IBM","Feb 2008","109.64"],
["IBM","Mar 2008","110.87"],
["IBM","Apr 2008","116.23"],
["IBM","May 2008","125.14"],
["IBM","Jun 2008","114.6"],
["IBM","Jul 2008","123.74"],
["IBM","Aug 2008","118.16"],
["IBM","Sep 2008","113.53"],
["IBM","Oct 2008","90.24"],
["IBM","Nov 2008","79.65"],
["IBM","Dec 2008","82.15"],
["IBM","Jan 2009","89.46"],
["IBM","Feb 2009","90.32"],
["IBM","Mar 2009","95.09"],
["IBM","Apr 2009","101.29"],
["IBM","May 2009","104.85"],
["IBM","Jun 2009","103.01"],
["IBM","Jul 2009","116.34"],
["IBM","Aug 2009","117"],
["IBM","Sep 2009","118.55"],
["IBM","Oct 2009","119.54"],
["IBM","Nov 2009","125.79"],
["IBM","Dec 2009","130.32"],
["IBM","Jan 2010","121.85"],
["IBM","Feb 2010","127.16"],
["IBM","Mar 2010","125.55"],
["AAPL","Jan 2000","25.94"],
["AAPL","Feb 2000","28.66"],
["AAPL","Mar 2000","33.95"],
["AAPL","Apr 2000","31.01"],
["AAPL","May 2000","21"],
["AAPL","Jun 2000","26.19"],
["AAPL","Jul 2000","25.41"],
["AAPL","Aug 2000","30.47"],
["AAPL","Sep 2000","12.88"],
["AAPL","Oct 2000","9.78"],
["AAPL","Nov 2000","8.25"],
["AAPL","Dec 2000","7.44"],
["AAPL","Jan 2001","10.81"],
["AAPL","Feb 2001","9.12"],
["AAPL","Mar 2001","11.03"],
["AAPL","Apr 2001","12.74"],
["AAPL","May 2001","9.98"],
["AAPL","Jun 2001","11.62"],
["AAPL","Jul 2001","9.4"],
["AAPL","Aug 2001","9.27"],
["AAPL","Sep 2001","7.76"],
["AAPL","Oct 2001","8.78"],
["AAPL","Nov 2001","10.65"],
["AAPL","Dec 2001","10.95"],
["AAPL","Jan 2002","12.36"],
["AAPL","Feb 2002","10.85"],
["AAPL","Mar 2002","11.84"],
["AAPL","Apr 2002","12.14"],
["AAPL","May 2002","11.65"],
["AAPL","Jun 2002","8.86"],
["AAPL","Jul 2002","7.63"],
["AAPL","Aug 2002","7.38"],
["AAPL","Sep 2002","7.25"],
["AAPL","Oct 2002","8.03"],
["AAPL","Nov 2002","7.75"],
["AAPL","Dec 2002","7.16"],
["AAPL","Jan 2003","7.18"],
["AAPL","Feb 2003","7.51"],
["AAPL","Mar 2003","7.07"],
["AAPL","Apr 2003","7.11"],
["AAPL","May 2003","8.98"],
["AAPL","Jun 2003","9.53"],
["AAPL","Jul 2003","10.54"],
["AAPL","Aug 2003","11.31"],
["AAPL","Sep 2003","10.36"],
["AAPL","Oct 2003","11.44"],
["AAPL","Nov 2003","10.45"],
["AAPL","Dec 2003","10.69"],
["AAPL","Jan 2004","11.28"],
["AAPL","Feb 2004","11.96"],
["AAPL","Mar 2004","13.52"],
["AAPL","Apr 2004","12.89"],
["AAPL","May 2004","14.03"],
["AAPL","Jun 2004","16.27"],
["AAPL","Jul 2004","16.17"],
["AAPL","Aug 2004","17.25"],
["AAPL","Sep 2004","19.38"],
["AAPL","Oct 2004","26.2"],
["AAPL","Nov 2004","33.53"],
["AAPL","Dec 2004","32.2"],
["AAPL","Jan 2005","38.45"],
["AAPL","Feb 2005","44.86"],
["AAPL","Mar 2005","41.67"],
["AAPL","Apr 2005","36.06"],
["AAPL","May 2005","39.76"],
["AAPL","Jun 2005","36.81"],
["AAPL","Jul 2005","42.65"],
["AAPL","Aug 2005","46.89"],
["AAPL","Sep 2005","53.61"],
["AAPL","Oct 2005","57.59"],
["AAPL","Nov 2005","67.82"],
["AAPL","Dec 2005","71.89"],
["AAPL","Jan 2006","75.51"],
["AAPL","Feb 2006","68.49"],
["AAPL","Mar 2006","62.72"],
["AAPL","Apr 2006","70.39"],
["AAPL","May 2006","59.77"],
["AAPL","Jun 2006","57.27"],
["AAPL","Jul 2006","67.96"],
["AAPL","Aug 2006","67.85"],
["AAPL","Sep 2006","76.98"],
["AAPL","Oct 2006","81.08"],
["AAPL","Nov 2006","91.66"],
["AAPL","Dec 2006","84.84"],
["AAPL","Jan 2007","85.73"],
["AAPL","Feb 2007","84.61"],
["AAPL","Mar 2007","92.91"],
["AAPL","Apr 2007","99.8"],
["AAPL","May 2007","121.19"],
["AAPL","Jun 2007","122.04"],
["AAPL","Jul 2007","131.76"],
["AAPL","Aug 2007","138.48"],
["AAPL","Sep 2007","153.47"],
["AAPL","Oct 2007","189.95"],
["AAPL","Nov 2007","182.22"],
["AAPL","Dec 2007","198.08"],
["AAPL","Jan 2008","135.36"],
["AAPL","Feb 2008","125.02"],
["AAPL","Mar 2008","143.5"],
["AAPL","Apr 2008","173.95"],
["AAPL","May 2008","188.75"],
["AAPL","Jun 2008","167.44"],
["AAPL","Jul 2008","158.95"],
["AAPL","Aug 2008","169.53"],
["AAPL","Sep 2008","113.66"],
["AAPL","Oct 2008","107.59"],
["AAPL","Nov 2008","92.67"],
["AAPL","Dec 2008","85.35"],
["AAPL","Jan 2009","90.13"],
["AAPL","Feb 2009","89.31"],
["AAPL","Mar 2009","105.12"],
["AAPL","Apr 2009","125.83"],
["AAPL","May 2009","135.81"],
["AAPL","Jun 2009","142.43"],
["AAPL","Jul 2009","163.39"],
["AAPL","Aug 2009","168.21"],
["AAPL","Sep 2009","185.35"],
["AAPL","Oct 2009","188.5"],
["AAPL","Nov 2009","199.91"],
["AAPL","Dec 2009","210.73"],
["AAPL","Jan 2010","192.06"],
["AAPL","Feb 2010","204.62"],
["AAPL","Mar 2010","223.02"],
];*/