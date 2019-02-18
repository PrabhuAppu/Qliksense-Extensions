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
define(['jquery'], function ($) {
    'use strict';
    
    // *****************************************************************************
    // Custome Components
    // *****************************************************************************
    
   
    
    // *****************************************************************************
    // Dimensions & Measures
    // *****************************************************************************
	
    var palette = [
        "#b0afae",
        "#7b7a78",
        "#545352",
        "#4477aa",
        "#7db8da",
        "#b6d7ea",
        "#46c646",
        "#f93f17",
        "#ffcf02",
        "#276e27",
        "#ffffff",
        "#000000"
    ];

    var dimensions = {
        uses: "dimensions",
        min: 0,
        max: 5,
        
    };
    var measures = {
        uses: "measures",
        min: 0,
        max: 7,
        
    };
    // *****************************************************************************
    // Appearance section
    // *****************************************************************************
	
    // *****************************************************************************
    // Main properties panel definition
    // Only what is defined here is returned from properties.js
    // *****************************************************************************
    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: dimensions,
            measures: measures,
            
            sorting: {
                uses: "sorting"
            },
            settings: {
                uses: "settings"
            }
        }
    };
});
 
 /*
 
 isPivot: {
                type: 'boolean',
                expression: 'optional',
                ref: 'qDef.isPivot',
                label: 'Enable Pivoting'
            },
            Grouping: {
                type: 'boolean',
                component: "switch",
                ref: 'qDef.GroupingEnabled',
                label: 'Enable Pivoting',
                options: [{
                    value: true,
                    label: "On"
                }, {
                        value: false,
                        label: "Not On"
                    }],
                defaultValue: false
            },
            GroupName: {
                type: 'array',
                component: GroupComponent,
                ref: 'qDef.GroupName',
                label: 'Group Name',
                show: function (a) {
                    return a.qDef.GroupingEnabled;
                }
            },
            Color: {
                type: 'string',
                ref: 'qDef.HeaderColor',
                label: 'Header Color',
                defaultValue: '#252525'
            },
            GroupColor: {
                type: 'string',
                ref: 'qDef.GroupColor',
                label: 'Group Color',
                defaultValue: '#252525',
                show: function (a) {
                    return a.qDef.GroupingEnabled;
                }
            },
            Alignment: {
                type: 'string',
                ref: 'qDef.Align',
                label: 'Group Color',
                defaultValue: 'right',
                component: 'buttongroup',
                options: [{
                    value: 'left',
                    label: "Left"
                    },
                    {
                        value: 'center',
                        label: "Center"
                    },
                    {
                        value: 'right',
                        label: "Right"
                    }],
            }*/