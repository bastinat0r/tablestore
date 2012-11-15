var util = require('util');
var queryMonster = require('./query.js');

var numCountry = 0;

var numMager = 0;;

queryMonster.emitter.on('data', function(data) {
	var split = data.split(/\<\/entry>[\s\r\n]*\<entry[^>]*>/);
	if(false) {
		for(i in split) {
			util.puts(split[i]);
			util.puts("…………………………………………………………………………………………………………………");
		}
	}
	numMager+= split.length;
});

queryMonster.emitter.on('end', function() {
	util.puts(numMager);
});

var qurystring = "()?$filter=" + encodeURIComponent("Position eq 'Manager' and PartitionKey gt 'Germany_PLZ30000' and PartitionKey le 'Germany_PLZ80000'");

queryMonster.query(qurystring);
