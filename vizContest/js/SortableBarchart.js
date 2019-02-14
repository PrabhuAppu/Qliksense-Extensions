function sortableBar(chartType) {
 sortBartData = SortableBarData ;
$(".barcharts").empty();
	/*var drag = d3.behavior.drag()  
				 .on('dragstart', function() { circle.style('fill', 'red'); })
				 .on('drag', function() { circle.attr('cx', d3.event.x)
												.attr('cy', d3.event.y); })
				 .on('dragend', function() { circle.style('fill', 'black'); });*/

	var drag = d3.behavior.drag()
				.origin(function (d) {
					var t = d3.select("#" + d);
					return {
					x: t.attr("x"), y: t.attr("y")//x: t.attr("x"), y: t.attr("y") 
					};
				})
				.on("drag", dragmove);
	
	$(".clearButton").click(function(){
		d3.selectAll('.barselected').each(function(d){	
			d3.select(this).attr("class","bar");
		});
		d3.selectAll(".lined").transition().duration(500).attr("y1",20).attr("y2",20);
		d3.selectAll(".mark").transition().duration(500).attr("y",8);
	});
	var color = d3.scale.category20c();
	function dragmove(d) {
	
		if(!(d3.event.y<8 || d3.event.y>=350 )){
		//alert(x.invert(d3.event.y));
			/*var leftEdges = y.range();
			var width = y.rangeBand();
			var j;
			for(j=0; d3.event.y > (leftEdges[j] + width); j++) {}
				//do nothing, just increment j until case fails*/
			
       xx = d3.select("#" + d);
       //xx.attr("transform", "translate(" + 0 + "," + d3.event.y + ")");
       xx.attr("x", xx.attr("x"));
       xx.attr("y", d3.event.y);
	   
	   xx2 = d3.select("#" + d+"_line");
	   xx2.attr("y1", d3.event.y+12);
       xx2.attr("y2", d3.event.y+12);
	
	var pos1 = (y.invert(parseInt(d3.select(".line0").attr("y1"))-24));
	var pos2 = (y.invert(parseInt(d3.select(".line1").attr("y1"))-24));
	//console.log("Clicked on "+pos1+" : "+pos2);
		if(pos1>pos2){
			d3.selectAll('.bar').each(function(d){	
				if((d.frequency)>=pos2 && (d.frequency)<=pos1){
					d3.select(this).attr("class","bar barselected");
				}
			});
			
			d3.selectAll('.barselected').each(function(d){	
				if(!((d.frequency)>pos2 && (d.frequency)<pos1)){
					d3.select(this).attr("class","bar");
				}
			});
		}else{
			d3.selectAll('.bar').each(function(d){	
				if((d.frequency)<=pos2 && (d.frequency)>=pos1){
					d3.select(this).attr("class","bar barselected");
				}
			});
			
			d3.selectAll('.barselected').each(function(d){	
				if(!((d.frequency)<pos2 && (d.frequency)>pos1)){
					d3.select(this).attr("class","bar");
				}
			});
		}
	   }
	}

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = $(".barcharts").width() - margin.left - margin.right,
		height = $(".barcharts").height() - margin.top - margin.bottom;

	var formatPercent = d3.format(".00");

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1, 1);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(formatPercent);

	var svg2 = d3.select(".barcharts").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
	  var svg = svg2.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//Draggable circle
		/*var circle = svg.selectAll('circle')  
                .data(["dd"])
                .enter()
                .append('circle')
                .attr('class', 'draggableCircle')
				.attr('id', 'dd')
                .attr('cx', function(d) { return 50; })
                .attr('cy', function(d) { return 50; })
                .attr('r', function(d) { return 25; })
                .call(drag)
                .style('fill', 'black');*/
				svg2.selectAll('image')
				.data(["dd", "dd2"])
                .enter()
                .append("image") 
                .attr('class', function(d, i) { return 'mark marker'+i;})
				.attr('id', function(d) { return d; })
                .attr('xlink:href', function(d) { return "images/marker.png"; })
				.attr('x', function(d) { return 15; })
                .attr('y', function(d) { return 8; })
				.attr('height', function(d) { return 25; })
				.attr('width', function(d) { return 25; })
                //.attr('r', function(d) { return 25; })
                .call(drag);
				
				svg2.selectAll('line')
				.data(["dd", "dd2"])
                .enter()
                .append("line")
                .attr('class', function(d, i) { return 'lined line'+i;})
				.attr('id', function(d) { return d+"_line"; })
                //.attr('xlink:href', function(d) { return "images/marker.png"; })
				.attr('x1', function(d) { return 40; })
                .attr('y1', function(d) { return 20; })
				.attr('x2', function(d) { return width; })
				.attr('y2', function(d) { return 20; });
                //.attr('r', function(d) { return 25; })
                //.call(drag);
				
		//d3.select(".marker1").call(drag);
	//d3.tsv("data.tsv", function(error, data) {
	
	  var data = sortBartData;
	  data.forEach(function(d) {
		d.frequency = +d.frequency;
	  });

	  x.domain(data.map(function(d) { return d.letter; }));
	  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

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
if(chartType){
	  svg.selectAll(".bar")
		  .data(data)
		  .enter().append("rect")
		  .attr("class", "bar")
		  .attr("x", function(d) { return x(d.letter); })
		  .attr("width", x.rangeBand())
		  .attr("y", function(d) { return y(d.frequency); })
		  .attr("height", function(d) { return height - y(d.frequency); })
		  .on("mouseover",showtooltip)
		  .on("mouseleave",hidetooltip)
		  .on("click", selectbar);
		  //.attr("fill", function(d){ console.log(d.frequency); return colorsGradient(d.frequency); });
}else{
		  svg.selectAll(".line")
		  .data(data)
		  .enter().append("line")
		  .attr("class", "ll")
		  .attr("x1", function(d,i) { return x(d.letter)+x.rangeBand()/2; })
		  .attr("x2", function(d,i) { return (data.length>(i+1)?x(data[i+1].letter):x(d.letter))+x.rangeBand()/2; })
		  //.attr("width", x.rangeBand())
		  .attr("y1", function(d,i) { return y(d.frequency); })
		  .attr("y2", function(d,i) { return data.length>(i+1)?y(data[i+1].frequency):y(d.frequency); })
		   .attr("stroke-width", "2")
		   .attr("stroke", "black")
		  //.attr("height", function(d) { return height - y(d.frequency); })
		  .on("mouseover",showtooltip)
		  .on("mouseleave",hidetooltip)
		  .on("click", selectbar);
		  
		  svg.selectAll(".bar")
		  .data(data)
		  .enter().append("circle")
		  .attr("class", "bar")
		  .attr("cx", function(d) { return x(d.letter)+x.rangeBand()/2; })
		  //.attr("width", x.rangeBand())
		  .attr("cy", function(d) { return y(d.frequency); })
		   .attr("r", "5")
		  //.attr("height", function(d) { return height - y(d.frequency); })
		  .on("mouseover",showtooltip)
		  .on("mouseleave",hidetooltip)
		  .on("click", selectbar);
		  
}		  
		  
	  d3.select(".asc").on("click", change);
	  d3.select(".desc").on("click", change);
	  d3.select(".valueas").on("click", change);
	  d3.select(".valuedes").on("click", change);
	  
	  $('input[name="sortoptions"]').on('change', change);
	  
	  /*var sortTimeout = setTimeout(function() {
		d3.select(".sortbar").property("checked", true).each(change);
	  }, 2000);*/

	  function showtooltip(d){
		//alert(JSON.stringify(d.letter));
		$('.popover').each(function() {
            $(this).remove();
          }); 
		 $(this).popover({
			placement: 'top',
			container: '.barcharts',
			trigger: 'manual',
			html : true,
			title : function() { return "Hours in Office " + d.letter },
			content: function() { 
				var html =	'<div class="progress progress_tooltip">'+
							  '<div class="progress-bar progress-bar-success " role="progressbar" aria-valuenow="'+((d.office_hrs+d.work_from_home)*100/24)+'" aria-valuemin="0" aria-valuemax="100" style="width: '+((d.office_hrs+d.work_from_home)*100/24)+'%">'+
							  '</div>'+
							  '<div class="progress-bar progress-bar-danger " role="progressbar" aria-valuenow="'+((d.break_time)*100/24)+'" aria-valuemin="0" aria-valuemax="100" style="width: '+((d.break_time)*100/24)+'%">'+
							  '</div>'+
							'</div>'+
							'<span class="label label-success legend_hrs">Working Hrs ' +parseInt(d.office_hrs+d.work_from_home)+ '</span>  '+
							'<span class="label label-danger legend_hrs">Break Hrs ' +parseInt(d.break_time)+'</span>  ';//+'<p class="kpi_text">Working hours/day</p>';//(d.office_hrs+d.work_from_home);
			  return html;//"Date : "+d.letter+"<br> Hours : "+d.frequency +" Hrs<br>Working Hours : "+(d.office_hrs+d.work_from_home)+"Hrs<br>Break Hrs : "+d.break_time+" Hrs"; 
			}
		  });
		  $(this).popover('show');
		  draw_again(d);
	  }
	  
	  function hidetooltip(d){
		$('.popover').each(function() {
            $(this).remove();
          }); 
	  }
	  
	  function selectbar(d){
		if(d3.select(this).attr("class")==="bar"){
			d3.select(this).attr("class","bar barselected");
		}else{
			d3.select(this).attr("class","bar");
		}
	  }
	  d3.select(".x").selectAll(".tick").on("click",selecttext);
	  
	  function selecttext(d){
		var textval = d3.select(this).select("text").text();
		//alert(textval);
		var assigned = false;
		d3.selectAll(".barselected").each(function(d){
			if(textval===d.letter){
				d3.select(this).attr("class","bar");
				assigned = true;
				//break;
			}
		});
		if(!assigned){
			d3.selectAll(".bar").each(function(d){
				if(textval===d.letter){
					d3.select(this).attr("class","barselected");
					//break;
				}
			});
		}
	  }
	  
	  function change(d) {
	  //alert($('input[name="sortoptions"]').val());
		$('.allbutton').removeClass("btn-danger active");
		
		$(this).addClass("btn-danger active");
		
		//clearTimeout(sortTimeout);
		//alert(d3.select(this).attr("class"));
		// Copy-on-write since tweens are evaluated after a delay.
		/*var x0 = x.domain(data.sort(this.checked
			? function(a, b) { return b.frequency - a.frequency; }
			: function(a, b) { return d3.ascending(a.letter, b.letter); })
			.map(function(d) { return d.letter; }))
			.copy();*/
			var SortType = $('input[name="sortoptions"]').val();
		/*var x0 = x.domain(data.sort((SortType=="asc")
			? function(a, b) { return a.frequency - b.frequency; } : (SortType=="desc")
			? function(a, b) { return b.frequency - a.frequency; } : (SortType=="valuedes")
			? function(b, a) { return (a.letter) - (b.letter); } : function(a, b) { return (a.letter) - (b.letter); }
			//? function(b, a) { return parseInt(a.letter) - parseInt(b.letter); } : function(a, b) { return parseInt(a.letter) - parseInt(b.letter); }
			//? function(b, a) { return d3.ascending(a.letter, b.letter); } : function(a, b) { return d3.ascending(a.letter, b.letter); }
			)
			.map(function(d) { return d.letter; }))
			.copy();*/
			
		var x0 = x.domain(data.sort((d3.select(this).attr("class").indexOf("asc") > -1)
			? function(a, b) { return a.frequency - b.frequency; } : (d3.select(this).attr("class").indexOf("desc") > -1)
			? function(a, b) { return b.frequency - a.frequency; } : (d3.select(this).attr("class").indexOf("valuedes") > -1)
			? function(b, a) { return a.letter - b.letter; } : function(a, b) { return a.letter - b.letter; }
			//? function(b, a) { return d3.ascending(a.letter, b.letter); } : function(a, b) { return d3.ascending(a.letter, b.letter); }
			)
			.map(function(d) { return d.letter; }))
			.copy();
			
		if(!$('input[name="options"]').prop('checked')){
			//Line Sorting
			svg.selectAll(".bar")
				.sort(function(a, b) { return x0(a.letter) - x0(b.letter); });
			
			var transition = svg.transition().duration(750),
			delay = function(d, i) { return i * 50; };
			
			transition.selectAll(".bar")
			.attr("cx", function(d) { return x0(d.letter)+x.rangeBand()/2; })
			.attr("r","5").each("end", function() {
				d3.select(this).transition().duration(750).delay(delay)
				.attr("r","5");
			});
			
			
			
				
			svg.selectAll(".ll")
				.sort(function(a, b) { return x0(a.letter) - x0(b.letter); });
			
			var transition = svg.transition().duration(750),
			delay = function(d, i) { return i * 50; };
			
			transition.selectAll(".ll")
			.delay(delay)
			//.attr("cx", function(d) { return x0(d.letter); })
			.attr("x1", function(d,i) { return x0(d.letter)+x.rangeBand()/2; })
		  .attr("x2", function(d,i) { return (data.length>(i+1)?x0(data[i+1].letter):x0(d.letter))+x.rangeBand()/2; })
		  //.attr("width", x.rangeBand())
		  .attr("y1", function(d,i) { return y(d.frequency); })
		  .attr("y2", function(d,i) { return data.length>(i+1)?y(data[i+1].frequency):y(d.frequency); });
			
			//end
		}else{
			svg.selectAll(".bar")
				.sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

			var transition = svg.transition().duration(750),
				delay = function(d, i) { return i * 50; };

			transition.selectAll(".bar")
				.delay(delay)
				.attr("x", function(d) { return x0(d.letter); });
		}
		transition.select(".x.axis")
			.call(xAxis)
		  .selectAll("g")
			.delay(delay);
	  }
	//});
	
	/*Bullet Chart{*/
	var margin = {top: 5, right: 40, bottom: 20, left: 50},
    width = $(".bulletchart").width() - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;

	var chart = d3.bullet()
		.width(width)
		.height(height);

	//d3.json("bullets.json", function(error, data) {
	  //if (error) throw error;
	  
	  var dataB = bulletData;

	  var svgB = d3.select(".bulletchart").selectAll("svg")
		  .data(dataB)
		.enter().append("svg")
		  .attr("class", "bullet")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)
		.append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		  .call(chart);

	  var title = svgB.append("g")
		  .style("text-anchor", "end")
		  .attr("transform", "translate(-6," + height / 2 + ")");

	  title.append("text")
		  .attr("class", "title")
		  .text(function(d) { return d.title; });

	  title.append("text")
		  .attr("class", "subtitle")
		  .attr("dy", "1em")
		  .text(function(d) { return d.subtitle; });

	 // d3.selectAll("button").on("click", draw_again);
	//});
	var newData = [];
	function draw_again(data) {
		//alert(JSON.stringify(randomize));
		newData = data;
		svgB.datum(randomize).call(chart.duration(500)); // TODO automatic transition
		d3.select(".title")
		  .text(function(d) { return data.letter; });

	 d3.select(".subtitle")
		  .text(function(d) { return data.letter; });
	  }

	function randomize(d) {
	  //if (!d.randomizer) d.randomizer = randomizer(d);
	  //alert(JSON.stringify( [(newData.office_hrs+newData.work_from_home),newData.break_time]));
	  //d.ranges = [6,8,18];//d.ranges.map(d.randomizer);
	  //d.markers = [8];//d.markers.map(d.randomizer);
	  //d.measures = [newData.break_time,(newData.office_hrs+newData.work_from_home)];//[30,50]//d.measures.map(d.randomizer);
	  d.measures = [newData.office_hrs+newData.work_from_home,newData.office_hrs+newData.work_from_home+newData.break_time];//[30,50]//d.measures.map(d.randomizer);
	  d3.select('.working').html((newData.office_hrs+newData.work_from_home)+" Hrs");
	  d3.select('.break').html(newData.break_time +" Hrs");
	  //d.measures = d.measures.map(d.randomizer);
	  //alert(JSON.stringify(d));
	  return d;
	}

	function randomizer(d) {
	  /*var k = d3.max(d.ranges) * .2;
	  return function(d) {
		return Math.max(0, d + k * (Math.random() - .5));
	  };*/
	  return d;
	}

}

