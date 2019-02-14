function CircleChart(){
	$('.circlechart').empty();
	var width =$('.circlechart').width();
	var height =$('.circlechart').height();
	var margin = {top: 20, right: 60, bottom: 20, left: 20};
	
	var y = d3.scale.linear()
		.range([0,Math.min((width-margin.left-margin.right)/2, (height-margin.top-margin.bottom)/2)]);
	y.domain([0, d3.max(CircleChartData, function(d) { return d[1]; })]);
	
	var svg = d3.select(".circlechart").append("svg")
		.attr("width", 	width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
		
	var multiplier = 3;
	var delay = function(d, i) { return (CircleChartData.length-i) * 140; };
	x = margin.left+y(d3.max(CircleChartData, function(d) { return d[1]; }));
	svg.selectAll("circle")
		  .data(CircleChartData)
		  .enter().append("circle")
		  .attr("class", "circleInside")
		  .attr("fill", function(d) { return colors(d[0]); })
		  .attr("stroke-width", function(d) { return 0.5; })
		  .attr("stroke", function(d) { return "black"; })
		  .attr("cx", function(d) { return x; })
		  .attr("cy", function(d) { return height-margin.bottom-y(CircleChartData[CircleChartData.length-1][1]); })
		  .attr("r", function(d) { return y(CircleChartData[CircleChartData.length-1][1]); })
		  .transition()
		  .duration(750)
		  .delay(delay)
		  .attr("r", function(d) { return y(d[1]); })
		  .attr("cx", function(d) { return x; })
		  .attr("cy", function(d) {  return height-margin.bottom-y(d[1]); })
		  .attr("opacity",0.8);
		   
	svg.selectAll("text")
		  .data(CircleChartData)
		  .enter().append("text")
		  .attr("class", "textInside")
		  .attr("fill", function(d) { return "black"; })
		  .attr("x", function(d) { return x; })
		  .attr("y", function(d) { return height-margin.bottom-y(CircleChartData[CircleChartData.length-1][1]); })
		  .transition()
		  .duration(750)
		  .delay(delay)
		  .attr("x", function(d) { return x; })
		  .attr("y", function(d) {  return height-margin.bottom-y(d[1])*2+20; })
		  .text(function(d) { return d[1]; })
		   .style("text-anchor", "middle");
	
	/*svg.append('g').selectAll("text")
	  .data(CircleChartData)
	  .enter().append("text")
	  .attr("class", "textInside")
	  .attr("fill", function(d) { return "rgb(50,50,50)"; })
	  .attr("x", function(d) { return x; })
	  .attr("y", function(d) { return height-margin.bottom-y(CircleChartData[CircleChartData.length-1][1]); })
	  .transition()
	  .duration(750)
	  .delay(delay)
	  .attr("x", function(d) { return 30+(x); })
	  .attr("y", function(d) {  return height-margin.bottom-y(d[1])*2-2; })
	  .text(function(d) { return d[0]; })
	   .style("text-anchor", "right");
	
	svg.selectAll("line")
	  .data(CircleChartData)
	  .enter().append("line")
	  .attr("class", "lineInside")
	  .attr("x1", function(d) { return x-0.5; })
	  .attr("y1", function(d) { return height-margin.bottom; })
	  .attr("x2", function(d) { return 200+(x); })
	  .attr("y2", function(d) {  return height-margin.bottom; })
	   .attr("stroke-width", function(d) { return 0.2; })
	   .attr("stroke", function(d) { return "rgb(230,230,230)"; })
	   .transition()
		  .duration(750)
		  .delay(delay)
		.attr("y2", function(d) {  return height-margin.bottom-(y(d[1])*2); })
		.attr("y1", function(d) {  return height-margin.bottom-(y(d[1])*2); });
		*/
	
	
}

var CircleChartData = [
['Qliktech Session',40],
['Onsite Counter part was on leave',34],
['Status Call',29],
['Colleague was on leave',20],
['KT Session',15],
['Onsite Holiday',10],
['Critical Project Delivery',5]
];