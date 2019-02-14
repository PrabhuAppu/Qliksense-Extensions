var myChart;
 var myStoryboard ;
 
function Grid(){
$('.chart1').empty();
var svg = dimple.newSvg(".chart1", $('.chart1').width(), $('.chart1').height());
    
    d3.tsv("data/example.tsv", function (data) {
	data = GridData;
	console.log(data);
      myChart = new dimple.chart(svg, data);
      //L T W H
	  myChart.setBounds(60, 10, $('.chart1').width()-60, $('.chart1').height()-60);
        
      // Define all the axes
      /*var xAxis = myChart.addMeasureAxis("x", "Distribution");
      var yAxis = myChart.addMeasureAxis("y", "Price");
      var segments = myChart.addMeasureAxis("p", "Unit Sales");
      var size = myChart.addMeasureAxis("z", "Sales Value");
      //var ring = myChart.addSeries(["Price Tier", "Channel"], dimple.plot.pie);
      var pie = myChart.addSeries(["Price Tier", "Owner"], dimple.plot.pie);*/
	  
	  var xAxis = myChart.addCategoryAxis("x", "Employee Name");
	  xAxis.fontSize = "12px";
	  xAxis.fontFamily = "Segoe UI";
      var yAxis = myChart.addCategoryAxis("y", "Week Number");
	  yAxis.fontSize = "12px";
	  yAxis.fontFamily = "Segoe UI";
      var segments = myChart.addMeasureAxis("p", "Count");
      var size = myChart.addMeasureAxis("z", "Hours");
      //var ring = myChart.addSeries(["Price Tier", "Channel"], dimple.plot.pie);
      var pie = myChart.addSeries(["WeekNameValue", "Reason"], dimple.plot.pie);
	  //var pie2 = myChart.addSeries(['Hours'], dimple.plot.bar);
		//pie2.radius=0;
      // Zoom in the axis bounds
      /*xAxis.overrideMin = 40;
      xAxis.overrideMax = 70;
      yAxis.overrideMax = 150;*/
	  
	 // xAxis.overrideMin = 0;
     // xAxis.overrideMax = 5;
      yAxis.overrideMax = 5;

      // Set the maximum radius for the bubbles
      //ring.radius = 75;
      pie.radius = 50;

      // Create fixed 10px ring with a 5px
      // margin (negative sizes are calculated inwards)
      //ring.innerRadius = "-10px";
      pie.outerRadius = "-15px";

      // Draw averages for the pie and ring
     // ring.aggregate = dimple.aggregateMethod.avg;
      pie.aggregate = dimple.aggregateMethod.sum;
	  
	  //myChart.assignColor("KT Session", "red");//, "black", 1);
	  /*for (var i=0;i<3;i++){
		myChart.defaultColors.push({
			fill: colors(i),
			opacity: 0.8,
			stroke: colors(i)
		});
	  }*/
	  var reason = dimple.getUniqueValues(data, "Reason"); 
	  
	  for(var i=0;i<reason.length;i++){
		  myChart.assignColor(reason[i], colors(reason[i]),'white','1');
	  }
	  
	 /* var colorArr = [
			new dimple.color(colors(0),'white','1'),
			new dimple.color(colors(1),'white','1'),
			new dimple.color(colors(2),'white','1'),
			new dimple.color(colors(3),'white','1'),
			new dimple.color(colors(4),'white','1')
		];
		myChart.defaultColors = colorArr;
		console.log(myChart.defaultColors);*/
		
	/* myChart.addSeries([
			"project_id",
			"service_durations_days",
			"days_overdue",
			"active_services",
			"project_status"
		], dimple.plot.bubble);*/
	 
      // Animate by date
      myStoryboard = myChart.setStoryboard("Month");
	  myStoryboard.frameDuration = 2000;
	  //myStoryboard.pauseAnimation();
	/*if($('.play').attr('class').indexOf('active')!=-1){
		myStoryboard.startAnimation();
		$('.pause').removeClass('active');
		$('.play').addClass('active');
	}else{
		myStoryboard.pauseAnimation();
		$('.play').removeClass('active');
		$('.pause').addClass('active');
	}*/
	  
	  $('.play').removeClass('active');
		$('.pause').addClass('active');
	  
	$('.play').on('click', function(){
		myStoryboard.startAnimation();
		$('.pause').removeClass('active');
		$('.play').addClass('active');
	});
	
	$('.pause').on('click', function(){
		myStoryboard.pauseAnimation();
		$('.play').removeClass('active');
		$('.pause').addClass('active');
	});
	
	
	
	myStoryboard.onTick = function (e) {
        //console.log(e.frameValue);
		 /*xAxis.shapes.selectAll("text").attr("transform",
    function (d) {
      return d3.select(this).attr("transform") + " translate(0, 20) rotate(270)";
    });*/
    };
	
	myChart.noFormats = false;
	//myChart.fontFamily = "Segoe UI";
	//myChart.fontSize = "12px";
      myChart.draw();
	  myStoryboard.stopAnimation();
	  myStoryboard.storyLabel.fontFamily = "Segoe UI";
	  myStoryboard.storyLabel.fontSize = "12px";
	  myStoryboard.storyLabel.attr("x", 80);
	  myStoryboard.storyLabel.attr("y", 10);
	  myStoryboard.storyLabel.attr("text-anchor", 'start');
	  myStoryboard.storyLabel.attr("font-family", "Segoe UI").attr("font-size", "12px");
	  // Handle the hover event - overriding the default behaviour
      //pie.addEventHandler("mouseover", onHover);
	 
	  
	  /*xAxis.shapes.selectAll("text").attr("transform",
    function (d) {
      return d3.select(this).attr("transform") + " translate(0, 0) rotate(270)";
    });*/
	  
	   function onHover(e) {
        
        // Get the properties of the selected shape
        var cx = parseFloat(e.selectedShape.attr("cx")),
            cy = parseFloat(e.selectedShape.attr("cy")),
            r = parseFloat(e.selectedShape.attr("r")),
            fill = e.selectedShape.attr("fill"),
            stroke = e.selectedShape.attr("stroke");
            
        // Set the size and position of the popup
        var width = 150,
            height = 100,
            x = (cx + r + width + 10 < svg.attr("width") ?
                  cx + r + 10 :
                  cx - r - width - 20);
            y = (cy - height / 2 < 0 ?
                  15 :
                  cy - height / 2);
                
        // Fade the popup fill mixing the shape fill with 80% white
        var popupFillColor = d3.rgb(
                    d3.rgb(fill).r + 0.8 * (255 - d3.rgb(fill).r),
                    d3.rgb(fill).g + 0.8 * (255 - d3.rgb(fill).g),
                    d3.rgb(fill).b + 0.8 * (255 - d3.rgb(fill).b)
                );
        
        // Create a group for the popup objects
		// Filter the data for the selected brand and sku
        var hoverData = dimple.filterData(data, "full_name", e.xValue);
        hoverData = dimple.filterData(hoverData, "WeekNameValue", e.seriesValue);
		hoverData = dimple.filterData(hoverData, "Month", e.frameValue);
		var avgHrs = 0;
		var cnt = 0;
		for(var i=0;i<hoverData.length;i++){
			avgHrs += hoverData[i].Hours;
			cnt++;
		}
		
		
		
		alert(JSON.stringify(e));
		console.log('e',e);
        popup = svg.append("g");
        popup.append('text')
		.attr("class","gripTextPopup")
			.attr("x", x+5).attr("y",y-5)
			.text('sdhadgh')
			.attr("text-anchor","start" );
		;
		
		
		  
        // Add a rectangle surrounding the chart
        /*popup
          .append("rect")
          .attr("x", x + 5)
          .attr("y", y - 5)
          .attr("width", width)
          .attr("height", height)
          .attr("rx", 5)
          .attr("ry", 5)
          .style("fill", popupFillColor)
          .style("stroke", stroke)
          .style("stroke-width", 2);
        
        // Add the series value text
        popup
          .append("text")
          .attr("x", x + 10)
          .attr("y", y + 10)
          .text(e.seriesValue[0])
          .style("font-family", "sans-serif")
          .style("font-size", 10)
          .style("fill", stroke);
        
        // Filter the data for the selected brand and sku
        var hoverData = dimple.filterData(data, "Brand", e.xValue);
        hoverData = dimple.filterData(hoverData, "SKU", e.seriesValue);
        
        // Create a new mini chart of Unit Sales over Months
        tipChart = new dimple.chart(svg,  hoverData);
        tipChart.setBounds(x + 10, y + 30, width - 10, height - 40);
        tipChart.addCategoryAxis("x", "Date").hidden = true;
        tipChart.addMeasureAxis("y", "Unit Sales").hidden = true;
        
        // Add a bar series, this can be changed to a line, area or bubble
        // by changing the plot parameter accordingly.
        var popUpSeries = tipChart.addSeries("SelectedSeries", dimple.plot.bar);
        
        // Set the gap to 80% - just a style preference
        popUpSeries.barGap = 0.8;
        
        // Set the color to the stroke color of the selected node
        tipChart.assignColor("SelectedSeries", stroke, stroke);
        
        // Draw the mini chart
        tipChart.draw();*/
        
      };
	  
    });
}