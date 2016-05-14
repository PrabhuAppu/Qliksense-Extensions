define(["jquery",
	"./D3-Animated-FastChange-properties",
	"text!./css/bootstrap.css",
	"text!./css/FastChange.css",
	"./js/d3.v3.min",
	"./js/FastChangeChart",
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
						qWidth: 3,
						qHeight: 100
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
					w = $element.width(),
					h = $element.height() - 50,
					html = buttons + "<div id='fchange' style='width:" + w + "px; height : " + h + "px'></div>",
					qData = layout.qHyperCube.qDataPages[0],
					vmax = (measures && measures[0]) ? measures[0].qMax * 1.5 : 1;


				$element.html(html);

				// *****************************************************************************
				// Data Preparation
				// *****************************************************************************
				
				var Header = [
					layout.qHyperCube.qDimensionInfo[0].qGroupFallbackTitles[layout.qHyperCube.qDimensionInfo[0].qGroupPos],
					layout.qHyperCube.qDimensionInfo[1].qGroupFallbackTitles[layout.qHyperCube.qDimensionInfo[1].qGroupPos],
					layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
					"display"
				]
							
				var matrix = qData.qMatrix;
				var data = [];
				for (var i = 0; i <= matrix.length - 1; i++) {
					data.push([matrix[i][0].qText, matrix[i][1].qText, matrix[i][2].qNum, matrix[i][2].qText]);
				}
				var fastchange = data;
				DrawFastChange(fastchange, layout.props.colorTheme, Header);

				// *****************************************************************************
				// Data Preparation End
				// *****************************************************************************



			}
		};
	});
