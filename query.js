var util = require('util');
var http = require('http');
var url = require('url');
var config = require('./config.js');
var authHeader = require('./authHeader.js');

function query(querystring) {
	var opts = url.parse(config.url);
	opts.path = "/" + config.table;
	opts.method = "GET";
	var date = (new Date()).toGMTString();
	opts.host = opts.host + ":80";
	opts.headers = {
		"date" : date,
		"DataServiceVersion" : "1.0;NetFx",
		"MaxDataServiceVersion" : "1.0;NetFx"
	};
	opts.headers['authorization'] = authHeader.getAuthHeader(opts);
	opts.path = opts.path + querystring;
	util.puts(JSON.stringify(opts));
	var req = http.request(opts, function(res) {
		if(res.statusCode >= 300) {
			util.puts(res.statusCode);
			res.on('data', util.puts);
		} else {
			if(done%500 == 0)
				util.puts("successcounter: " + done);
			done++;
		}
	});
	req.on('error', util.puts);
	req.end();
}

query("(PartitionKey='USA',RowKey='1')");
