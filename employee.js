var crypto = require('crypto');
var currentKey = 0;
var Employee = function(PartitionKey, RowKey, timeStamp, name, address, salary, position) {
	if(!PartitionKey || !RowKey) {
		this.RowKey = currentKey;
		this.PartitionKey = ["USA","UK","Germany"][Math.floor(currentKey/1500)] + "_PLZ" + 10000 + Math.floor(Math.random() * 90000);
		this.timeStamp = new Date();
		this.name = crypto.createHash('SHA256').update(""+this.timeStamp).digest('hex');
		this.adress = crypto.createHash('SHA256').update(""+this.timeStamp).digest('hex');
		this.salary = Math.random() * 80000 + 20000;
		this.position = ['Developer','Tester','Manager'][Math.floor(Math.random() * 3)];

		currentKey++;
		this.toXML = function() {
			return ""+
				"<d:Name>"+this.name+"</d:Name>"+
				"<d:Adress>"+this.adress+"</d:Adress>"+
				"<d:RowKey>"+this.RowKey+"</d:RowKey>"+
				"<d:PartitionKey>"+this.PartitionKey+"</d:PartitionKey>" +
				"<d:TimeStamp>"+this.timeStamp+"</d:TimeStamp>" +
				"<d:Salary>"+this.salary+"</d:Salary>"+
				"<d:Position>"+this.position+"</d:Position>";
		}
	}
}
module.exports =  Employee;
