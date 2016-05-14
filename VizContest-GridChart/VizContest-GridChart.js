define(["jquery", "./VizContest-GridChart-properties", "text!./css/bootstrap.css", "text!./GridChart.css", "./d3.v3.min", "./js/GridChart", "./js/dimple","./js/bootstrap.min"], 
function($, properties, bootstrap,cssContent, d3) {
	'use strict';
	$("<style>").html(bootstrap).appendTo("head");
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 6,
					qHeight : 1000
				}]
			}
		},
		definition : properties,
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element, layout) {

			var self = this, 
				
				measures = layout.qHyperCube.qMeasureInfo, 
				w = $element.width(), 
				h = $element.height()-50, 
				html = buttonsGrid,//+"<div id='fchange' style='width:"+w+"px; height : "+h+"px'></div>", d
				
				qData = layout.qHyperCube.qDataPages[0], 
				vmax = (measures && measures[0]) ? measures[0].qMax * 1.5 : 1;
			console.log(layout);
			
			$element.html(html);
			$('.main').css("height", h+"px");
			$('.chart1').css("height", h+"px");
			
			// *****************************************************************************
			// Data Preparation
			// *****************************************************************************
			var matrix = qData.qMatrix;
			var data = [];
		
			for(var i=0;i<=matrix.length-1;i++){
			
				var row = matrix[i];
				if(row[1].qText!='-' ){
					data.push({
						Month: row[0].qText,//"Apr 2015",
						'Week Number': row[1].qText,//"2",
						'Channel': row[2].qText,//"Leni, Balakrishnan",
						Reason: row[3].qText=='-'?"Average Working Hour Day":row[3].qText,
						Count: row[4].qText,//"5",
						Hours: row[5].qText//"26.61"
					});
				}
			}
			var GridData = data;
			Grid(GridData);
			
			// *****************************************************************************
			// Data Preparation End
			// *****************************************************************************
			
			
			
		}
	};
});
