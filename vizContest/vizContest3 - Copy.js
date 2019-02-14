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
	
	//Callback Functions()
	
	function initsheet3_chats(){
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
					//$('.dashboard').removeClass('col-xs-10 col-xs-offset-2');
					//$('.dashboard').addClass('col-xs-12');
					$('.EMP_Details').css('visibility','hidden');
					//polarchart($('#change').bootstrapSwitch("state"));
					CircleChart();
					polarchart();
					tablecreator();
				}else{
					//$('.dashboard').addClass('col-xs-10 col-xs-offset-2');
					//$('.dashboard').removeClass('col-xs-12');
					$('.EMP_Details').css('visibility','visible');
					//polarchart($('#change').bootstrapSwitch("state"));
					CircleChart();
					polarchart();
					tablecreator();
				}
			});
			$("[name='my-checkbox']").bootstrapSwitch();
			//polarchart($('#change').bootstrapSwitch("state"));
			if($( "body" ).width()<980){
				//$('.dashboard').removeClass('col-xs-10 col-xs-offset-2');
				//$('.dashboard').addClass('col-xs-12');
				$('.EMP_Details').css('visibility','hidden');
				//polarchart($('#change').bootstrapSwitch("state"));
				CircleChart();
				polarchart();
				tablecreator();
			}else{
				//$('.dashboard').addClass('col-xs-10 col-xs-offset-2');
				//$('.dashboard').removeClass('col-xs-12');
				$('.EMP_Details').css('visibility','visible');
				//polarchart($('#change').bootstrapSwitch("state"));
				CircleChart();
				polarchart();
				tablecreator();
			}
	}
	
} );