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

require( ["js/qlik"], function ( qlik ) {
	/*qlik.setOnError( function ( error ) {
		alert( error.message );
	} );*/
//alert("prabhu");
	//callbacks -- inserted here --
	function Prep_Calendar(reply, app){
		
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		console.log(matrix);
		//console.log('matrix',matrix);
		//console.log('cod',codropsEvents);
		var data=[];
		for(var i = 0;i<=matrix.length-1;i++){
		//console.log(codropsEvents[matrix[i][0].qText]);
			data[matrix[i][0].qText] = getDatePopOver(matrix[i][4].qText, matrix[i][5].qText, matrix[i][2].qText, matrix[i][3].qText);//htm;
			
		}
		//console.log('data',data);
		codropsEvents = data;
		createCalendar();
	}
	
	function getDatePopOver(width1, width2, inTime, OutTime){
		var htm='';
		if(width1>9){
			htm = '<div class="hide redOver container-fluid"><div class="col-sm-12"><div class="row"><div class="tip progress progress_tooltip"><div class="progress-bar progress-bar-success " role="progressbar" aria-valuenow="'+((width1)*100/24)+'" aria-valuemin="0" aria-valuemax="100" style="width: '+((width1)*100/24)+'%"></div><div class="progress-bar progress-bar-danger " role="progressbar" aria-valuenow="'+((width2)*100/24)+'" aria-valuemin="0" aria-valuemax="100" style="width: '+((width2)*100/24)+'%"></div></div></div><div class="row"><div class="col-sm-6"><span class="label label-success legend_hrs">Working Hrs '+width1+'</span></div><div class="col-sm-6"><span class="label label-danger legend_hrs">Break Hrs '+width2+'</span></div></div><div class="row paddingRow"><div class="col-sm-6"><span class="glyphicon glyphicon-time green" aria-hidden="true"></span> In time : <br><b>'+inTime+'</b> </div><div class="col-sm-6"><span class="glyphicon glyphicon-time red" aria-hidden="true"></span> Out Time : <br><b>'+OutTime+'</b></div></div></div></div>';
		}else{
			htm = '<div class="hide container-fluid"><div class="col-sm-12"><div class="row"><div class="tip progress progress_tooltip"><div class="progress-bar progress-bar-success " role="progressbar" aria-valuenow="'+((width1)*100/24)+'" aria-valuemin="0" aria-valuemax="100" style="width: '+((width1)*100/24)+'%"></div><div class="progress-bar progress-bar-danger " role="progressbar" aria-valuenow="'+((width2)*100/24)+'" aria-valuemin="0" aria-valuemax="100" style="width: '+((width2)*100/24)+'%"></div></div></div><div class="row"><div class="col-sm-6"><span class="label label-success legend_hrs">Working Hrs '+width1+'</span></div><div class="col-sm-6"><span class="label label-danger legend_hrs">Break Hrs '+width2+'</span></div></div><div class="row paddingRow"><div class="col-sm-6"><span class="glyphicon glyphicon-time green" aria-hidden="true"></span> In time : <br><b>'+inTime+'</b> </div><div class="col-sm-6"><span class="glyphicon glyphicon-time red" aria-hidden="true"></span> Out Time : <br><b>'+OutTime+'</b></div></div></div></div>';
		}
		return htm;
	}
	
	function Fill_KPI(reply, app){
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var data=[];
		
		var Gt9 = d3.scale.linear()
				.range([0, 100])
				.domain([0,31]);
		var Lt9 = d3.scale.linear()
				.range([0, 100])
				.domain([0,31]);
		var WeW = d3.scale.linear()
				.range([0, 100])
				.domain([0,31]);
		var WpW = d3.scale.linear()
				.range([0, 100])
				.domain([0,120]);
		
		$(".progress1").animate({
			width: Math.round(Gt9(matrix[0][0].qNum))+"%"
		}, 100);
		$(".progress2").animate({
			width: Math.round(Lt9(matrix[0][1].qNum))+"%"
		}, 100);
		$(".progress3").animate({
			width: Math.round(WeW(matrix[0][2].qNum))+"%"
		}, 100);
		$(".progress4").animate({
			width: Math.round(WpW(matrix[0][3].qNum))+"%"
		}, 100);
		
		$('.kpi1').text((matrix[0][0].qNum)+" Days");
		$('.kpi2').text((matrix[0][1].qText)+" Days");
		$('.kpi3').text((matrix[0][2].qNum)+" Days");
		$('.kpi4').text((matrix[0][3].qNum).toFixed(1)+" Hrs");
	}

	
	function getMonth(reply, app){
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var data=[];
		var isMonthSelected=false;
		//console.log('selected',matrix);
		for(var i = 0;i<=matrix.length-1;i++){
			if(matrix[i][0].qState=='S'){
				isMonthSelected=true;
			};
		}
		if(!isMonthSelected){
		//console.log('initial');
			for(var i = 0;i<=matrix.length-1;i++){
				data.push({'Name':matrix[i][0].qText, 'id': matrix[i][0].qElemNumber});
			}
			MonthArray = data;
				app.field('Month').select([data.length-1], false, true);
				$('.MonthName').text(data[data.length-1].Name);
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
			app.field('Month').selectMatch(selectMatch, false);
			$('.MonthName').text(selectMatch);
		}
		
	});
	
	$('.NextMonth').on('click', function(){
		var selectMatch=false;
		for(var i=0;i<MonthArray.length-1;i++){
			if($('.MonthName').text()===MonthArray[i].Name && i+1<MonthArray.length){
				selectMatch=MonthArray[i+1].Name;
			}
		}
		if(selectMatch){
			app.field('Month').selectMatch(selectMatch, false);
			$('.MonthName').text(selectMatch);
		}
		
	});
	
  	function Prep_SortableBar(reply, app){
	
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var data=[];
		for(var i = 0;i<=matrix.length-1;i++){
			var work = matrix[i][1].qIsNull==true?0:parseInt((matrix[i][1].qNum).toFixed(2));
			var breakTime = matrix[i][2].qIsNull==true?0:parseInt((matrix[i][2].qNum).toFixed(2));
			data.push({ letter : (matrix[i][0].qText), 
						frequency : work+breakTime,//parseInt(((matrix[i][1].qNum)+(matrix[i][2].qNum))).toFixed(2),
						break_time : parseInt(breakTime.toFixed(2)),
						work_from_home :0,
						office_hrs :parseInt(work.toFixed(2))
					  });
    	}
		//console.log('sortdata', matrix);
		//console.log('sortdata', data);
		SortableBarData = data;
		$('.allbutton').removeClass("btn-danger active");
		$('.valueas').addClass("btn-danger active");
		sortableBar($('input[name="options"]').prop('checked'));
	}
  
	function Fill_LeftPanel(reply, app){
		//alert("A");
		$(".sided").mCustomScrollbar({
						scrollButtons:{ enable: false },
						autoHideScrollbar: true
						//mouseWheel:{ enable: true },
						//mouseWheel:{scrollAmount:188}
					});
		
		//console.log(reply);
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
			app.field('full_name').select([parseInt(value)], false, true);
		});
		
		initsheet2_chats();
	}

	//open apps -- inserted here --
	var app = qlik.openApp("TrueTime.qvf", config);
	app.field('full_name').select([1], true, true);
	$('.ClearAll').on('click',function(){
		app.clearAll();
		/*app.field('Month').select([MonthArray.length-1], true, true);
		$('.MonthName').text(MonthArray[MonthArray.length-1].Name);*/
	});
