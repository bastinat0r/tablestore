var crypto = require('crypto');
var config = require('./config.js');
var util = require('util');
module.exports.getAuthHeader = getAuthHeader;

function getAuthHeader(opts) {
	var hmac = crypto.createHmac('sha256',new Buffer(config.key, 'base64'));
	hmac.update(signatureString(opts));
	return "SharedKey " + config.name + ":" + hmac.digest('base64');
};

function signatureString(opts) {
	//util.puts("………………………………………………");
	var normalizedRequestString = "" 
			+ opts.method + '\n'
			+ '\n';
	if(opts.headers["content-type"])
	 normalizedRequestString = normalizedRequestString + opts.headers["content-type"]
	normalizedRequestString = normalizedRequestString + '\n'
			+ opts.headers["date"] + '\n'
			+ "/" + config.name +  opts.path;
	//util.puts(normalizedRequestString);
	//util.puts("…………………………………………………");
	return normalizedRequestString;
}
