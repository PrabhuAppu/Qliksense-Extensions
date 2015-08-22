/**
 * @owner Erik Wetterberg (ewg)
 */
 
 define( [], function () {
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
		max: 10
	};
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
			Object: measures,
			appearance: appearanceSection
		}
	};
});
