/******************************************************************************************************************
 * Project Name : Parallel Coordinates Extension
 * Description : A Qliksense Extension for Parallel Coordinates chart. It is created using D3.js library
 * Created By : Prabhu Appu
 * Created On : 11/08/2015
*******************************************************************************************************************/

/*******************History****************************************************************************************
 * Modified Date    Version    Modified By    Short Description
 * 11/08/2015       1.0        Prabhu Appu    Created
*******************************************************************************************************************/
define([
    "js/qlik",
    "jquery",
    "./IMA-CoE-D3Tree-properties",
    "text!./Style.css",
    "./js/d3.min",
    "./js/d3.layout",
    "./js/concept-graph",
    "text!./IntCon.json"
],
    function(qlik, $, properties, cssContent, d3, d3layout, treeC) {
        'use strict';

        // $("<style>").html(baseCss).appendTo("head");

        $("<style>").html(cssContent).appendTo("head");

        return {
            initialProperties: {
                version: 1.0,
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [{
                        qWidth: 10,
                        qHeight: 1000
                    }]
                },
                listItems: [],
                selectionMode: 'QUICK'
            },
            definition: properties,
            snapshot: {
                canTakeSnapshot: true
            },
            paint: function($element, layout) {

                var scope = this.$scope;

                /*var dimensionsInfo = layout.qHyperCube.qDimensionInfo;
                var measuresInfo = layout.qHyperCube.qMeasureInfo;
                var data = layout.qHyperCube.qDataPages[0].qMatrix;
                var w = $element.width();
                var h = $element.height();
                //console.log($('.qv-object-AdvancedPivotTable').height(), $element.width());
                scope.w=$element.width();
                var headers = [];
                var rows = [[]];
                var Groups = [];
            	
           	
               <div class="ui top attached demo menu">
                           <a class="item">
   
                           Menu
                         </a>
                       </div>
                   	
                var MeasuresList =[];
                var DimensionList =[];*/
                //console.log(qlik.currApp().info.Id);

                $element.html(`<div id="categoryHierarchy"></div>`);
                var tree = CollapsibleTree("#categoryHierarchy");
                tree.init('http://localhost:4848/extensions/IMA-CoE-D3Tree/IntCon.json');

                //"http://localhost:4848/extensions/IMA-CoE-NetworkChart/IntCon.json"


                // *****************************************************************************
                // Data Preparation End
                // *****************************************************************************

                // *****************************************************************************
                // Config
                // *****************************************************************************



                // *****************************************************************************
                // Config End
                // *****************************************************************************

            }
        };
    });
