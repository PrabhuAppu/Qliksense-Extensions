var internal = false;
define(["jquery","underscore","qlik","qvangular","angular","./properties","./initialproperties","client.utils/state","./lib/js/extensionUtils","./lib/external/Sortable/Sortable","css!./lib/css/style.css","text!./lib/partials/customreport.ng.html","./lib/js/perfect-scrollbar.min","./lib/js/perfect-scrollbar.jquery.min","text!./lib/css/perfect-scrollbar.min.css","./lib/js/directives/onLastRepeatDirective","client.services/export-dialog/export-dialog"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){
        "use strict";
        
        var app = c.currApp(this);
        console.log(app);
        i.addStyleToHeader(k),i.addStyleToHeader(o);var p=e.injector(["ng"]),q=p.get("$q");return{definition:f,initialProperties:g,snapshot:{canTakeSnapshot:!1},support:{"export":!1},resize:function(a,b){this.paint(a,b)},paint:function(a,b){this.$scope.size.clientHeight=a.height(),this.$scope.size.clientWidth=a.width(),this.$scope.qId=b.qInfo.qId,this.$scope.handleResize(a,b.props.allowCollapse),a.find("#dimensionSortable").perfectScrollbar(),a.find("#measureSortable").perfectScrollbar()},template:l,controller:["$scope","$element",function(e,f){function g(){l.getList("MeasureList",function(a){e.data.masterMeasures=a.qMeasureList}),l.getList("DimensionList",function(a){e.data.masterDimensions=a.qDimensionList})}function i(){var a=q.defer();return l.getAppObjectList("masterobject",function(c){e.data.tableList=b.sortBy(b.reduce(c.qAppObjectList.qItems,function(a,c){return("table"===c.qData.visualization||"pivot-table"===c.qData.visualization)&&("All tables"===e.data.tag?a.push(c):b.each(c.qMeta.tags,function(b){b===e.data.tag&&a.push(c)})),a},[]),function(a){return a.qMeta.title}),a.resolve(!0)}),a.promise}e.size={clientHeight:-1,clientWidth:-1},e.qId=-1,e.fieldsAndSortbarVisible=!0,e.collapsed=!1,e.rainText=!1,e.minWidthCollapsed=200,e.minHeightCollapsed=200,e.data={tag:null,tagColor:!0,sortOrder:"SortByA",activeTable:null,displayText:"Custom Report",tableList:[],masterDimensions:[],masterMeasures:[]},e.report={tableID:"",title:null,supressZero:!1,report:[],state:[],dimensions:[],measures:[],interColumnSortOrder:[]};var k=function(a){a.preventDefault(),a.stopPropagation()};e.reportConfig={group:{name:"report",put:["dim","measure"]},animation:150,ghostClass:"ghost",onStart:function(){a("body").on("dragstart",".qv-panel-wrap",k),a("body").on("dragover",".qv-panel-wrap",k)},onEnd:function(){a("body").off("dragstart",".qv-panel-wrap",k),a("body").off("dragover",".qv-panel-wrap",k)},onSort:function(a){e.report.state.splice(a.newIndex,0,e.report.state.splice(a.oldIndex,1)[0]),e.updateTable()}};var l=c.currApp(e.ext);"App"!==l.model.constructor.name&&(l=c.currApp());var m=e.$parent.layout.qExtendsId?e.$parent.layout.qExtendsId:e.$parent.layout.qInfo.qId;m="Climber Custom Report - "+m,e.handleResize=function(a,b){a.height()<e.minHeightCollapsed||a.width()<e.minWidthCollapsed?!e.collapsed&&b&&(e.collapsed=!0,e.updateTable()):e.collapsed&&(e.collapsed=!1,e.updateTable())},e.clearTable=function(){e.report.state=[]},e.sortDimensionsAndMeasuresListsBy=function(a){"SortByA"===e.data.sortOrder?e.data.sortOrderAlphabetical=!0:"SortByTableOrder"===a&&(e.data.sortOrderAlphabetical=!1)},e.loadTable=function(a){var c=q.defer();return e.clearTable(),a&&a.qInfo?(e.data.activeTable=a,setTimeout(function(){l.getObjectProperties(a.qInfo.qId).then(function(a){e.report.title=a.properties.title,e.report.supressZero=a.properties.qHyperCubeDef.qSuppressZero;var d=-1,f=b.map(a._properties.qHyperCubeDef.qDimensions,function(a){if(d+=1,a.qLibraryId){var c=b.find(e.data.masterDimensions.qItems,function(b){return b.qInfo.qId===a.qLibraryId}),f=a;return f.qType="dimension",{title:c.qMeta.title,description:c.qMeta.description,columnOptions:f,type:"dimension",selected:!1,dataId:d}}return{title:""===a.qDef.qFieldLabels[0]?a.qDef.qFieldDefs[0]:a.qDef.qFieldLabels[0],description:"",columnOptions:a,type:"dimension",selected:!1,dataId:d}});e.report.dimensions=f;var g=b.map(a._properties.qHyperCubeDef.qMeasures,function(a){if(d+=1,a.qLibraryId){var c=b.find(e.data.masterMeasures.qItems,function(b){return b.qInfo.qId===a.qLibraryId}),f=a;return f.qType="measure",{title:c.qMeta.title,description:c.qMeta.description,columnOptions:f,type:"measure",selected:!1,dataId:d}}return{title:a.qDef.qLabel?a.qDef.qLabel:a.qDef.qDef,description:"",columnOptions:a,type:"measure",selected:!1,dataId:d}});e.report.measures=g,"SortByA"===e.report.sortOrder&&e.sortDimensionsAndMeasuresLists("SortByA"),c.resolve(!0)})},500)):c.resolve(!1),c.promise},e.hideRain=function(){a(f).find(".rain-"+e.qId).hide(),e.rainText=!1},e.showRain=function(b){e.rainText={text:b},a(f).find(".rain-"+e.qId).show()},
        
        e.createTable=function(){
            var a=q.defer();
            //e.data.activeTable.qData.visualization
            return l.visualization.create(e.data.activeTable.qData.visualization,[],{
                title:""===e.report.title?e.data.activeTable.qMeta.title:e.report.title,
                "totals":{"show":false}
                }).then(function(b){e.report.tableID=b.id,e.hideRain(),b.show("customreporttable-id-"+e.qId),a.resolve(!0)}),a.promise},e.getDefaultTableAndItems=function(){var a,b;return null===e.data.activeTable&&e.data.tableList&&e.data.tableList.length>0&&(void 0!==e.data.defaultTable&&""!==e.data.defaultTable?(a=e.getTableWithTitle(e.data.defaultTable),b=e.data.defaultItems):a=e.data.tableList[0]),{table:a,items:b}},
        
        e.getStateFromDefaultItems=function(a){
            var c={};if(a&&0!==a.length){var d=[];return b.each(a,function(a){b.find(e.report.dimensions,function(b){b.title===a&&d.push(b.dataId)}),b.find(e.report.measures,function(b){b.title===a&&d.push(b.dataId)})}),d.length>0&&(c={itemIds:d}),c}
            return c
        },
        e.changeTable=function(a, fromManual){
                var c;if(!a){
                        var d=e.getDefaultTableAndItems();
                        a=d.table,
                        c=d.items
                    }
                    if(b.isString(a)&&(a=e.getTableWithId(a)),a&&a.qInfo){var f={};e.showRain("Loading table"),e.loadTable(a).then(
                function(){if(c)f=e.getStateFromDefaultItems(c);
                else{
                    
                    var b=JSON.parse(localStorage.getItem(m));
                    if(!fromManual){
                    b&&b.states&&(f=b.states[a.qInfo.qId],f&&(e.report.interColumnSortOrder=f.qInterColumnSortOrder?f.qInterColumnSortOrder:[]))
                    }else{
                    b&&b.states&&(f=b.states[a.qInfo.qId],f&&(e.report.interColumnSortOrder=[]))
                    f.itemIds = [];
                    f.interColumnSortOrder = [];
                    }
                    }
                    e.createTable().then(function(){e.applyReportState(f),e.updateTable()})})}
        },e.getInterColumnSortOrder=function(){var a=q.defer();return 0===e.report.interColumnSortOrder.length?l.getObject(e.report.tableID).then(function(c){c.getEffectiveProperties().then(function(c){var d=c.qHyperCubeDef.qDimensions.length,f=[];b.each(c.qHyperCubeDef.qInterColumnSortOrder,function(a){var b;a>=d?(b={dataId:c.qHyperCubeDef.qMeasures[a-d].dataId,type:"measure"},b.qSortBy=c.qHyperCubeDef.qMeasures[a-d].qSortBy,c.qHyperCubeDef.qMeasures[a-d].qDef.qReverseSort&&(b.qReverseSort=!0),f.push(b)):(b={dataId:c.qHyperCubeDef.qDimensions[a].dataId,type:"dimension"},c.qHyperCubeDef.qDimensions[a].qDef.qReverseSort&&(b.qReverseSort=!0),f.push(b))}),e.report.interColumnSortOrder=f,a.resolve(!0)})}):a.resolve(!0),a.promise},e.applyReportState=function(a){var c=q.defer(),d=[];return a&&a.itemIds&&b.each(a.itemIds,function(a){var b=e.report.dimensions.map(function(a){return a.dataId}).indexOf(a);b>-1?(e.report.dimensions[b].selected=!0,d.push(e.report.dimensions[b])):(b=e.report.measures.map(function(a){return a.dataId}).indexOf(a),b>-1&&(e.report.measures[b].selected=!0,d.push(e.report.measures[b])))}),e.report.state=d,c.resolve(!0),c.promise},e.applyPatchesToTable=function(a,b){l.getObject(a).then(function(a){a.clearSoftPatches(),b&&a.applyPatches(b,!0),e.serializeReport()})},e.updateTable=function(){
            if(""!==e.report.tableID){if(0===e.report.state.length)e.report.interColumnSortOrder=[],
            e.applyPatchesToTable(e.report.tableID);
            else{
                var a=e.report.supressZero?!0:!1,c=b.reduce(e.report.state,
                function(a,b){
                    return"dimension"===b.type&&(b.columnOptions.dataId=b.dataId,a.push(b.columnOptions)),a
                },[]),
                d=b.reduce(e.report.state,function(a,b){return"measure"===b.type&&(b.columnOptions.dataId=b.dataId,a.push(b.columnOptions)),a},[]),
                f=[],g=0,h=0;
                b.each(e.report.state,function(a){"measure"===a.type?(f.push(c.length+g),g+=1):(f.push(h),h+=1)});
                
                for(var i=[],j=0;j<e.report.state.length;j++)i.push(-1);
                e.getInterColumnSortOrder().then(function(){var g=[];if(b.each(e.report.interColumnSortOrder,function(a){var b;"measure"===a.type?(b=d.map(function(a){return a.dataId}).indexOf(a.dataId),b>-1&&(g.push(b+h),d[b].qSortBy=a.qSortBy,a.qReverseSort&&(d[b].qDef.autoSort=!1,d[b].qDef.qReverseSort=a.qReverseSort))):(b=c.map(function(a){return a.dataId}).indexOf(a.dataId),b>-1&&(g.push(b),a.qReverseSort&&(c[b].qDef.autoSort=!1,c[b].qDef.qReverseSort=a.qReverseSort)))}),g.length!==f.length){
                    var j=b.difference(f,g);b.each(j,function(a){g.push(a)})}
                    var k=[
                    {qOp:"replace",qPath:"qHyperCubeDef/qDimensions",qValue:JSON.stringify(c)},
                    {qOp:"replace",qPath:"qHyperCubeDef/qMeasures",qValue:JSON.stringify(d)},
                    {qOp:"replace",qPath:"qHyperCubeDef/columnOrder",qValue:JSON.stringify(f)},
                    {qOp:"replace",qPath:"qHyperCubeDef/columnWidths",qValue:JSON.stringify(i)},
                    {qOp:"replace",qPath:"qHyperCubeDef/qSuppressZero",qValue:JSON.stringify(a)},
                    {qOp:"replace",qPath:"qHyperCubeDef/qInterColumnSortOrder",qValue:JSON.stringify(g)}
                   // {qOp:"replace",qPath:"qHyperCubeDef/qNoOfLeftDims",qValue:'2'},
                    //{qOp:"replace",qPath:"qHyperCubeDef/qMode",qValue:'S'}
                    ];

                e.applyPatchesToTable(e.report.tableID,k)})
}e.hideRain()}

},

e.selectItem=function(a, fromManual){
        
        var b=e.report.state.map(function(a){return a.dataId}).indexOf(a.dataId);
        b>-1?(a.selected=!1,e.report.state.splice(b,1)):(a.selected=!0,e.report.state.push(a)),e.updateTable()
        if(fromManual){
                var selected = [{
                        "chart": e.report.title,
                        "dimension": [],
                        "measure": []
                }];
                e.report.state.forEach(function(elem){
                        if(elem.type=='dimension'){
                                selected[0].dimension.push(elem.title);
                        }else if(elem.type=='measure'){
                                selected[0].measure.push(elem.title);
                        }
                });
                internal = true;
                app.variable.setContent(e.$parent.layout.props.variableName,JSON.stringify(selected));
                setTimeout(function(){
                    internal = false;
                }, 1000)
        }

},e.clearAll=function(){
        b.each(e.report.dimensions,function(a){a.selected=!1}),b.each(e.report.measures,function(a){a.selected=!1}),e.clearTable()
        console.log(e,'afterClear');
}
        ,e.removeItem=function(a){
                e.report.state=b.without(e.report.state,a);var c;"measure"===a.type?(c=e.report.measures.map(function(a){return a.dataId}).indexOf(a.dataId),e.report.measures[c].selected=!1):(c=e.report.dimensions.map(function(a){return a.dataId}).indexOf(a.dataId),e.report.dimensions[c].selected=!1),e.updateTable()

                var selected = [{
                        "chart": e.report.title,
                        "dimension": [],
                        "measure": []
                }];
                e.report.state.forEach(function(elem){
                        if(elem.type=='dimension'){
                                selected[0].dimension.push(elem.title);
                        }else if(elem.type=='measure'){
                                selected[0].measure.push(elem.title);
                        }
                });
                internal = true;
                app.variable.setContent(e.$parent.layout.props.variableName,JSON.stringify(selected));
                setTimeout(function(){
                    internal = false;
                }, 1000)

        },e.exportData=function(){e.report.state.length>0&&l.getObject(null,e.report.tableID).then(function(a){d.getService("$exportDialog").show(a)})},e.serializeReport=function(){var a=q.defer(),c=JSON.parse(localStorage.getItem(m));(null===c||void 0===c||void 0===c.states)&&(c={activeTableId:"",states:{}});var d=[];return b.each(e.report.state,function(a){d.push(a.dataId)}),e.getInterColumnSortOrder().then(function(){var b={qId:e.data.activeTable.qInfo.qId,itemIds:d,qInterColumnSortOrder:e.report.interColumnSortOrder};c.activeTableId=b.qId,c.fieldsAndSortbarVisible=e.fieldsAndSortbarVisible,c.states[b.qId]=b,e.report.interColumnSortOrder=[],localStorage.setItem(m,JSON.stringify(c)),a.resolve(!0)})["catch"](function(){localStorage.setItem(m,JSON.stringify(c)),a.resolve(!1)}),a.promise},e.deserializeReport=function(){var a=JSON.parse(localStorage.getItem(m));e.fieldsAndSortbarVisible=a&&a.fieldsAndSortbarVisible===!1?!1:!0;var b=a&&a.activeTableId?a.activeTableId:!1;e.changeTable(b)},e.getTableWithTitle=function(a){var c=b.find(e.data.tableList,function(b){return b.qMeta.title===a});return c},e.getTableWithId=function(a){var c=b.find(e.data.tableList,function(b){return b.qInfo.qId===a});return c},e.applyDefaultTableAndItems=function(){e.data.activeTable=null,e.changeTable()},e.$on("onRepeatLast",function(a,b,c){"dimension"===c.onLastRepeat?f.find("#dimensionSortable").perfectScrollbar("update"):"measure"===c.onLastRepeat&&f.find("#measureSortable").perfectScrollbar("update")}),e.$watch("layout.props.tagSetting",function(a){e.data.tag=a,i()}),e.$watch("layout.props.defaultTable",function(a){e.data.defaultTable=a}),e.$watch("layout.props.defaultItems",function(a){e.data.defaultItems=a?a.split(","):[]}),e.$watch("layout.props.tagColor",function(a){e.data.tagColor=a}),e.$watch("layout.props.collapseMinWidth",function(a){e.minWidthCollapsed=a}),e.$watch("layout.props.collapseMinHeight",function(a){e.minHeightCollapsed=a}),e.$watch("layout.props.displayText",function(a){e.data.displayText=a}),e.$watch("layout.props.hideExportIcon",function(a){e.data.hideExportIcon=a}),e.$watch("layout.props.hideExpandIcon",function(a){e.data.hideExpandIcon=a}),e.$watch("layout.props.dimensionSortOrder",function(a){e.data.sortOrder=a,e.sortDimensionsAndMeasuresListsBy(a)}),e.getClass=function(){return h.isInAnalysisMode()?"":"no-interactions"},e.hideFieldAndSortbar=function(){e.fieldsAndSortbarVisible=!1,e.updateTable()},e.showFieldAndSortbar=function(){e.fieldsAndSortbarVisible=!0,e.updateTable()},e.hideSetDefaultStateIcon=function(){return void 0===e.data.defaultTable||""===e.data.defaultTable},e.getListMaxHeight=function(a){var b=44.5,c=e.report.dimensions.length,d=e.report.measures.length,f=140,g=(e.size.clientHeight-f)/2,h=b*c>g?0:g-b*c,i=b*d>g?0:g-b*d;return c>0?"dimension"===a?{"max-height":g+i+"px"}:{"max-height":g+h+"px"}:{height:g+"px"}},e.noSelections=function(){var a,c;return b.each(e.report.state,function(b){"measure"===b.type?a=!0:"","dimension"===b.type?c=!0:""}),!c&&!e.rainText||a&&!c},e.getTableHeight=function(){var b=60;a("#reportSortable-"+e.qId).height();var c=a("#reportSortable-"+e.qId).height();return e.fieldsAndSortbarVisible?{height:e.size.clientHeight-b-c+"px","padding-top":"18px"}:{height:e.size.clientHeight+"px"}},e.getContainerWidth=function(a){var b=210,c={};return c="left"===a?b:e.fieldsAndSortbarVisible?e.size.clientWidth-b-4:e.size.clientWidth,{width:c+"px"}};var n=1===f.closest(".qv-gridcell").length;n||f.on("contextmenu",function(a){e.showMashupContextMenu(a)}),e.showMashupContextMenu=function(a){if(!a.ctrlKey&&!a.metaKey||!a.shiftKey){a.stopPropagation(),a.preventDefault();var b=d.getService("qvContextMenu"),c=b.menu();c=e.addItemsToContextMenu(c),c=e.addExportItemToContextMenu(c),b.show(c,{position:{x:a.pageX,y:a.pageY}})}},e.addItemsToContextMenu=function(a){e.collapsed||a.addItem(e.fieldsAndSortbarVisible?{translation:"Hide fields/sortbar",tid:"Expand",icon:"maximize icon-maximize",select:function(){e.hideFieldAndSortbar()}}:{translation:"Show fields/sortbar",tid:"Collapse",icon:"minimize icon-minimize",select:function(){e.showFieldAndSortbar()}});var c=b.countBy(e.report.state,"type"),d=c.dimension?e.report.dimensions.length-c.dimension:e.report.dimensions.length,f=c.measure?e.report.measures.length-c.measure:e.report.measures.length;if(d||f){var g=a.addItem({translation:"Add fields",tid:"add-submenu",icon:"add icon-add"});if(d){var h=g.addItem({translation:"Add dimension",tid:"add-dimension-submenu",icon:"add icon-add"});b.each(e.report.dimensions,function(a){a.selected||h.addItem({translation:a.title,tid:"dimension",select:function(){e.selectItem(a, true)}})})}if(f){var i=g.addItem({translation:"Add measure",tid:"add-measure-submenu",icon:"add icon-add"});b.each(e.report.measures,function(a){a.selected||i.addItem({translation:a.title,tid:"switch",select:function(){e.selectItem(a, true)}})})}}if(c.dimension||c.measure){var j=a.addItem({translation:"Remove fields",tid:"remove-submenu",icon:"remove icon-remove"});if(c.dimension){var k=j.addItem({translation:"Remove dimension",tid:"remove-dimension-submenu",icon:"remove icon-remove"});b.each(e.report.dimensions,function(a){a.selected&&k.addItem({translation:a.title,tid:"dimension",select:function(){e.removeItem(a)}})})}if(c.measure){var l=j.addItem({translation:"Remove measure",tid:"remove-measure-submenu",icon:"remove icon-remove"});b.each(e.report.measures,function(a){a.selected&&l.addItem({translation:a.title,tid:"switch",select:function(){e.removeItem(a)}})})}}if(e.data.tableList.length>1){var m=a.addItem({translation:"Switch table",tid:"switch-submenu",icon:"cogwheel icon-cogwheel"});b.each(e.data.tableList,function(a){a.qInfo.qId!==e.data.activeTable.qInfo.qId&&m.addItem({translation:a.qMeta.title,tid:"switch",icon:"table icon-table",select:function(){e.data.activeTable=a,e.changeTable(a)}})})}return a},e.addExportItemToContextMenu=function(a){return a.addItem({translation:"contextMenu.export",tid:"export",icon:"toolbar-sharelist icon-toolbar-sharelist",select:function(){e.exportData("exportToExcel")}}),a},g(),i().then(function(){var b=document.getElementById("reportSortable-"+e.qId);j.create(b,e.reportConfig),e.deserializeReport(),a(f).find(".rain-"+e.qId).hide()})
            
        var set = function(){
                //console.log(selState);
                //app.variable.getContent('vClimber.Selected',function ( reply ) {
                // alert( JSON.stringify( reply ) );
                var tabletitle = null;
                console.log(e.$parent.layout.props.selectedItem)
                var selectedItem = e.$parent.layout.props.selectedItem
                console.log(JSON.parse(selectedItem))
                var dataReport = JSON.parse(selectedItem)
                if(e.report.title != dataReport[0]['chart']){
                        e.data.tableList.forEach(function(elem){
                                if(elem.qMeta.title==dataReport[0]['chart']){
                                    
                                        e.changeTable(elem);
                                        tabletitle = elem;
                                }
                        })
                }
                // alert(dataReport[0]['dimension'])
                // alert(dataReport[0]['measure'])
                dataReport[0]['dimension'].forEach(function(elem){
                        e.report.dimensions.forEach(function(dims){  
                                
                                var b=e.report.state.map(function(a){return a.dataId}).indexOf(dims.dataId);
                                
                                if(dims.title == elem && b<0){
                                        e.selectItem(dims); 
                                }else if(dims.title != elem && b>-1 && !(dataReport[0]['dimension'].indexOf(dims.title)>-1)){
                                        e.selectItem(dims); 
                                }
                        });
                });
                dataReport[0]['measure'].forEach(function(elem){
                        e.report.measures.forEach(function(meas){   
                                var b=e.report.state.map(function(a){return a.dataId}).indexOf(meas.dataId);
                                if(meas.title == elem && b<0){
                                        e.selectItem(meas); 
                                }else if(meas.title != elem && b>-1 && !(dataReport[0]['measure'].indexOf(meas.title)>-1)){
                                        e.selectItem(meas); 
                                }
                        });
                });
               // e.changeTable(tabletitle);
               // e.updateTable();
               // internal = true;
                console.log(e);
               // });
        }
       
 e.component.model.Validated.bind( function () {
         if(!internal){
            console.info( 'Validated' );
            set()
            setTimeout(function(){
                    set()
            }, 1000)
            
            //set()
         }
    } );



}],getExportRawDataOptions:function(b,c,d){var e=c.id,f=a("#cl-customreport-container-"+e).scope();return f.addExportItemToContextMenu(b),void d.resolve()},getContextMenu:function(b,c){var d=b.layout.qInfo.qId,e=a("#cl-customreport-container-"+d).scope();return e.addItemsToContextMenu(c)}}});