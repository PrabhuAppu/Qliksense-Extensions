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
//"../extensions/VAssistant/js/materialize.min" 
], function (qlik) {

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

});

