define([
	"jquery",
	"./Dimple Grid Chart-properties",
	"text!./css/bootstrap.css",
	"text!./css/GridChart.css",
	"./js/d3.v3.min",
	"./js/GridChart",
	"./js/dimple",
	"./js/bootstrap.min"
],
	function ($, properties, bootstrap, cssContent, d3) {
		'use strict';
		$("<style>").html(bootstrap).appendTo("head");
		$("<style>").html(cssContent).appendTo("head");
		return {
			initialProperties: {
				version: 1.0,
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 6,
						qHeight: 1000
					}]
				}
			},
			definition: properties,
			snapshot: {
				canTakeSnapshot: true
			},
			paint: function ($element, layout) {

				var self = this,

					measures = layout.qHyperCube.qMeasureInfo,
					dimensions = layout.qHyperCube.qDimensionInfo,
					w = $element.width(),
					h = $element.height() - 50,
					html = buttonsGrid,//+"<div id='fchange' style='width:"+w+"px; height : "+h+"px'></div>", d

					qData = layout.qHyperCube.qDataPages[0],
					vmax = (measures && measures[0]) ? measures[0].qMax * 1.5 : 1;
				

				$element.html(html);
				$('.main').css("height", h + "px");
				$('.chart1').css("height", h + "px");
				var DataDimHeader = [];
				var DataMeasHeader = [];
				// *****************************************************************************
				// Chart type
				// *****************************************************************************
				for (var d = 0; d < dimensions.length; d++) {
					DataDimHeader.push(
						dimensions[d].qGroupFallbackTitles[dimensions[d].qGroupPos]
					);
				}

				for (var m = 0; m < measures.length; m++) {
					DataMeasHeader.push(
						measures[m].qFallbackTitle
					);
				}


				// *****************************************************************************
				// Data Preparation
				// *****************************************************************************
				var matrix = qData.qMatrix;
				var data = [];

				for (var i = 0; i <= matrix.length - 1; i++) {

					var row = matrix[i];
					var rec = {};

					for (var d = 0; d < dimensions.length; d++) {
						rec[DataDimHeader[d]] = row[d].qText;
					}
					
					for (var m = 0; m < measures.length; m++) {
						rec[DataMeasHeader[m]] = row[dimensions.length+m].qNum;
					}

					data.push(rec);
				}
				var GridData = data;
				Grid(GridData, DataDimHeader, DataMeasHeader, layout.props.colorTheme);

				// *****************************************************************************
				// Data Preparation End
				// *****************************************************************************



			}
		};
	});
