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
		min: 0,
		max: 0
	};
	var measures = {
		uses: "measures",
		min: 3,
		max: 3
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
	
	var KPItitle = {
		ref: "props.KPItitle",
		label: "Tittle",
		type: "string",
		defaultValue : "2",
		expression : "optional"
	};
	var KPImax = {
		ref: "props.KPImax",
		label: "Max",
		type: "number",
		defaultValue : "0",
		expression : "optional"
	};
	var KPImin = {
		ref: "props.KPImin",
		label: "Min",
		type: "number",
		defaultValue : "100",
		expression : "optional"
	};
	
	var KPIicon = {
		ref: "props.KPIicon",
		label: "Icon",
		type: "string",
		defaultValue : "WH.PNG",
		expression : "optional"
	};
	
	var appearanceSection = {
		uses: "settings",
		label: "Choose Color Theme",
		items: {
			colorTheme: colorTheme,
			KPItitle : KPItitle,
			KPImin : KPImin,
			KPImax : KPImax,
			KPIicon : KPIicon
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
 
 var buttonskpi = '<div class="row container-fluid">'+
					'<div class="col-xs-4 kpi_inner">'+
						'<p class="kpi_text">Working hours/day</p>'+
						'<div class="icon_bg">'+
							'<img alt="Brand" src="../extensions/VizContest-GaugeKPI/images/WH.png" class="kpi_image img-rounded">'+
						'</div>'+
					'</div>'+
					'<div class="col-xs-8 kpi_inner kpi_value">'+
						'<div class="row">'+
							'<div class="col-sm-12 kpi1">9.5 hrs</div>'+
						'</div>'+
						'<div class="row progress_row">'+
							'<div class="col-sm-12 progress_col">'+
								'<div class="progress progress_custom">'+
								  '<div class="progress-bar progress-bar-success progress-bar-striped progress1" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 0%">'+
									'<span class="sr-only">40% Complete (success)</span>'+
								  '</div>'+
								'</div>'+
							'</div>'+
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