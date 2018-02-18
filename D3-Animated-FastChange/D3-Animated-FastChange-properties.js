/**
 * @summary Animated Grid Chart for Qliksense
 * 
 * @owner Prabhu Appu
 * 
 * @GitHub_Source https://github.com/PrabhuAppu/Qliksense-Extensions/tree/master/D3-Animated-FastChange
 *  
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
 
 var buttons = '<div class="QvExtensioncontainer container-fluid">'+
				  '<div class="col-xs-12 fast_change2 text-center" id = "fchange2">'+
					'<div class="btn-group" role="group">'+
					  '<button type="button" class="btn btn-default previous"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/D3-Animated-FastChange/images/back.PNG"></img></button>'+
					  '<button type="button" class="btn btn-default chartname active">Grouped Bar</span></button>'+
					  '<button type="button" class="btn btn-default next"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/D3-Animated-FastChange/images/forward.PNG"></img></button>'+
					'</div>'+
				  '</div>'+
			  '</div>';
