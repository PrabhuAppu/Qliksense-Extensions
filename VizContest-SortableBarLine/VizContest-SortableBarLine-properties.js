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
		min: 3,
		max: 3
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
	
	var monthList = {
		ref: "props.monthList",
		label: "Month List",
		type: "string",
		defaultValue : "=Concat(Distinct Month,'|')",
		expression : "optional"
	};
	
	var appearanceSection = {
		uses: "settings",
		label: "Choose Color Theme",
		items: {
			colorTheme: colorTheme,
			monthList : monthList
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
 
var SortBar = '<div class="row">'+
'  <div class="col-md-5 sortLabel">'+
'	<div class="row">'+
'	<div class="col-md-6 text-center">'+
'			<div class="btn-group" role="group">'+
'			  <button type="button" class="allbutton btn btn-default desc" data-value="asc"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/sort1.PNG"></img></button>'+
'			  <button type="button" class="allbutton btn btn-default btn-danger active valueas"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/sort2.PNG"></img></button>'+
'			  <button type="button" class="allbutton btn btn-default valuedes"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/sort3.PNG"></img></button>'+
'			  <button type="button" class="allbutton btn btn-default asc"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/sort4.PNG"></img></button>'+
'			</div>'+
'		</div>'+
'		<div class="col-md-6 text-center">'+
'			<div class="btn-group" data-toggle="buttons">'+
'			  <label class="btn btn-default active">'+
'				<input type="radio" value="bar" name="options" id="option1" autocomplete="off" checked><img src="../extensions/VizContest-SortableBarLine/images/Bar.PNG"/>'+
'			  </label>'+
'			  <label class="btn btn-default">'+
'				<input type="radio" value="line" name="options" id="option2" autocomplete="off"><img src="../extensions/VizContest-SortableBarLine/images/Line.PNG"/>'+
'			  </label>'+
'			</div>'+
'		</div>'+
'	</div>'+
'  </div>'+
'  <div class="col-md-3 text-center" id="example">'+
'	<div class="btn-group"  role="group">'+
'	  <button type="button" class="btn btn-default PrevMonth"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/back.PNG"></img></button>'+
'	  <button type="button" class="btn btn-default active MonthName">Mar - 2015</button>'+
'	  <button type="button" class="btn btn-default NextMonth"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/forward.PNG"></img></button>'+
'	</div>'+
'  </div>'+
'   <div class="col-md-3 text-center">'+
/*'   <div class="btn-group" role="group">'+
'		<button type="button" class="btn btn-danger GotoNow" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></button>'+
'		<button type="button" class="btn btn-default GotoNow" data-toggle="modal" data-target="#myModal">'+
'		  Calendar'+
'		</button>'+
'	</div>'+*/
'	  <button type="button" class="btn btn-default clearButton"><img style="width: 15px;height: 15px;padding: 0px;" src="../extensions/VizContest-SortableBarLine/images/refresh.PNG"></img></button>'+
'   </div>'+
'</div>'+
'<div class="row">'+
'  <div class="col-sm-12 barcharts" id = "fchange2">'+
'  </div>'+
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