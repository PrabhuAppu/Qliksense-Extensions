function call(Bidata){
	sals = Bidata;
	//console.log(bP.partData(sals,2));
$(".charts").empty();
//var cc2 = ["a","b","c"];

//var width = 1100, height = 400, margin ={b:0, t:40, l:170, r:50};
var width = parseInt($(".charts").width()), height = parseInt($(".charts").height()), 
margin ={b:0, t:40, l:(width/3), r:50};

var svg = d3.select(".charts")
	.append("svg").attr('width',width).attr('height',(height+margin.b+margin.t))
	.append("g").attr("transform","translate("+ margin.l+","+margin.t+")");

var data = [ 
	{data:bP.partData(sals,2), id:'SalesAttempts', header:["Employee","Leave Type", "Leave Details"]}//,
	//{data:bP.partData(sales_data,3), id:'Sales', header:["Channel","State", "Sales"]}
];

bP.draw(data, svg);

}



var sals = [
['Employee1','Sick Leave',2],
['Employee1','LOP',2],
['Employee1','Comp Off',3],
['Employee2','Vocation',2],
['Employee2','LOP',1],
['Employee2','Comp Off',3],
['Employee3','Sick Leave',5],
['Employee3','LOP',2],
['Employee4','Comp Off',10],
['Employee5','Sick Leave',9],
['Employee5','LOP',3],
['Employee6','Vocation',10],
['Employee6','Comp Off',2],
['Employee7','Sick Leave',6],
['Employee7','LOP',1],
];
