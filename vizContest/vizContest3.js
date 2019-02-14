/*global require, alert*/
/*
 * 
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var config = {
	host: window.location.hostname,
	prefix: "/",
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources"
} );

require( ["js/qlik", "../extensions/vizContest/js/jquery.mCustomScrollbar.concat.min"], function ( qlik, custom ) {
	/*qlik.setOnError( function ( error ) {
		alert( error.message );
	} );*/
//alert("a");
	//callbacks -- inserted here --
console.log('d', custom);
	
	function Prep_DetailTable(reply, app){
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var data = [];
		
		for(var i=0;i<=matrix.length-1;i++){
			var row = matrix[i];
				data.push({
					full_name :row[0].qText=='-'?'Null':row[0].qText, 
					id : row[1].qText,
					ReportDate :row[2].qText,
					Login: row[3].qText,
					Logout: row[4].qText,
					Leave: row[5].qText,
					Email: row[6].qText,
					Hrs: row[7].qText
				});
		}
		TableDetail = data;
		console.log('detail',data);
		$('.tableData').empty();
		$('.tableData').html(
		'<table id="table"'+
		   'data-toolbar="#toolbar"'+
		   'data-search="true"'+
		   'data-show-refresh="true"'+
		   'data-show-toggle="true"'+
		   'data-show-columns="true"'+
		   'data-show-export="true"'+
		   'data-detail-view="false"'+
		   'data-detail-formatter="detailFormatter"'+
		   'data-minimum-count-columns="2"'+
		   'data-show-pagination-switch="true"'+
		   'data-pagination="true"'+
		   'data-page-list="[3,6, 25, 50, 100, ALL]"'+
		   'data-show-footer="true"'+
		   'data-side-pagination="client"'+
		   'data-response-handler="responseHandler"'+
		   'data-icons-prefix="glyphicon"'+
		   'data-striped = "true"'+
		   '>'+
		'</table>'
		)
		tablecreator();
	}
	
	function getMonth(reply, app){
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var data=[];
		var isMonthSelected=false;
		//console.log('selected',matrix);
		for(var i = 0;i<=matrix.length-1;i++){
			if(matrix[i][0].qState=='S'){
				isMonthSelected=false;
			};
		}
		if(!isMonthSelected){
		
			for(var i = 0;i<=matrix.length-1;i++){
				data.push({'Name':matrix[i][0].qText, 'id': matrix[i][0].qElemNumber});
			}
			MonthArray = data;
				//app.field('Month').select([data.length-1], false, true);
				$('.MonthName').text(data[0].Name);
				//$('.NextMonth').removeAttr("column-value");
				//$('.PrevMonth').attr("column-value",data.length-2);
				
				//this.getAttribute("column-value");
				//var value = this.getAttribute("column-value");
			
			
		}
		
	}
	
	 
	  $('.PrevMonth').on('click', function(){
		var selectMatch=false;
		for(var i=0;i<MonthArray.length;i++){
			if($('.MonthName').text()===MonthArray[i].Name && i-1>=0){
				selectMatch=MonthArray[i-1].Name;
			}
		}
		if(selectMatch){
			//app.field('Month').selectMatch(selectMatch, false);
			myStoryboard.goToFrame(selectMatch);
			myStoryboard.stopAnimation();
			$('.MonthName').text(selectMatch);
		}
		
	});
	
	$('.NextMonth').on('click', function(){
		console.log('initial', MonthArray);
		var selectMatch=false;
		for(var i=0;i<MonthArray.length-1;i++){
			console.log('asa', $('.MonthName').text()+" = = "+MonthArray[i].Name);
			if($('.MonthName').text()===MonthArray[i].Name){
				selectMatch=MonthArray[i+1].Name;
			}
		}
		console.log('select',selectMatch);
		if(selectMatch){
			//app.field('Month').selectMatch(selectMatch, false);
			myStoryboard.goToFrame(selectMatch);
			myStoryboard.stopAnimation();
			$('.MonthName').text(selectMatch);
		}
		
	});
	
	function Prep_bubble(reply, app){
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var data = [];
		
		for(var i=0;i<=matrix.length-1;i++){
		
			var row = matrix[i];
			if(row[3].qText!='-' ){
				data.push({
					EMP_ID :row[2].qText, 
					Date : row[0].qText,
					Reason :row[3].qText,
					comb: row[4].qText
				});
			}
		}
		console.log('sd',data);
			BubbleData = data;
		
		callBubble();
	}
	
	function Prep_Grid(reply, app){
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var data = [];
		
		for(var i=0;i<=matrix.length-1;i++){
		
			var row = matrix[i];
			if(row[1].qText!='-' ){
				data.push({
					Month: row[0].qText,//"Apr 2015",
					'Week Number': row[1].qText,//"2",
					'Employee Name': row[2].qText,//"Leni, Balakrishnan",
					Reason: row[3].qText=='-'?"Average Working Hour Day":row[3].qText,
					Count: row[4].qText,//"5",
					Hours: row[5].qText//"26.61"
				});
			}
		}
			GridData = data;
		
		Grid();
	}
	
	function Prep_topKPI(reply, app){
		
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		
		gauge1.update(matrix[0][1].qText);
		gauge2.update(matrix[1][1].qText);
		gauge3.update(matrix[2][1].qText);
		gauge4.update(matrix[3][1].qText);
		
		fill_Array.push(matrix[0][1].qText);
		fill_Array.push(matrix[1][1].qText);
		fill_Array.push(matrix[2][1].qText);
		fill_Array.push(matrix[3][1].qText);
		
		$('.kpiText1').text(matrix[0][0].qText);
		$('.kpiText2').text(matrix[1][0].qText);
		$('.kpiText3').text(matrix[2][0].qText);
		$('.kpiText4').text(matrix[3][0].qText);
		
	}
	

	
	function Fill_LeftPanel(reply, app){
		//alert("A");
		$(".sided").mCustomScrollbar({
						scrollButtons:{ enable: false },
						autoHideScrollbar: true
						//mouseWheel:{ enable: true },
						//mouseWheel:{scrollAmount:188}
					});
		
		console.log(reply);
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var colorside = d3.scale.ordinal()
		.range(colorvalues[4]);
		$('#mCSB_1_container').empty();
		for(var i=0;i<=matrix.length-1;i++){
			var selectedclasss = matrix[i][0].qState=='S'?"elementlightGradient":"elementGradient";
			$('#mCSB_1_container').append('<div class="row element '+selectedclasss+'" column-value="'+matrix[i][0].qElemNumber+'" style="border-color: '+colorside(matrix[i][0].qText)+';">'+
				'<div class="col-xs-4">'+
					'<span class="helper"></span>'+
					'<a class="usericon_tag" href="#">'+
						'<img alt="user" class="usericon" src="images/Muser.png">'+
					'</a>'+
				'</div>'+
				'<div class="col-xs-8 EMP_Details details_light">'+
					'<div class="empName">'+matrix[i][0].qText+'</br>'+matrix[i][1].qText+'</div>'+
					'<span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span>'+
				'</div>'+
				'</div>');
		}
		
		$('.element').on("click",function(){
			var value = this.getAttribute("column-value");
			//console.log(value);
			app.field('full_name').select([parseInt(value)], true, true);
		});
		
		initsheet3_chats();
		
	}

	//open apps -- inserted here --
	var app = qlik.openApp("TrueTime.qvf", config);
	$('.ClearAll').on('click',function(){
		app.clearAll();
	});

	//get objects -- inserted here --
	//create cubes and lists -- inserted here --
	
	//Get /update Side Panel Data
	
	app.createCube({
	"qInitialDataFetch": [
		{
			"qHeight": 20,
			"qWidth": 3
		}
	],
	"qDimensions": [
		{
			"qDef": {
				"qFieldDefs": [
					"full_name"
				]
			},
			"qNullSuppression": true,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"id"
				]
			},
			"qNullSuppression": true,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		}
	],
	"qMeasures": [
		{
			"qDef": {
				"qDef": "only({1}full_name)"
			},
			"qLabel": "only({1}full_name)",
			"qLibraryId": null,
			"qSortBy": {
				"qSortByState": 0,
				"qSortByFrequency": 0,
				"qSortByNumeric": 0,
				"qSortByAscii": 1,
				"qSortByLoadOrder": 0,
				"qSortByExpression": 0,
				"qExpression": {
					"qv": " "
				}
			}
		}
	],
	"qSuppressZero": false,
	"qSuppressMissing": false,
	"qMode": "S",
	"qInterColumnSortOrder": [],
	"qStateName": "$"
	},Fill_LeftPanel);
	
	app.createCube({
	"qInitialDataFetch": [
		{
			"qHeight": 20,
			"qWidth": 2
		}
	],
	"qDimensions": [
		{
			"qDef": {
				"qFieldDefs": [
					"Reason"
				]
			},
			"qNullSuppression": true,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		}
	],
	"qMeasures": [
		{
			"qDef": {
				"qDef": "num(Count(Reason)*100/Count(Total Reason),'#0.0')"
			},
			"qLabel": "Count(Reason)/Count(Total Reason)",
			"qLibraryId": null,
			"qSortBy": {
				"qSortByState": 0,
				"qSortByFrequency": 0,
				"qSortByNumeric": 0,
				"qSortByAscii": 1,
				"qSortByLoadOrder": 0,
				"qSortByExpression": 0,
				"qExpression": {
					"qv": " "
				}
			}
		}
	],
	"qSuppressZero": false,
	"qSuppressMissing": false,
	"qMode": "S",
	"qInterColumnSortOrder": [],
	"qStateName": "$"
	},Prep_topKPI);
	
	app.createCube({
	"qInitialDataFetch": [
		{
			"qHeight": 200,
			"qWidth": 7
		}
	],
	"qDimensions": [
		{
			"qDef": {
				"qFieldDefs": [
					"Month"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"=if(month(weekend(ReportDate))= month(ReportDate),div(day(WeekEnd(ReportDate)),7),div(day(Weekend(ReportDate,-1)),7)+1)+1//Ceil(Mod(Day(ReportDate),7)+1)"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"=subfield(full_name,' ',1)"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"Reason"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		}
	],
	"qMeasures": [
		{
			"qDef": {
				"qDef": "Count(ReportDate)"
			},
			"qLabel": "Count(ReportDate)",
			"qLibraryId": null,
			"qSortBy": {
				"qSortByState": 0,
				"qSortByFrequency": 0,
				"qSortByNumeric": 0,
				"qSortByAscii": 1,
				"qSortByLoadOrder": 0,
				"qSortByExpression": 0,
				"qExpression": {
					"qv": " "
				}
			}
		},
		{
			"qDef": {
				"qDef": "sum([AvailableTime(hrs)])"
			},
			"qLabel": "sum([AvailableTime(hrs)])",
			"qLibraryId": null,
			"qSortBy": {
				"qSortByState": 0,
				"qSortByFrequency": 0,
				"qSortByNumeric": 0,
				"qSortByAscii": 1,
				"qSortByLoadOrder": 0,
				"qSortByExpression": 0,
				"qExpression": {
					"qv": " "
				}
			}
		}
	],
	"qSuppressZero": false,
	"qSuppressMissing": false,
	"qMode": "S",
	"qInterColumnSortOrder": [],
	"qStateName": "$"
	},Prep_Grid);
	
	app.createCube({
	"qInitialDataFetch": [
		{
			"qHeight": 1000,
			"qWidth": 7
		}
	],
	"qDimensions": [
		{
			"qDef": {
				"qFieldDefs": [
					"Month"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"ReportDate"//=if(month(weekend(ReportDate))= month(ReportDate),div(day(WeekEnd(ReportDate)),7),div(day(Weekend(ReportDate,-1)),7)+1)+1//Ceil(Mod(Day(ReportDate),7)+1)"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"=subfield(full_name,' ',1)"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"Reason"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		}
	],
	"qMeasures": [
		{
			"qDef": {
				"qDef": "sum([AvailableTime(hrs)])"
			},
			"qLabel": "sum([AvailableTime(hrs)])",
			"qLibraryId": null,
			"qSortBy": {
				"qSortByState": 0,
				"qSortByFrequency": 0,
				"qSortByNumeric": 0,
				"qSortByAscii": 1,
				"qSortByLoadOrder": 0,
				"qSortByExpression": 0,
				"qExpression": {
					"qv": " "
				}
			}
		}
	],
	"qSuppressZero": false,
	"qSuppressMissing": false,
	"qMode": "S",
	"qInterColumnSortOrder": [],
	"qStateName": "$"
	},Prep_bubble);
	
	app.createCube({
	"qInitialDataFetch": [
		{
			"qHeight": 100,
			"qWidth": 3
		}
	],
	"qDimensions": [
		{
			"qDef": {
				"qFieldDefs": [
					"Month"
				]
			},
			"qNullSuppression": true,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		}
	],
	"qMeasures": [
		{
			"qDef": {
				"qDef": "(Count({1}Month))"
			},
			"qLabel": "(only({1}Month))",
			"qLibraryId": null,
			"qSortBy": {
				"qSortByState": 0,
				"qSortByFrequency": 0,
				"qSortByNumeric": 0,
				"qSortByAscii": 1,
				"qSortByLoadOrder": 0,
				"qSortByExpression": 0,
				"qExpression": {
					"qv": " "
				}
			}
		}
	],
	"qSuppressZero": true,
	"qSuppressMissing": true,
	"qMode": "S",
	"qInterColumnSortOrder": [],
	"qStateName": "$"
	},getMonth);
	
	app.createCube({
	"qInitialDataFetch": [
		{
			"qHeight": 1000,
			"qWidth": 10
		}
	],
	"qDimensions": [
		{
			"qDef": {
				"qFieldDefs": [
					"full_name"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"id"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"ReportDate"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"FirstLoginTime"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"LastLogoutTime"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"[Type Of Work]"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"Email"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		},
		{
			"qDef": {
				"qFieldDefs": [
					"AvailableTime(hrs)"
				]
			},
			"qNullSuppression": false,
			"qOtherTotalSpec": {
				"qOtherMode": "OTHER_OFF",
				"qSuppressOther": true,
				"qOtherSortMode": "OTHER_SORT_DESCENDING",
				"qOtherCounted": {
					"qv": "5"
				},
				"qOtherLimitMode": "OTHER_GE_LIMIT"
			}
		}
	],
	"qMeasures": [],
	"qSuppressZero": false,
	"qSuppressMissing": false,
	"qMode": "S",
	"qInterColumnSortOrder": [],
	"qStateName": "$"
	},Prep_DetailTable);
	
	
	
	//Callback Functions()
	
	function initsheet3_chats(){
		//tablecreator();
		
		
		$('body').addClass('theme_black');
				/*$(".sided").mCustomScrollbar({
					scrollButtons:{ enable: false },
					autoHideScrollbar: true
					//mouseWheel:{ enable: true },
					//mouseWheel:{scrollAmount:188}
				});	
				$(".tableDiv1").mCustomScrollbar({
					scrollButtons:{ enable: true },
					autoHideScrollbar: false
					//mouseWheel:{ enable: true },
					//mouseWheel:{scrollAmount:188}
				});	*/
				//tableDiv

				
			/*$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
				//console.log(state);
				//console.log($('#change').bootstrapSwitch("state"));
				polarchart(state);
			});*/
			$('.colorpalette li').click(changecolorscale);	
				$('#rev').change(changecolorscaleChange);
				
			$( window ).resize(function() {
			console.log($( "body" ).width());
				if($( "body" ).width()<980){
					$('.EMP_Details').css('visibility','hidden');
					callBubble();
					Grid();
				}else{
					$('.EMP_Details').css('visibility','visible');
					callBubble();
					Grid();
				}
			});
			if($( "body" ).width()<980){
				$('.EMP_Details').css('visibility','hidden');
			}else{
				$('.EMP_Details').css('visibility','visible');
			}
	}
	
} );