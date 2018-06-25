/*global require*/
/*
 * Bootstrap-based responsive mashup
 * @owner Erik Wetterberg (ewg)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1);

var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
//to avoid errors in workbench: you can remove this when you have added an app
var app;
require.config({
	baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
});

require(["js/qlik"//,
//,"../extensions/VAssistant/semantic/js/semantic.min",
,"http://localhost:4848/extensions/VAssistant/SocketIO.js"
], function (qlik, io) {

	$("#closeerr").on('click', function () {
		$("#errmsg").html("").parent().hide();
	});
	qlik.setOnError(function (error) {
		$("#errmsg").append("<div>" + error.message + "</div>").parent().show();
	});


	//callbacks -- inserted here --
	//open apps -- inserted here --
	var app = qlik.openApp('Executive Dashboard.qvf', config);

	
	//get objects -- inserted here --
	//app.getObject('QV01', 'nRxXG');

	$('#searchText').on('search', function () {
		
		// search logic here
		// this function will be executed on click of X (clear button)
		$.ajax({
			url: "http://127.0.0.1:5000/query/" + $('#searchText').val(),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			type: "GET",
			data: '',
			success: function (response) {
				//do whatever your thingy..
				console.log(response);
				//$('.resultD').css("visibility", "visible");

				//$("#TotalPages").text("Page " + "1" + " of " + Math.ceil(response.length / 3));

				var html = "";
				html += '<div class="row" style="height:300px">';
				response.forEach(function (element, iter) {
					html += '    <div id="QV' + iter + '" class="col s12 col m4 obj card">col-xs-6 col-md-4</div>';
				});
				html += '</div>';

				$("#results").html(html);

				response.forEach(function (element, iter) {
					$("#QV" + iter).empty();
					app.visualization.create(element.type, element.dataCube,
						element.properties
					).then(function (vis) {
						
						vis.show("QV" + iter);
					});

				});
			}
		});
	});

    

	//create cubes and lists -- inserted here --
    var queryNum = 0;
    var mainIter = '_'+queryNum+'_';
    var sendQuery = function(){
        var query = $("#query").val();
        if(query.length>0 && query != ""){
            add(query);
            queryNum+=1;
            mainIter = '_'+queryNum+'_';
           // alert(query);
            socket.emit('my query', {
                "query": query
            });
        }
    };
    
    var prevTerm = "";
    var sendFilterConfirmation = function(){
        var query = $("#query").val();
        if(query.length>0 && query != ""){
            add(query);
            socket.emit('confirmThisFilter', {
                "field": query,
                "term": prevTerm
            });
        }
    };
    
    var socket = io.connect("http://127.0.0.1:5000");
    
    socket.on('connect', function(){
        socket.emit('my event', {
                "dat": "User Connected"
        });
    });
    
    socket.on('my response', function(msg){
        receive(msg);
    });
    
    socket.on('confirmFilter', function(msg){
        receive(msg.query);
        prevTerm = msg.term;
        $("form").unbind('submit', sendQuery);
        $("form").bind('submit', sendFilterConfirmation);
    });
    
    socket.on('allFilterOver', function(msg){
        receive(msg);
        prevTerm = msg.term;
        $("form").unbind('submit', sendFilterConfirmation);
        $("form").bind('submit', sendQuery);
    });
    
    socket.on('result', function(msg){
        response = msg;
        
        var html = "";
        if (response.length==0){
            receive("Sorry..! No Result found please provide more information...");
        }else{
            response.forEach(function(element, iter){
                html += ' <div id="QV'+(mainIter+iter)+'" class="content">'+'</div>'
            });
            
            
        $("#chatScreen").append(
        '<div class="widthFull bg-transparent chartCloud">'+
        '<div class="row searchRow">'+
        
        '<div class="col-1">'+
        '   <div class="alert messageBot circularDiv" role="alert">'+
        '       AM'+
        '   </div>'+
        '</div>'+
        
        '<div class="col-11">'+
        '   <div class="alert messageBot message" style="display:block" role="alert">'+
        html+
        '   </div>'+
        '</div>'+
        
        '   </div>'+
        '</div>'
        )
        
        response.forEach(function (element, iter) {
            $("#QV" + (mainIter+iter)).empty();
            app.visualization.create(element.type, element.dataCube,
            {
                dataPoint : {
                    showLables: true
                },
                color : {
                    auto: false,
                    mode: "byDimension"
                }
            }
            ).then(function (vis) {
                
                vis.show("QV" + (mainIter+iter));
            });

        });
        }
    
        $("form").unbind('submit', sendQuery);
        $("form").unbind('submit', sendFilterConfirmation);
        $("form").bind('submit', sendQuery);    
    }); // on result
    
    $("form").unbind('submit', sendQuery);
    $("form").unbind('submit', sendFilterConfirmation);
    $("form").bind('submit', sendQuery);    
    
    function add(message){
        $("#chatScreen").append(
            '<div class="widthFull bg-transparent chartCloud">'+
            '   <div class="row searchRow">'+
            '       <div class="col-11">'+
            '           <div class="alert messageMe message" role="alert" style="float:right;">'+
            message+
            '           </div>'+
            '       </div>'+
            
            '       <div class="col-1">'+
            '           <div class="alert messageMe circularDiv" role="alert">'+
            '               PA'+
            '           </div>'+
            '       </div>'+
            '   </div>'+
            '</div>'
        );
        
        $(".scrollable").animate({scrollTop: $(".scrollable").prop("scrollHeight")}, 1000);
        
        $("#query").val("");
        $("#query").focus();
    }
    
    
    function receive(message){
        $("#chatScreen").append(
            '<div class="widthFull bg-transparent chartCloud">'+
            '   <div class="row searchRow">'+
            
            '       <div class="col-1">'+
            '           <div class="alert messageBot circularDiv" role="alert">'+
            '              AM'+
            '           </div>'+
            '       </div>'+
            '       <div class="col-11">'+
            '           <div class="alert messageBot message" role="alert">'+
            message.replace(/[\|]/g,'</br>')+
            '           </div>'+
            '       </div>'+
            

            '       </div>'+
            '   </div>'+
            '</div>'
        );
        
        $(".scrollable").animate({scrollTop: $(".scrollable").prop("scrollHeight")}, 1000);
        
        //$("#query").val("");
        $("#query").focus();
    }
    
});


