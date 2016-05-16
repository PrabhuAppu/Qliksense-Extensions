define([
	"jquery",
	"qlik",
	"./Qliksense-Container-properties",
	"text!./css/font-awesome.css",
	"text!./Container.css",
	"text!./css/normalize.css",
	"text!./css/demo.css",
	"text!./css/tabs.css",
	"text!./css/tabstyles.css",
	"./js/modernizr.custom",
	"./js/bootstrap.min",
	"./js/cbpFWTabs"
	],
	function ($,
		qlik,
		properties,
		fontawesome,
		cssContent,
		normalize,
		demo,
		tabs,
		tabstyles,
		mod,
		cbpFWTabs
	) {
		'use strict';
		$("<style>").html(fontawesome).appendTo("head");

		$("<style>").html(normalize).appendTo("head");
		$("<style>").html(demo).appendTo("head");
		$("<style>").html(tabs).appendTo("head");
		$("<style>").html(tabstyles).appendTo("head");

		$("<style>").html(cssContent).appendTo("head");
		return {
			initialProperties: {
				version: 1.0,
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 10,
						qHeight: 1
					}]
				}
			},
			definition: properties,
			snapshot: {
				canTakeSnapshot: true
			},
			paint: function ($element, layout) {
				var self = this,
					w = $element.width(),
					h = $element.height() - 50,
					html = '',
					qData = layout.qHyperCube.qDataPages[0],
					matrix = qData.qMatrix;
				
				var style = layout.ObjectNames;
				var id = layout.qInfo.qId;
				var TabNumber = [].slice.call(document.querySelectorAll('.list')).length;
				var ObjectCount = layout.listItemsParent.length;

				if (ObjectCount > 0) {

					//if ($element[0].children.length === 0 || TabNumber != ObjectCount) {

						html = '<section id="' + id + '" styleName="' + style + '">' +
							'	<div class="tabs tabs-style-' + style + '">' +
							'		<nav class="navTabs">' +
							'			<ul class="mainListTab">' +
							'			</ul>' +
							'		</nav>' +
							'		<div class="content-wrap mainListContent">' +
							'		</div>' +
							'	</div>' +
							'</section>';

						var app = qlik.currApp();
						var tab = '';
						var Content = "";
						for (var i = 0; i < layout.listItemsParent.length; i++) {
							var charttype = '';
							var title = "";
							app.getObjectProperties(layout.listItemsParent[i].props.obj.id).then(function (model) {
								console.log("sghasgjs", model.properties.qMetaDef.title);
								var chart = model.properties.visualization;
								title = model.properties.qMetaDef.title;
								charttype = chart == 'combochart' ? 'fa-line-chart' :
									chart == 'linechart' ? 'fa-line-chart' :
										chart == 'barchart' ? 'fa-bar-chart' :
											chart == 'scatterplot' ? 'fa-line-chart' :
												chart == 'scatterplot' ? 'fa-pie-chart' :
													chart == 'table' ? 'fa-table' : 'fa-picture-o';
							});

							tab = tab + '<li class="list"><a id="anchor' + i + '" href="#section-' + style + '-' + (i + 1) + '" class=""><span class="fa ' + charttype + '"></span> ' +
								(style == 'shape' ? i == 0 ? '<svg viewBox="0 0 80 60" preserveAspectRatio="none"><use xlink:href="#tabshape"></use></svg>' : '<svg viewBox="0 0 80 60" preserveAspectRatio="none"><use xlink:href="#tabshape"></use></svg><svg viewBox="0 0 80 60" preserveAspectRatio="none"><use xlink:href="#tabshape"></use></svg>' : '') +
								'<span>' + layout.listItemsParent[i].props.title + '</span></a></li>';
							Content = Content + '<section id="section-' + style + '-' + (i + 1) + '" objId ="' + layout.listItemsParent[i].props.obj + '" containerId="QV0' + (i + 1) + '"><div id="QV0' + (i + 1) + '" style=" width: 100%; height: ' + h + 'px;" class="qvobject"></div></section>';
						}
						$element.html(html);
						console.log($element);
						$('.mainListTab').html(tab);
						$('.mainListContent').html(Content);
					//}

					[].slice.call(document.querySelectorAll('.tabs')).forEach(function (el) {
						new CBPFWTabs(el, {"app": app});
					});

				} else {
					var currentClass = 'tabs-style-' + ($('#' + id).attr('styleName'));
					var newClass = 'tabs-style-' + style;

					$('.tabs').removeClass(currentClass);
					$('.tabs').addClass(newClass);
					for (var i = 0; i < layout.listItemsParent.length; i++) {
						var currentId = 'section-' + ($('#' + id).attr('styleName')) + '-' + (i + 1);
						var newId = 'section-' + style + '-' + (i + 1);
						$('#' + currentId).attr("id", newId);
						$('#anchor' + i).attr('href', '#section-' + style + '-' + (i + 1));
					}
					$('#' + id).attr('styleName', style);
				}
			}
		};
	});
