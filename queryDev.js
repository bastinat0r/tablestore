var util = require('util');
var queryMonster = require('./query.js');

var numCountry = 0;

queryMonster.query(getFilterString(['UK','USA','Germany'][numCountry]));

var sumSalary = 0;
var numDevs = 0;

queryMonster.emitter.on('data', function(data) {
	var split = data.split(/\<\/entry>[\s\r\n]*\<entry[^>]*>/);
	for(i in split) {
		if(false) {
			util.puts(split[i]);
			util.puts("…………………………………………………………………………………………………………………");
		}
		var pk = "" + /\<d\:PartitionKey\>.*/i.exec(split[i]);
		util.puts("pk: " + pk.replace(/\<[^\>]*\>/gi, ''));
		
		var pos = "" + /\<d\:Position\>.*/i.exec(split[i]);
		util.puts("pos: " + pos.replace(/\<[^\>]*\>/gi, ''));

		var salary = "" + /\<d:Salary\>.*/i.exec(split[i]);
		sumSalary += parseFloat("" + salary.replace(/\<[^\>]*\>/gi, ''));
		numDevs++;
		//var rk = "" + /\<d\:RowKey\>.*/i.exec(split[i]);
		//util.puts("rk: " + rk.replace(/\<[^\>]*\>/gi, ''));
	}
});

queryMonster.emitter.on('end', function() {
	util.puts(['UK','USA','Germany'][numCountry] + " : ");
	util.puts(sumSalary/numDevs);
	sumSalary = 0;
	numDevs = 0;
	numCountry++;
	util.puts(numCountry);
	if(numCountry < 3) {
		queryMonster.query(getFilterString(['UK','USA','Germany'][numCountry]));
		util.puts(numCountry);
	}
});

function getFilterString(country){
	return "()?$filter=" + encodeURIComponent("Position eq 'Developer' and PartitionKey gt '"+country+"_PLZ10000' and PartitionKey le '"+country+"_PLZ99999'");
};
