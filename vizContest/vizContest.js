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
//alert("a");
	
	//callbacks -- inserted here --

	

	function Fill_KPI(reply, app){
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var data=[];
		
		var InTime = d3.scale.linear()
				.range([0, 100])
				.domain([0.25,0.58]);
		var OutTime = d3.scale.linear()
				.range([0, 100])
				.domain([0.75,0.91]);
		var AvgHrs = d3.scale.linear()
				.range([0, 100])
				.domain([0,24]);
		var leave = d3.scale.linear()
				.range([0, 100])
				.domain([0,20]);
		console.log(InTime(matrix[0][0].qNum),matrix);
		$(".progress1").animate({
			width: Math.round(AvgHrs(matrix[0][2].qNum))+"%"
		}, 100);
		$(".progress2").animate({
			width: Math.round(InTime(matrix[0][0].qNum))+"%"
		}, 100);
		$(".progress3").animate({
			width: Math.round(OutTime(matrix[0][1].qNum))+"%"
		}, 100);
		$(".progress4").animate({
			width: Math.round(leave(matrix[0][3].qNum))+"%"
		}, 100);
		
		$('.kpi1').text((matrix[0][2].qNum).toFixed(2)+" Hrs");
		$('.kpi2').text((matrix[0][0].qText));
		$('.kpi3').text((matrix[0][1].qText));
		$('.kpi4').text((matrix[0][3].qNum).toFixed(1)+" Days");
	}

	function Prep_BiPartData(reply, app){
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var data=[];
		var sEmployee = 0;
		var sId= 0;
		for(var i = 0;i<=matrix.length-1;i++){
			data.push([matrix[i][0].qText,matrix[i][1].qText,matrix[i][2].qText]);
			if(matrix[i][0].qState=='S'){
				if(sId!=matrix[i][0].qText){
					sEmployee++;
				}
				sId = matrix[i][0].qText;
			}
		}
		
		if(sEmployee==1){
			BiPartDataSelection = {
				key : sId,
				id : 0,
				isSeletedOne : true
			};
		}else{
			BiPartDataSelection = {
				key : sId,
				id : 0,
				isSeletedOne : false
			};
		}
		/*console.log(BiPartDataSelection);
		var data=BiPartDataChanged;
		if(BiPartDataSelection.isSeletedOne){
				
				var kk = 0
				for(var l=0;l<data[0].data.keys[0].length;l++){
					if(data[0].data.keys[0][l]===BiPartDataSelection.key){
						kk=l;
					}
				}
				console.log('kk',kk);
				bP.selectSegment(data,0,kk);
			}*/
		
		BiPartData = data;
		call(BiPartData);
	}

	function Prep_FastchangeData(reply, app){
		//console.log(reply.qHyperCube.qDataPages[0].qMatrix[0][1].qText);
		var matrix = reply.qHyperCube.qDataPages[0].qMatrix;
		var data=[];
		for(var i = 0;i<=matrix.length-1;i++){
			data.push([matrix[i][0].qText,matrix[i][1].qText,matrix[i][2].qText]);
		}
		fastchange = data;
		DrawFastChange(fastchange);
		
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
		
		initsheet1_chats();
		getBiPart();
		
		
	}

	//open apps -- inserted here --
	var app = qlik.openApp("TrueTime.qvf", config);
	app.clearAll();
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
			"qHeight": 100,
			"qWidth": 3
		}
	],
	"qDimensions": [
		{
			"qDef": {
				"qFieldDefs": [
					"Type Of Work"
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
				"qDef": "Count({<[Type Of Work]=-{'Office'}>}ReportDate)"
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
		}
	],
	"qSuppressZero": false,
	"qSuppressMissing": false,
	"qMode": "S",
	"qInterColumnSortOrder": [],
	"qStateName": "$"
	},Prep_FastchangeData);
	function getBiPart(){
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
					"Type Of Work"
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
				"qDef": "Count({<[Type Of Work]=-{'Office'}, full_name=>}ReportDate)+sum({<full_name=,[Type Of Work]=-{'Office'}>}0)"
			},
			"qLabel": "Count({<[Type Of Work]=-{'Office'}>}ReportDate)",
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
	},Prep_BiPartData);
	
	}//getBipart
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
				"qDef": "time(avg((time#(time(FirstLoginTime)))),'hh:mm TT')"
			},
			"qLabel": "time(avg((time#(time(FirstLoginTime)))))",
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
				"qDef": "time(avg((time#(time(FirstLoginTime))))+(avg([AvailableTime(hrs)])/24),'hh:mm TT')"//"time(avg((time#(time(LastLogoutTime)))))"
			},
			"qLabel": "time(avg((time#(time(FirstLoginTime))))+(avg([AvailableTime(hrs)])/24))",//"time(avg((time#(time(LastLogoutTime)))))",
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
				"qDef": "avg([AvailableTime(hrs)])"
			},
			"qLabel": "avg([AvailableTime(hrs)])",
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
				"qDef": "count({<[Type Of Work]={\"*Leave*\"}>}ReportDate)/count({1}Distinct Month)"
			},
			"qLabel": "count({<[Type Of Work]={\"*Leave*\"}>}ReportDate)/count({1}Distinct Month)",
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
	
//Other Functions()

	function initsheet1_chats(){
		$('body').addClass('theme_black');
					
					
					$('.colorpalette li').click(changecolorscale);	
					$('#rev').change(changecolorscaleChange);
					//$('.selectedTheme').html(colorvalues[2]);
					$( window ).resize(function() {
						console.log($( "body" ).width());
						if($( "body" ).width()<980){
							//$('.dashboard').removeClass('col-xs-10 col-xs-offset-2');
							//$('.dashboard').addClass('col-xs-12');
							$('.EMP_Details').css('visibility','hidden');
							call(BiPartData);
							DrawFastChange(fastchange);
							
						}else{
							//$('.dashboard').addClass('col-xs-10 col-xs-offset-2');
							//$('.dashboard').removeClass('col-xs-12');
							$('.EMP_Details').css('visibility','visible');
							call(BiPartData);
							DrawFastChange(fastchange);
							
						}
					});
					
					if($( "body" ).width()<980){
						//$('.dashboard').removeClass('col-xs-10 col-xs-offset-2');
						//$('.dashboard').addClass('col-xs-12');
						$('.EMP_Details').css('visibility','hidden');
						//call();
						//DrawFastChange();
					}else{
						//$('.dashboard').addClass('col-xs-10 col-xs-offset-2');
						//$('.dashboard').removeClass('col-xs-12');
						$('.EMP_Details').css('visibility','visible');
						//call();
						//DrawFastChange();
					}
	}
	
} );