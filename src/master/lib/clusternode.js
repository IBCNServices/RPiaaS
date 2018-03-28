var request = require("request");
var method = ClusterNode.prototype;

function ClusterNode(jsonNode) {
	this.hostname = jsonNode.hostname;
	this.suffix = jsonNode.suffix;
	this.hwaddr = jsonNode.hwaddr;
	this.cluster = null;
	this.online = 0;
	this.info = null;
};

// Sets reference to (parent) cluster
method.setCluster = function(cluster){
	this.cluster = cluster;
};

// Return IP address of Node
method.getIPAddress = function(){
	var address = "";
	if(this.cluster && this.cluster.prefix != ""){
		address += this.cluster.prefix + ".";
	}
	address += this.suffix;
	return address;
};

// Return FQDN of Node
method.getFQDN = function(){
	var name = this.hostname;
	if(this.cluster){
		name += "." + this.cluster.domain;
	}
	return name;	
};

method.updateStatus = function(node,db){
	node.ping(
		function (result) {
			node.online = result;
			if(node.online == 1){
				console.log("[INF] Get info for node "+node.getFQDN());
				node.getInfo(
					function(result) {
						if(result != -1){
							node.info = result;
							// Save to database
							var collection = db.get(node.getFQDN());
							collection.insert(
								{
        							"timestamp" : new Date().getTime(),
        							"data" : result
    							}, 
    							function (err, doc) {
		        					if (err) {
		            					console.log("[INF] There was a problem adding the information to the database.");
		        					} else {
		        						console.log("[INF] Added historical data to the database.");
		        					}
		    					}
	    					);
						}
					}
				);
				/*
				
	    		node.getInfo(node,collection);
	    		*/
			}
		/*
	    if (!error && response.statusCode === 200) {
	    	node.online = 1;
	    	console.log("[INF] Get info for node "+node.getFQDN());
			var collection = db.get(node.getFQDN());
	    	node.getInfo(node,collection);
	    } else {
	    	node.online = -1;
	    }
	    */
		}
	);
}


method.ping = function(callback){
	request({
		url: 'http://' + this.getIPAddress() + ':8081/ping',
		timeout: 1000
	}, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
	    	callback(1);
	    } else {
	    	callback(-1);
	    }
	});
	//return !!Math.floor(Math.random() * 2); // Random True or False
};

method.getInfo = function(callback){
	request({
		url: 'http://' + this.getIPAddress() + ':8081/all',
		timeout: 10000,
		json: true
	}, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			callback(body);
			/*
	    	node.info = body;
	    	collection.insert({
        		"timestamp" : new Date().getTime(),
        		"data" : body
    		}, function (err, doc) {
		        if (err) {
		            // If it failed, return error
		            console.log("[INF] There was a problem adding the information to the database.");
		        }
		        else {
		        	console.log("[INF] Added historical data to the database.");
		        }
		    });
		    */
	    } else {
	    	callback(-1);
	    }
	});
};


module.exports = ClusterNode;