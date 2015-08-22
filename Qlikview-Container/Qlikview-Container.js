define(["jquery",
"qlik",
"./Qlikview-Container-properties", 
"text!./css/font-awesome.css", 
"text!./Container.css", 
"text!./css/normalize.css", 
"text!./css/demo.css", 
"text!./css/tabs.css", 
"text!./css/tabstyles.css", 
"./js/modernizr.custom",
"./js/bootstrap.min"], 
function($, 
		qlik,
		properties, 
		fontawesome,
		cssContent,
		normalize,
		demo,
		tabs,
		tabstyles,
		mod
		) {
	'use strict';
	$("<style>").html(fontawesome).appendTo("head");
	
    $("<style>").html(normalize).appendTo("head");
	$("<style>").html(demo).appendTo("head");
	$("<style>").html(tabs).appendTo("head");
	$("<style>").html(tabstyles).appendTo("head");
	
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 1
				}]
			}
		},
		definition : properties,
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element, layout) {
			var self = this, 
				w = $element.width(), 
				h = $element.height()-50, 
				html = '',
				qData = layout.qHyperCube.qDataPages[0],
				matrix = qData.qMatrix;
				//vmax = (measures && measures[0]) ? measures[0].qMax * 1.5 : 1;
			//console.log('children1',$element[0].children.length);
			var style = layout.ObjectNames;
			var id="prabhu";
			var TabNumber = [].slice.call( document.querySelectorAll( '.list' ) ).length;
			var MeasureNumber =matrix[0].length;
			//console.log('asas',matrix[0].length);
			if ($element[0].children.length === 0 || TabNumber != MeasureNumber) {

			html = '<section id="'+id+'" styleName="'+style+'">'+
			'	<div class="tabs tabs-style-'+style+'">'+
			'		<nav class="navTabs">'+
			'			<ul class="mainListTab">'+
			'			</ul>'+
			'		</nav>'+
			'		<div class="content-wrap mainListContent">'+
			'		</div>'+
			'	</div>'+
			'</section>';
			
			var app = qlik.currApp();
			var tab ='';
			var Content="";
			for(var i=0;i<matrix[0].length;i++){
				////console.log(i);
				var charttype='';
				app.getObjectProperties(matrix[0][i].qText).then(function(model){
					var chart = model.properties.visualization;
					charttype = chart=='combochart'?'fa-line-chart':
								chart=='linechart'?'fa-line-chart':
								chart=='barchart'?'fa-bar-chart':
								chart=='scatterplot'?'fa-line-chart':
								chart=='scatterplot'?'fa-pie-chart':
								chart=='table'?'fa-table':'fa-picture-o';
					console.log(charttype);
				});	
			
				tab = tab + '<li class="list"><a id="anchor'+i+'" href="#section-'+style+'-'+(i+1)+'" class=""><span class="fa '+charttype+'"></span> '+
				(style=='shape'?i==0?'<svg viewBox="0 0 80 60" preserveAspectRatio="none"><use xlink:href="#tabshape"></use></svg>':'<svg viewBox="0 0 80 60" preserveAspectRatio="none"><use xlink:href="#tabshape"></use></svg><svg viewBox="0 0 80 60" preserveAspectRatio="none"><use xlink:href="#tabshape"></use></svg>':'')+
				'<span>'+layout.qHyperCube.qMeasureInfo[i].qFallbackTitle+'</span></a></li>';
				Content = Content + '<section id="section-'+style+'-'+(i+1)+'" objId ="'+matrix[0][i].qText+'" containerId="QV0'+(i+1)+'"><div id="QV0'+(i+1)+'" style=" width: 100%; height: '+h+'px;" class="qvobject"></div></section>';
			}
			$element.html(html);
			console.log($element);
			$('.mainListTab').html(tab);
			$('.mainListContent').html(Content);

( function( window ) {
	
	'use strict';

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function CBPFWTabs( el, options ) {
		//alert("a");
		this.el = el;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
  		this._init();
	}

	CBPFWTabs.prototype.options = {
		start : 0
	};

	CBPFWTabs.prototype._init = function() {
		// tabs elems
		this.tabs = [].slice.call( this.el.querySelectorAll( 'nav > ul > li' ) );
		// content items
		this.items = [].slice.call( this.el.querySelectorAll( '.content-wrap > section' ) );
		// current index
		this.current = -1;
		// show current content item
		this._show();
		// init events
		this._initEvents();
	};

	CBPFWTabs.prototype._initEvents = function() {
		var self = this;
		this.tabs.forEach( function( tab, idx ) {
			tab.addEventListener( 'click', function( ev ) {
				ev.preventDefault();
				
				self._show( idx );
				
				
			} );
		} );
	};

	CBPFWTabs.prototype._show = function( idx ) {
		if( this.current >= 0 ) {
			this.tabs[ this.current ].className = this.items[ this.current ].className = '';
		}
		// change current
		this.current = idx != undefined ? idx : this.options.start >= 0 && this.options.start < this.items.length ? this.options.start : 0;
		this.tabs[ this.current ].className = 'tab-current';
		this.items[ this.current ].className = 'content-current';
		app.getObject(this.items[ this.current ].getAttribute('containerId'),this.items[ this.current ].getAttribute('objId'));
		//alert(this.items[ this.current ].getAttribute('objId'));
		//console.log(this.items[ this.current ].getAttribute('objId'));
		//console.log(this.items[ this.current ].className);
	};

	// add to global namespace
	window.CBPFWTabs = CBPFWTabs;

})( window );

				
				[].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {
					new CBPFWTabs( el );
				});

			}else{
				var currentClass = 'tabs-style-'+($('#'+id).attr('styleName'));
				var newClass = 'tabs-style-'+style;
				
				console.log(currentClass);
				console.log(newClass);
				$('.tabs').removeClass(currentClass);
				$('.tabs').addClass(newClass);
				for(var i=0;i<matrix[0].length;i++){
					var currentId = 'section-'+($('#'+id).attr('styleName'))+'-'+(i+1);
					var newId = 'section-'+style+'-'+(i+1);
					$('#'+currentId).attr("id", newId);
					$('#anchor'+i).attr('href', '#section-'+style+'-'+(i+1));
				}
				$('#'+id).attr('styleName',style);
			}

		}
	};
});
