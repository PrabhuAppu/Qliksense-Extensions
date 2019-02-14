var gauge1;
var gauge2;
var gauge3;
var gauge4;
 function fill(){
	// var gauge5 = loadLiquidFillGauge("fillgauge5", 60.44, config4);
	d3.select("#fillgauge1").selectAll('g').remove();
		d3.select("#fillgauge2").selectAll('g').remove();
		d3.select("#fillgauge3").selectAll('g').remove();
		d3.select("#fillgauge4").selectAll('g').remove();
	$('.kpi_fill_1').css('border-bottom-color',colors('1'));
	$('.kpi_fill_2').css('border-bottom-color',colors('2'));
	$('.kpi_fill_3').css('border-bottom-color',colors('3'));
	$('.kpi_fill_4').css('border-bottom-color',colors('4'));
	
	
	$('.kpi_fill_1').css('background-color','rgb(230,230,230)');
	$('.kpi_fill_2').css('background-color','rgb(230,230,230)');
	$('.kpi_fill_3').css('background-color','rgb(230,230,230)');
	$('.kpi_fill_4').css('background-color','rgb(230,230,230)');
	/*$('.kpi_fill_1').css('background-color',d3.rgb(colors('1')).toString());
	$('.kpi_fill_2').css('background-color',d3.rgb(colors('2')).toString());
	$('.kpi_fill_3').css('background-color',d3.rgb(colors('3')).toString());
	$('.kpi_fill_4').css('background-color',d3.rgb(colors('4')).toString());*/
	
	/*$('.kpi_fill_1').css('border-left-color',colors('1'));
	$('.kpi_fill_2').css('border-left-color',colors('2'));
	$('.kpi_fill_3').css('border-left-color',colors('3'));
	$('.kpi_fill_4').css('border-left-color',colors('4'));
	
	/*$('.kpi_fill_1').css('border-color',colors('1'));
	$('.kpi_fill_2').css('border-color',colors('2'));
	$('.kpi_fill_3').css('border-color',colors('3'));
	$('.kpi_fill_4').css('border-color',colors('4'));*/

	
    var config1 = liquidFillGaugeDefaultSettings();
    config1.circleThickness = 0.05;
    config1.circleColor = colors('1');//"#6DA398";
    config1.textColor = "#0E5144";
    config1.waveTextColor = colors('1');//"#6DA398";
    config1.waveColor = colors('1');//"#246D5F";
    config1.textVertPosition = 0.52;
    config1.waveAnimateTime = 0;//5000;
    config1.waveHeight = 0;
    config1.waveAnimate = false;
    config1.waveCount = 3;
    config1.waveOffset = 0.25;
    config1.textSize = 1.2;
    config1.minValue = 0;
    config1.maxValue = 100;
    config1.displayPercent = true;
    gauge1 = loadLiquidFillGauge("fillgauge1", 0, config1);
	
	
    var config2 = liquidFillGaugeDefaultSettings();
    config2.circleThickness = 0.05;
    config2.circleColor = colors('2');//"#6DA398";
    config2.textColor = "#0E5144";
    config2.waveTextColor = colors('2');//"#6DA398";
    config2.waveColor = colors('2');//"#246D5F";
    config2.textVertPosition = 0.52;
    config2.waveAnimateTime = 0;//5000;
    config2.waveHeight = 0;
    config2.waveAnimate = false;
    config2.waveCount = 3;
    config2.waveOffset = 0.25;
    config2.textSize = 1.2;
    config2.minValue = 0;
    config2.maxValue = 100;
    config2.displayPercent = true;
    gauge2 = loadLiquidFillGauge("fillgauge2", 0, config2);

	var config3 = liquidFillGaugeDefaultSettings();
	config3.circleThickness = 0.05;
    config3.circleColor = colors('3');//"#6DA398";
    config3.textColor = "#0E5144";
    config3.waveTextColor = colors('3');//"#6DA398";
    config3.waveColor = colors('3');//"#246D5F";
    config3.textVertPosition = 0.52;
    config3.waveAnimateTime = 0;//5000;
    config3.waveHeight = 0;
    config3.waveAnimate = false;
    config3.waveCount = 3;
    config3.waveOffset = 0.25;
    config3.textSize = 1.2;
    config3.minValue = 0;
    config3.maxValue = 100;
    config3.displayPercent = true;
    gauge3 = loadLiquidFillGauge("fillgauge3", 0, config3);
	
	var config4 = liquidFillGaugeDefaultSettings();
	config4.circleThickness = 0.05;
    config4.circleColor = colors('4');//"#6DA398";
    config4.textColor = "#0E5144";
    config4.waveTextColor = colors('4');//"#6DA398";
    config4.waveColor = colors('4');//"#246D5F";
    config4.textVertPosition = 0.52;
    config4.waveAnimateTime = 0;//5000;
    config4.waveHeight = 0;
    config4.waveAnimate = false;
    config4.waveCount = 3;
    config4.waveOffset = 0.25;
    config4.textSize = 1.2;
    config4.minValue = 0;
    config4.maxValue = 100;
    config4.displayPercent = true;
    gauge4 = loadLiquidFillGauge("fillgauge4", 0, config4);
	
 }
 
 function NewValue(){
        if(Math.random() > .5){
            return Math.round(Math.random()*100);
        } else {
            return (Math.random()*100).toFixed(1);
        }
    }
	
	function updateAll(){
		gauge1.update(fill_Array[0]);
		gauge2.update(fill_Array[1]);
		gauge3.update(fill_Array[2]);
		gauge4.update(fill_Array[3]);
	}