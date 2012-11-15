var util = require('util');
var queryMonster = require('./query.js');

queryMonster.emitter.on('data', function(data) {
	var split = data.split(/\<\/entry>[\s\r\n]*\<entry[^>]*>/);
	for(i in split) {
		if(false) {
			util.puts(split[i]);
			util.puts("…………………………………………………………………………………………………………………");
		}
		var pk = "" + /\<d\:PartitionKey\>.*/i.exec(split[i]);
		util.puts("pk: " + pk.replace(/\<[^\>]*\>/gi, ''));
		//var rk = "" + /\<d\:RowKey\>.*/i.exec(split[i]);
		//util.puts("rk: " + rk.replace(/\<[^\>]*\>/gi, ''));
	}
});

queryString = "()";
queryMonster.query(queryString);