//app.field('Month').select([1], true, true);
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

	//Get Months
	
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
				"qDef": "(only({1}Month))"
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
	"qSuppressZero": false,
	"qSuppressMissing": false,
	"qMode": "S",
	"qInterColumnSortOrder": [],
	"qStateName": "$"
	},getMonth);
	
  	//SortableBar
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
					"DayNumber"
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
				"qDef": "(Avg([AvailableTime(hrs)]))"
			},
			"qLabel": "Avg([AvailableTime(hrs)])",
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
				"qDef": "(Avg([BreakTime(hrs)]))"
			},
			"qLabel": "Avg([BreakTime(hrs)])",
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
	},Prep_SortableBar);
  	
  app.createCube({
	"qInitialDataFetch": [
		{
			"qHeight": 1,
			"qWidth": 4
		}
	],
	"qDimensions": [],
	"qMeasures": [
		{
			"qDef": {
				"qDef": "Count({<[AvailableTime(hrs)]={\">9\"}>}ReportDate)"
			},
			"qLabel": ">9",
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
				"qDef": "Count({<[AvailableTime(hrs)]={\"<9\"}>}ReportDate)"
			},
			"qLabel": "<9",
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
				"qDef": "Count({<[AvailableTime(hrs)]={\">0\"},WeekDayNumber={'Sun','Sat'}>}ReportDate)"
			},
			"qLabel": "Count({<[AvailableTime(hrs)]={\">0\"},WeekDayNumber={'0','6'}>}ReportDate)",
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
				"qDef": "Avg(aggr(sum([AvailableTime(hrs)]),WeekNameValue))"
			},
			"qLabel": "Avg(aggr(sum([AvailableTime(hrs)]),WeekNameValue))",
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
	},Fill_KPI);

	app.createCube({
	"qInitialDataFetch": [
		{
			"qHeight": 100,
			"qWidth": 7
		}
	],
	"qDimensions": [
		{
			"qDef": {
				"qFieldDefs": [
					"=Date(ReportDate,'MM-DD-YYYY')"
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
					"WeekDayNumber"
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
					"=time(FirstLoginTime,'hh:mm TT')"
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
					"=time(LastLogoutTime,'hh:mm TT')"
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
				"qDef": "(Avg([AvailableTime(hrs)]))"
			},
			"qLabel": "Avg([AvailableTime(hrs)])",
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
				"qDef": "(Avg([BreakTime(hrs)]))"
			},
			"qLabel": "Avg([BreakTime(hrs)])",
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
	},Prep_Calendar);
	//Callback Functions()
	
	function initsheet2_chats(){
		$('body').addClass('theme_black');
				
				$('.colorpalette li').click(changecolorscale);	
				$('#rev').change(changecolorscaleChange);
			
			
			
			$('input[name="options"]').on('change', function(){
				sortableBar($('input[name="options"]').prop('checked'));
			});
			$( window ).resize(function() {
			//console.log($( "body" ).width());
				if($( "body" ).width()<980){
					//$('.dashboard').removeClass('col-xs-10 col-xs-offset-2');
					//$('.dashboard').addClass('col-xs-12');
					$('.EMP_Details').css('visibility','hidden');
					sortableBar($('input[name="options"]').prop('checked'));
				}else{
					//$('.dashboard').addClass('col-xs-10 col-xs-offset-2');
					//$('.dashboard').removeClass('col-xs-12');
					$('.EMP_Details').css('visibility','visible');
					sortableBar($('input[name="options"]').prop('checked'));
				}
			});
				if($( "body" ).width()<980){
					//$('.dashboard').removeClass('col-xs-10 col-xs-offset-2');
					//$('.dashboard').addClass('col-xs-12');
					$('.EMP_Details').css('visibility','hidden');
					//sortableBar($('input[name="options"]').prop('checked'));
				}else{
					//$('.dashboard').addClass('col-xs-10 col-xs-offset-2');
					//$('.dashboard').removeClass('col-xs-12');
					$('.EMP_Details').css('visibility','visible');
					//sortableBar($('input[name="options"]').prop('checked'));
				}
				//call();
				//DrawFastChange();
			
	}
	
} );