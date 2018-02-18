/**
 * @summary Container object for Qliksense
 * 
 * @owner Prabhu Appu
 * 
 * @GitHub_Source https://github.com/PrabhuAppu/Qliksense-Extensions/tree/master/Qliksense-Container
 *  
 */
define([
	'jquery',
	'underscore',
	'qlik',
	'ng!$q',
	'ng!$http'
], function ($, _, qlik, $q, $http) {
	'use strict';
	// *****************************************************************************
	// Dimensions & Measures
	// *****************************************************************************
	var dimensions = {
		uses: "dimensions",
		min: 0,
		max: 0
	};
	var measures = {
		uses: "measures",
		min: 0,
		max: 0
	};

	var app = qlik.currApp();
	var getObjectList = function () {

		var defer = $q.defer();

		app.getAppObjectList('masterobject', function (data) {
			console.log(data);
			var sheets = [];
			var sortedData = _.sortBy(data.qAppObjectList.qItems, function (item) {
				return item.qData.rank;
			});
			_.each(sortedData, function (item) {
				sheets.push({
					value: item.qInfo.qId,
					//value: {"id": item.qInfo.qId, "title": item.qMeta.title},
					label: item.qMeta.title
				});
			});
			return defer.resolve(sheets);
		});



		return defer.promise;

	};



	var ObjectList = {
		type: "array",
		ref: "listItemsParent",
		label: "Objects",
		itemTitleRef: "grpLabel",
		allowAdd: true,
		allowRemove: true,
		addTranslation: "Add Item",
		items: {
			List: {
				type: "string",
				component: "dropdown",
				label: "Object",
				ref: "props.obj",
				options: function () {
					return getObjectList().then(function (items) {
						return items;
					});
				}/*,
				defaultValue:function () {
					return getObjectList().then(function (items) {
						//alert(items[0].value)
						return items[0].value;
					});
				}*/
			},
			title: {
				type: "string",
				label: "Title",
				ref: "props.title",
				expression: "optional"
			}
		}
	}

	// *****************************************************************************
	// Appearance section
	// *****************************************************************************

	var MyDropdownProp = {
		type: "string",
		component: "dropdown",
		label: "Style",
		ref: "ObjectNames",
		options: [{ value: 'bar', label: 'bar' },
			{ value: 'iconbox', label: 'iconbox' },
			{ value: 'underline', label: 'underline' },
			{ value: 'linetriangle', label: 'linetriangle' },
			{ value: 'topline', label: 'topline' },
			{ value: 'iconfall', label: 'small line' },
			//{ value: 'linemove', label: 'linemove' },
			{ value: 'line', label: 'line' },
			{ value: 'flip', label: 'flip' },
			{ value: 'tzoid', label: 'tzoid' },
			{ value: 'fillup', label: 'fillup' }
		],
		defaultValue: "bar"
	};

	var appearanceSection = {
		uses: "settings",
		label: "Appearance",
		items: {
			MyDropdownProp: MyDropdownProp,
		}
	};



	// *****************************************************************************
	// Main properties panel definition
	// Only what is defined here is returned from properties.js
	// *****************************************************************************
	return {
		type: "items",
		component: "accordion",
		items: {
			ObjectList: ObjectList,
			//Object: measures,
			appearance: appearanceSection
		}
	};
});
