var azure = require('azure');
var util = require('util');
var config = require('./config.js');

var tableService = azure.createTableService(config.name, config.key);

tableService.deleteTable('cloudcomputing', function(err) {
	if(err)
		util.puts(err);
});