var sortBartData = 
[{letter :'1', frequency : 8,break_time :1,work_from_home :9,office_hrs :3},
{letter :'2', frequency : 3,break_time :1,work_from_home :6,office_hrs :8},
{letter :'3', frequency : 13,break_time :0,work_from_home :7,office_hrs :6},
{letter :'4', frequency : 9,break_time :0,work_from_home :8,office_hrs :1},
{letter :'5', frequency : 5,break_time :1,work_from_home :2,office_hrs :2},
{letter :'6', frequency : 4,break_time :3,work_from_home :8,office_hrs :4},
{letter :'7', frequency : 12,break_time :0,work_from_home :9,office_hrs :3},
{letter :'8', frequency : 15,break_time :0,work_from_home :9,office_hrs :6},
{letter :'9', frequency : 13,break_time :3,work_from_home :4,office_hrs :6},
{letter :'10', frequency : 5,break_time :3,work_from_home :0,office_hrs :2},
{letter :'11', frequency : 8,break_time :0,work_from_home :7,office_hrs :5},
{letter :'12', frequency : 4,break_time :3,work_from_home :9,office_hrs :1},
{letter :'13', frequency : 6,break_time :0,work_from_home :7,office_hrs :8},
{letter :'14', frequency : 5,break_time :2,work_from_home :5,office_hrs :7},
{letter :'15', frequency : 13,break_time :3,work_from_home :6,office_hrs :4},
{letter :'16', frequency : 5,break_time :3,work_from_home :1,office_hrs :1},
{letter :'17', frequency : 13,break_time :1,work_from_home :5,office_hrs :7},
{letter :'18', frequency : 8,break_time :2,work_from_home :2,office_hrs :4},
{letter :'19', frequency : 8,break_time :2,work_from_home :5,office_hrs :9},
{letter :'20', frequency : 7,break_time :2,work_from_home :1,office_hrs :4},
{letter :'21', frequency : 8,break_time :0,work_from_home :3,office_hrs :5},
{letter :'22', frequency : 9,break_time :3,work_from_home :5,office_hrs :1},
{letter :'23', frequency : 12,break_time :3,work_from_home :6,office_hrs :3},
{letter :'24', frequency : 11,break_time :3,work_from_home :2,office_hrs :6},
{letter :'25', frequency : 9,break_time :1,work_from_home :7,office_hrs :1},
{letter :'26', frequency : 7,break_time :3,work_from_home :9,office_hrs :3},
{letter :'27', frequency : 5,break_time :3,work_from_home :4,office_hrs :7},
{letter :'28', frequency : 7,break_time :1,work_from_home :0,office_hrs :6},
{letter :'29', frequency : 14,break_time :3,work_from_home :3,office_hrs :8},
{letter :'30', frequency : 6,break_time :3,work_from_home :2,office_hrs :1}
];
/*[{letter : 'A', frequency : 0.08167},
{letter : 'B', frequency : 0.01492},
{letter : 'C', frequency : 0.0278},
{letter : 'D', frequency : 0.04253},
{letter : 'E', frequency : 0.37702},
{letter : 'F', frequency : 0.02288},
{letter : 'G', frequency : 0.02022},
{letter : 'H', frequency : 0.06094},
{letter : 'I', frequency : 0.06973},
{letter : 'J', frequency : 0.00153},
{letter : 'K', frequency : 0.00747},
{letter : 'L', frequency : 0.04025},
{letter : 'M', frequency : 0.02517},
{letter : 'N', frequency : 0.06749},
{letter : 'O', frequency : 0.07507},
{letter : 'P', frequency : 0.01929},
{letter : 'Q', frequency : 0.00098},
{letter : 'R', frequency : 0.05987},
{letter : 'S', frequency : 0.06333},
{letter : 'T', frequency : 0.09056},
{letter : 'U', frequency : 0.02758},
{letter : 'V', frequency : 0.01037},
{letter : 'W', frequency : 0.02465},
{letter : 'X', frequency : 0.0015},
{letter : 'Y', frequency : 0.01971},
{letter : 'Z', frequency : 0.00074}]*/

var bulletData = [
  {"title":"Revenue","subtitle":"US$, in thousands","ranges":[6,8,24],"measures":[8,9],"markers":[9]}/*,
  {"title":"Profit","subtitle":"%","ranges":[20,25,30],"measures":[21,23],"markers":[26]},
  {"title":"Order Size","subtitle":"US$, average","ranges":[350,500,600],"measures":[100,320],"markers":[550]},
  {"title":"New Customers","subtitle":"count","ranges":[1400,2000,2500],"measures":[1000,1650],"markers":[2100]},
  {"title":"Satisfaction","subtitle":"out of 5","ranges":[3.5,4.25,5],"measures":[3.2,4.7],"markers":[4.4]}*/
];