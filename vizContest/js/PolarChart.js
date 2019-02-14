function polarchart(charttype){
$('.polardiv').empty();
$('.radardiv').empty();
$('.polardiv').html('<canvas id="polar"></canvas>');
$('.radardiv').html('<canvas id="radar"></canvas>');
//alert($("#Ispolar").prop('checked'));
$('#polar').attr("width",$('.polar').width());
$('#polar').attr("height",$('.polar').height());

$('#radar').attr("width",$('.radardiv').width());
$('#radar').attr("height",$('.radardiv').height());

	//if(charttype){
		var ctx1 = document.getElementById("polar").getContext("2d");
		var myNewChart = new Chart(ctx1).PolarArea(polardata);
	//}else{
		
		var ctx = document.getElementById("radar").getContext("2d");
		var myNewChart = new Chart(ctx).Radar(radardata);
	//}
}

var PolarRadarData= [
['Colleague was on leave',359084,5],
['Colleague was on leave',379799,5],
['Colleague was on leave',379817,5],
['Critical Project Delivery',359084,1],
['Critical Project Delivery',379799,1],
['Critical Project Delivery',379817,1],
['KT Session',359084,5],
['KT Session',379799,5],
['KT Session',379817,5],
['Non Working Day',359084,23],
['Non Working Day',379799,25],
['Non Working Day',379817,31],
['Onsite Counter part was on leave',359084,8],
['Onsite Counter part was on leave',379799,8],
['Onsite Counter part was on leave',379817,8],
['Onsite Holiday',359084,5],
['Onsite Holiday',379799,5],
['Onsite Holiday',379817,5],
['Qliktech Session',359084,10],
['Qliktech Session',379799,10],
['Qliktech Session',379817,10],
['Status Call',359084,7],
['Status Call',379799,7],
['Status Call',379817,7],
['Working Day',359084,27],
['Working Day',379799,23],
['Working Day',379817,19]
];

var DataSet1 = [];
for (var i=0;i<PolarRadarData.length;i++){
	DataSet1.push({
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 90, 81, 56, 55, 40]
        })
}

var polardata = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    },
    {
        value: 40,
        color: "#949FB1",
        highlight: "#A8B3C5",
        label: "Grey"
    },
    {
        value: 120,
        color: "#4D5360",
        highlight: "#616774",
        label: "Dark Grey"
    }

];

var radardata = {
    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ]
};