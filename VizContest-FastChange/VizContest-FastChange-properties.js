/**
 * @owner Erik Wetterberg (ewg)
 */
 
 define( [], function () {
	'use strict';
	// *****************************************************************************
	// Dimensions & Measures
	// *****************************************************************************
	var dimensions = {
		uses: "dimensions",
		min: 2,
		max: 2
	};
	var measures = {
		uses: "measures",
		min: 1,
		max: 1
	};
	// *****************************************************************************
	// Appearance section
	// *****************************************************************************
	
	var colorTheme = {
		ref: "props.colorTheme",
		label: "Color Theme",
		type: "string",
		defaultValue : "2",
		expression : "optional"
	};
	
	var appearanceSection = {
		uses: "settings",
		label: "Choose Color Theme",
		items: {
			colorTheme: colorTheme,
		}
	};
	
	// *****************************************************************************
	// Main properties panel definition
	// Only what is defined here is returned from properties.js
	// *****************************************************************************
	return {
		type: "items",
		component: "accordion",
		items: {
			dimensions: dimensions,
			measures: measures,
			appearance: appearanceSection,
			sorting: {
						uses: "sorting"
					}
		}
	};
});
 
 var buttons = '<div class="container-fluid">'+
				  '<div class="col-xs-12 fast_change2 text-center" id = "fchange2">'+
					'<div class="btn-group" role="group">'+
					  '<button type="button" class="btn btn-default previous"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/back.PNG"></img></button>'+
					  '<button type="button" class="btn btn-default chartname active">Grouped Bar</span></button>'+
					  '<button type="button" class="btn btn-default next"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/forward.PNG"></img></button>'+
					'</div>'+
				  '</div>'+
			  '</div>';
 
/*
define( [], function ( ) {
	
	return {
		type: "items",
		component: "accordion",
		items: {
			dimensions: {
				uses: "dimensions",
				min: 2,
				max: 2
			},
			measures: {
				uses: "measures",
				min: 1,
				max: 1
			},
			sorting: {
				uses: "sorting"
			},
			settings: {
				uses: "settings"
			}
		}
	};
 
});
*/