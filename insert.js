var util = require('util');
var http = require('http');
var crypto = require('crypto');
var url = require('url');
var Employee = require('./employee.js');
var config = require('./config.js');
var authHeader = require('./authHeader.js');

var done = 1;

for(var i = 0; i<4500; i++) {
	if((i + 1) % 500 == 0)
		util.puts("putting entity " + i + " into the table store");
	putEntity(new Employee());
};
function putEntity(entity) { 
	var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
+"<entry xmlns:d=\"http://schemas.microsoft.com/ado/2007/08/dataservices\" xmlns:m=\"http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\" xmlns=\"http://www.w3.org/2005/Atom\">"
+"<title />"
+"<updated>2011-08-30T18:09:37.168836Z</updated>"
+"<author>"
+"<name />"
+"</author>"
+"<id>http://"+config.name+".table.core.windows.net/"+config.table+"</id>"
+"<content type=\"application/xml\">"
+"<m:properties>"
+entity.toXML()
+"</m:properties>"
+"</content>"
+"</entry>" 
	var opts = url.parse(config.url);
	opts.path = "/" + config.table;
	opts.method = "POST";
	var date = (new Date()).toGMTString();
	opts.host = opts.host + ":80";
	opts.headers = {
		"date" : date,
		"content-length" : xml.length,
		"content-type" : "application/atom+xml; charset=utf-8",
		"DataServiceVersion" : "1.0;NetFx",
		"MaxDataServiceVersion" : "1.0;NetFx"
	};
	opts.headers['authorization'] = authHeader.getAuthHeader(opts);
	var req = http.request(opts, function(res) {
		if(res.statusCode >= 300) {
			util.puts(res.statusCode);
			res.on('data', util.puts);
			putEntity(new Employee());	// i hope this is never called
		} else {
			if(done%500 == 0)
				util.puts("successcounter: " + done);
			done++;
		}
	});
	req.on('error', util.puts);
	req.end(xml);
};
/*
function getAuthHeader(opts) {
	var hmac = crypto.createHmac('sha256',new Buffer(config.key, 'base64'));
	hmac.update(signatureString(opts));
	return "SharedKey " + config.name + ":" + hmac.digest('base64');
};

function signatureString(opts) {
	//util.puts("………………………………………………");
	var normalizedRequestString = "" 
			+ opts.method + '\n'
			+ '\n'
			+ opts.headers["content-type"] + '\n'
			+ opts.headers["date"] + '\n'
			+ "/" + config.name +  opts.path;
	//util.puts(normalizedRequestString);
	//util.puts("…………………………………………………");
	return normalizedRequestString;
}
*/
