var Node = function (jsonNode) {
	this.hostname = jsonNode.hostname;
	this.suffix = jsonNode.suffix;
	this.cluster = null;
	this.online = 0;
};

// Sets reference to (parent) cluster
Node.prototype.setCluster = function(cluster){
	this.cluster = cluster;
};

// Return IP address of Node
Node.prototype.getIPAddress = function(){
	var address = "";
	if(this.cluster){
		address += this.cluster.prefix + ".";
	}
	address += this.suffix;
	return address;
};

// Return FQDN of Node
Node.prototype.getFQDN = function(){
	var name = this.hostname;
	if(this.cluster){
		name += "." + this.cluster.domain;
	}
	return name;	
};

Node.prototype.ping = function(){
	$.ajax({
		url: 'http://' + this.getIPAddress() + ':8081/ping',
		//url: 'http://192.168.2.4/rpicluster_client/ping.html',
		context: this,
		success: function(result){
			this.online = 1
		},     
		error: function(result){
			this.online = -1;
		},
		timeout: 3000	// 3 seconds timeout
	});

	//return !!Math.floor(Math.random() * 2); // Random True or False
}

var Cluster = function(jsonCluster){
	this.domain = jsonCluster.domain;
	this.prefix = jsonCluster.prefix;
	this.nodes = [];
	jsonCluster.nodes.forEach(this.addNode.bind(this));
};

Cluster.prototype.addNode = function(jsonNode){
	var n = new Node(jsonNode);
	n.setCluster(this);
	this.nodes.push(n);
};

Cluster.prototype.pingAllNodes = function(){
	this.nodes.forEach(function(node){node.ping()});
}