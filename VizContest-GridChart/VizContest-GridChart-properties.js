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
		min: 4,
		max: 4
	};
	var measures = {
		uses: "measures",
		min: 2,
		max: 2
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
 
 var buttonsGrid = '<div class="row container-fluid main"><div class="col-md-12">'+
						'<div class="row" style="padding:20px;">'+
							
							/*'<div class="btn-group" role="group">'+
								'<button type="button" class="btn btn-danger GotoNow" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></button>'+
								'<button type="button" class="btn btn-default GotoNow" data-toggle="modal" data-target="#myModal">'+
								  'Details'+
								'</button>'+
							'</div>'+*/

							'<div class="btn-group" role="group">'+
								'<button type="button" class="btn btn-default play active"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/play.PNG"></img></button>'+
								'<button type="button" class="btn btn-default pause"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/pause.PNG"></img></button>'+

							'</div>'+

							/*'<div class="btn-group"  role="group">'+
							  '<button type="button" class="btn btn-default PrevMonth"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button>'+
							  '<button type="button" class="btn btn-default active MonthName">Mar - 2015</button>'+
							  '<button type="button" class="btn btn-default NextMonth"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'+
							'</div>'+*/

						'</div>'+
						'<div class="row" style="padding-left : 20px">'+
							//'<h5>Over Time Reasons (weekly)<small> Pie Segments : Reason; Pie Size : Weekly Working Hours</small></h5>'+
						'</div>'+
						'<div class="row">'+
							'<div class="col-sm-12 chart1 text-center" >'+

							'</div>'+
						'</div>'+
					'</div>'+'</div>';
 
