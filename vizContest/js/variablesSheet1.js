var fastchange = [];
var BiPartData = [];
var BiPartDataChanged = [];
var BiPartDataSelection={
	key : '0',
	id : '0',
	isSeletedOne : false
};
var SortableBarData = [];
var MonthArray =[];
var fill_Array=[];
var GridData=[];
var BubbleData = [];
var TableDetail = [];
var htm = '<div class="hide container-fluid"><div class="col-sm-12"><div class="row"><div class="tip progress progress_tooltip"><div class="progress-bar progress-bar-success " role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style="width: 30%"></div><div class="progress-bar progress-bar-danger " role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 20%"></div></div></div><div class="row"><div class="col-sm-6"><span class="label label-success legend_hrs">Working Hrs </span></div><div class="col-sm-6"><span class="label label-danger legend_hrs">Break Hrs </span></div></div><div class="row paddingRow"><div class="col-sm-6"><span class="glyphicon glyphicon-time green" aria-hidden="true"></span> In time : </div><div class="col-sm-6"><span class="glyphicon glyphicon-time red" aria-hidden="true"></span> Out Time :</div></div></div></div>';