var util = require('util');
var http = require('http');
var url = require('url');
var config = require('./config.js');
var authHeader = require('./authHeader.js');
var events = require('events');

var emitter = new events.EventEmitter();
/*
if(false) {
	var azure = require('azure');
	var tableService = azure.createTableService(config.name, config.key);
	var query = azure.TableQuery.select().from(config.table)
		.where('PartitionKey gt ?', 'USA');
	tableService.queryEntities(query, function(err, res) {
		if(err) {
			util.puts(err);
		} else {
			util.puts(JSON.stringify(res));
		}
	});
}
else { 
	var q = query("()?$filter="+encodeURIComponent("(PartitionKey gt 'USA_PLZ00000')and(PartitionKey le 'USA_PLZ99999')"));
	emitter.on('data', function(data) {
		var keys = data.match(/\<d\:(PartitionKey|RowKey).*///<- this one is actually part of the regexp -,-
		/*gi);
		for(var i in keys) {
			util.puts(""+keys[i].replace(/\<[^>]*\>/gi,''));
		}
	});
}
*/
module.exports.query = query;
module.exports.emitter = emitter;

function query(querystring) {
	var opts = url.parse(config.url);
	opts.path = "/" + config.table;
	opts.method = "GET";
	var date = (new Date()).toGMTString();
	opts.host = opts.host + ":80";
	opts.headers = {
		"date" : date,
		"content-length" : 0,
		"content-type" : "application/atom+xml; charset=utf-8",
		"DataServiceVersion" : "1.0;NetFx",
		"MaxDataServiceVersion" : "1.0;NetFx"
	};
	opts.path = opts.path + /^[^\?]*/.exec(querystring);
	querystring = "" + querystring.replace(/^[^\?]*/, '');
	opts.headers['authorization'] = authHeader.getAuthHeader(opts);
	opts.path = opts.path + querystring;
	//util.puts(JSON.stringify(opts));
	var req = http.request(opts, function(res) {
		if(res.statusCode >= 300) {
			util.puts(res.statusCode);
			res.on('data', util.puts);
		} else {
			var data = "";
			res.on('data', function(chunk) {
				data = data + chunk;
			});
			res.on('end', function() {
				//util.puts(data.split("<id>").length);
				emitter.emit('data', data);
				//util.puts(JSON.stringify(res.headers));
				if(res.headers["x-ms-continuation-nextpartitionkey"]) {
					var next = "?NextPartitionKey=" +
					res.headers["x-ms-continuation-nextpartitionkey"] +
					"&NextRowKey=" + 
					res.headers["x-ms-continuation-nextrowkey"];
					query(next);
				} else {
					emitter.emit('end');
				}
			});
		}
	});
	req.on('error', util.puts);
	req.end();
}

