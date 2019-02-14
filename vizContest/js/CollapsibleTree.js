function tree(){
	var margin = {top: 30, right: 20, bottom: 30, left: 20},
		width = $('.tree1').width() - margin.left - margin.right,
		barHeight = 40,
		barWidth = width * .8;

	var html = '<div class="panel panel-default">'+
    '<div class="panel-heading" role="tab" id="headingOne">'+
      '<h4 class="panel-title">'+
        '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
         ' Collapsible Group Item #1'+
        '</a>'+
      '</h4>'+
    '</div>'+
    '<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">'+
      '<div class="panel-body">'+
        "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS."+
      '</div>'+
    '</div>'+
  '</div>';
	
	//var collapse = d3.select('.tree1').selectAll('collapseClass').data(data).enter();
	//$('.tree1').html(html+html+html);
	
}


var data = [{
	"name" : "root",
	"children" : [{
	   "name": "359084",
	   "children": [
			  {"name": "Qliktech Session", "size": 5},
			  {"name": "Onsite Counter part was on leave", "size": 2},
			  {"name": "Status Call", "size": 1},
			  {"name": "Colleague was on leave", "size": 7},
			  {"name": "KT Session", "size": 5},
			  {"name": "Onsite Holiday", "size": 2},
			  {"name": "Critical Project Delivery", "size": 1}
			 ]
	},
	{
	   "name": "379799",
	   "children": [
			  {"name": "Qliktech Session", "size": 5},
			  {"name": "Onsite Counter part was on leave", "size": 2},
			  {"name": "Status Call", "size": 1},
			  {"name": "Colleague was on leave", "size": 7},
			  {"name": "KT Session", "size": 5},
			  {"name": "Onsite Holiday", "size": 2},
			  {"name": "Critical Project Delivery", "size": 1}
			 ]
	},
	{
	   "name": "387900",
	   "children": [
			  {"name": "Qliktech Session", "size": 5},
			  {"name": "Onsite Counter part was on leave", "size": 2},
			  {"name": "Status Call", "size": 1},
			  {"name": "Colleague was on leave", "size": 7},
			  {"name": "KT Session", "size": 5},
			  {"name": "Onsite Holiday", "size": 2},
			  {"name": "Critical Project Delivery", "size": 1}
			 ]
	}]
}]
;
/*,
{
   "name": "379799",
   "children": [
		  {"name": "Qliktech Session", "size": 5},
		  {"name": "Onsite Counter part was on leave", "size": 2},
		  {"name": "Status Call", "size": 1},
		  {"name": "Colleague was on leave", "size": 7},
		  {"name": "KT Session", "size": 5},
		  {"name": "Onsite Holiday", "size": 2},
		  {"name": "Critical Project Delivery", "size": 1}
		 ]
},
{
   "name": "387900",
   "children": [
		  {"name": "Qliktech Session", "size": 5},
		  {"name": "Onsite Counter part was on leave", "size": 2},
		  {"name": "Status Call", "size": 1},
		  {"name": "Colleague was on leave", "size": 7},
		  {"name": "KT Session", "size": 5},
		  {"name": "Onsite Holiday", "size": 2},
		  {"name": "Critical Project Delivery", "size": 1}
		 ]
}
};*/