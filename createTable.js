
var util = require('util');
var http = require('http');
var crypto = require('crypto');
var Employee = require('./employee.js');
var config = require('./config.js');

var azure = require('azure');
var tableService = azure.createTableService(config.name, config.key);

tableService.createTableIfNotExists(config.table, function(error) {
	if(error) {
		util.puts(error);
	} else {
		util.puts("Table " +  'cloudcomputing' + "should be created");
	}
});
