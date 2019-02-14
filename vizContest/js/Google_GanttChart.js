function drawChart() {
var numRecords = [];
for(var i=0;i<timelineData.length;i++){
  numRecords.push(timelineData[i][0]);
}

var unique = numRecords.getUnique();
//alert(unique);
var height = Math.min((40*unique.length)+75,235);
$('#timeline').css("height", height+"px");

  var container = document.getElementById('timeline');
  var chart = new google.visualization.Timeline(container);

  var dataTable = new google.visualization.DataTable();
  dataTable.addColumn({ type: 'string', id: 'Position' });
  dataTable.addColumn({ type: 'string', id: 'Name' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });
  dataTable.addRows(timelineData);
  
var options = {
    timeline: { groupByRowLabel: true },
	avoidOverlappingGridLines: false
  };
  chart.draw(dataTable,options);
}

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

var timelineData = [
[ '359084', 'Working Day', new Date(2015, 4,  1,00,00,00), new Date(2015, 4,  1,23,59,59) ],
[ '379817', 'Onsite Counter part was on leave', new Date(2015, 4,  1,00,00,00), new Date(2015, 4,  1,23,59,59) ],
[ '359084', 'Non Working Day', new Date(2015, 4,  2,00,00,00), new Date(2015, 4,  2,23,59,59) ],
[ '379817', 'Onsite Holiday', new Date(2015, 4,  2,00,00,00), new Date(2015, 4,  2,23,59,59) ],
[ '359084', 'Working Day', new Date(2015, 4,  3,00,00,00), new Date(2015, 4,  3,23,59,59) ],
[ '379817', 'Qliktech Session', new Date(2015, 4,  3,00,00,00), new Date(2015, 4,  3,23,59,59) ],
[ '359084', 'Non Working Day', new Date(2015, 4,  4,00,00,00),new Date(2015, 4,  6,23,59,59)  ],
[ '379817', 'Onsite Holiday', new Date(2015, 4,  6,00,00,00), new Date(2015, 4,  6,23,59,59) ],
[ '359084', 'Status Call', new Date(2015, 4,  7,00,00,00), new Date(2015, 4,  7,23,59,59) ],
[ '379817', 'Onsite Counter part was on leave', new Date(2015, 4,  7,00,00,00), new Date(2015, 4,  8,23,59,59)  ],
[ '359084', 'KT Session', new Date(2015, 4,  8,00,00,00), new Date(2015, 4,  8,23,59,59) ],
[ '359084', 'Status Call', new Date(2015, 4,  9,00,00,00), new Date(2015, 4,  9,23,59,59) ],
[ '379817', 'Non Working Day', new Date(2015, 4,  9,00,00,00), new Date(2015, 4,  9,23,59,59) ],
[ '359084', 'Onsite Counter part was on leave', new Date(2015, 4,  10,00,00,00), new Date(2015, 4,  10,23,59,59) ],
[ '379817', 'Status Call', new Date(2015, 4,  10,00,00,00), new Date(2015, 4,  10,23,59,59) ],
[ '359084', 'Non Working Day', new Date(2015, 4,  11,00,00,00), new Date(2015, 4,  12,23,59,59) ],
[ '359084', 'Colleague was on leave', new Date(2015, 4,  13,00,00,00), new Date(2015, 4,  13,23,59,59) ],
[ '379817', 'Working Day', new Date(2015, 4,  13,00,00,00), new Date(2015, 4,  13,23,59,59) ],
[ '359084', 'Status Call', new Date(2015, 4,  14,00,00,00), new Date(2015, 4,  14,23,59,59) ],
[ '379817', 'Non Working Day', new Date(2015, 4,  14,00,00,00), new Date(2015, 4,  14,23,59,59) ],
[ '359084', 'Onsite Holiday', new Date(2015, 4,  15,00,00,00), new Date(2015, 4,  15,23,59,59) ],
[ '379817', 'Qliktech Session', new Date(2015, 4,  15,00,00,00), new Date(2015, 4,  15,23,59,59) ],

    /*[ 'President', 'George Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
    [ 'President', 'John Adams', new Date(1797, 2, 4), new Date(1801, 2, 4) ],
    [ 'President', 'Thomas Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4) ],
    [ 'Vice President', 'John Adams', new Date(1789, 3, 21), new Date(1797, 2, 4)],
    [ 'Vice President', 'Thomas Jefferson', new Date(1797, 2, 4), new Date(1801, 2, 4)],
    [ 'Vice President', 'Aaron Burr', new Date(1801, 2, 4), new Date(1805, 2, 4)],
    [ 'Vice President', 'George Clinton', new Date(1805, 2, 4), new Date(1812, 3, 20)],
    [ 'Secretary of State', 'John Jay', new Date(1789, 8, 25), new Date(1790, 2, 22)],
    [ 'Secretary of State', 'Thomas Jefferson', new Date(1790, 2, 22), new Date(1793, 11, 31)],
    [ 'Secretary of State', 'Edmund Randolph', new Date(1794, 0, 2), new Date(1795, 7, 20)],
    [ 'Secretary of State', 'Timothy Pickering', new Date(1795, 7, 20), new Date(1800, 4, 12)],
    [ 'Secretary of State', 'Charles Lee', new Date(1800, 4, 13), new Date(1800, 5, 5)],
    [ 'Secretary of State', 'John Marshall', new Date(1800, 5, 13), new Date(1801, 2, 4)],
    [ 'Secretary of State', 'Levi Lincoln', new Date(1801, 2, 5), new Date(1801, 4, 1)],
    [ 'Secretary of State', 'James Madison', new Date(1801, 4, 2), new Date(1809, 2, 3)],
	[ 'President2', 'George Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
    [ 'President2', 'John Adams', new Date(1797, 2, 4), new Date(1801, 2, 4) ],
    [ 'President2', 'Thomas Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4) ],
	[ 'President3', 'George Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
    [ 'President3', 'John Adams', new Date(1797, 2, 4), new Date(1801, 2, 4) ],
    [ 'President3', 'Thomas Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4) ],
	/*[ '359084', 'Colleague was on leave', new Date(2015, 4,  13,  8,28,  44), new Date(2015, 4,  13,  22,8,  5) ],
[ '359084', 'KT Session', new Date(2015, 4,  8,  9,6,  8), new Date(2015, 4,  8,  19,10,  10) ],
[ '359084', 'Onsite Counter part was on leave', new Date(2015, 4,  10,  11,17,  7), new Date(2015, 4,  10,  23,2,  11) ],
[ '359084', 'Onsite Holiday', new Date(2015, 4,  15,  10,36,  34), new Date(2015, 4,  15,  22,8,  30) ],
[ '359084', 'Status Call', new Date(2015, 4,  14,  9,45,  36), new Date(2015, 4,  14,  20,49,  17) ],
[ '359084', 'Status Call', new Date(2015, 4,  7,  9,20,  8), new Date(2015, 4,  7,  20,20,  35) ],
[ '359084', 'Status Call', new Date(2015, 4,  9,  9,5,  14), new Date(2015, 4,  9,  18,46,  24) ],
[ '379817', 'Onsite Counter part was on leave', new Date(2015, 4,  1,  9,4,  51), new Date(2015, 4,  1,  19,16,  2) ],
[ '379817', 'Onsite Counter part was on leave', new Date(2015, 4,  7,  9,6,  15), new Date(2015, 4,  7,  19,27,  13) ],
[ '379817', 'Onsite Counter part was on leave', new Date(2015, 4,  8,  9,7,  5), new Date(2015, 4,  8,  19,13,  8) ],
[ '379817', 'Onsite Holiday', new Date(2015, 4,  2,  9,2,  30), new Date(2015, 4,  2,  18,13,  44) ],
[ '379817', 'Onsite Holiday', new Date(2015, 4,  6,  9,10,  21), new Date(2015, 4,  6,  19,26,  54) ],
[ '379817', 'Qliktech Session', new Date(2015, 4,  15,  9,9,  48), new Date(2015, 4,  15,  19,24,  49) ],
[ '379817', 'Qliktech Session', new Date(2015, 4,  3,  9,0,  24), new Date(2015, 4,  3,  19,25,  29) ],
[ '379817', 'Status Call', new Date(2015, 4,  10,  9,7,  50), new Date(2015, 4,  10,  18,18,  0) ],
*/
  ];