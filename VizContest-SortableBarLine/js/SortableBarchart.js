//define( ["./d3.v3.min"], function (d3) {
function sortableBar(chartType, SortableBarData) {
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
                .attr('xlink:href', function(d) { return "../extensions/VizContest-SortableBarLine/images/marker.png"; })
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
		  .call(xAxis)
		  .append("text")
		  .attr("transform", "rotate(0)")
		  .attr("y", 10)
		  .attr("dy", ".91em")
		  .style("text-anchor", "end")
		  .text("Day")
		  ;

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
		  //draw_again(d);
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
	
	

}
//});

