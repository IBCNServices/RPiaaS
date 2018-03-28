var ClusterNode = require('./clusternode');
var method = Cluster.prototype;

// Public
module.exports = Cluster;

function Cluster(jsonCluster) {
	this.domain = jsonCluster.domain;
	this.prefix = jsonCluster.prefix;
	this.nodes = [];
	jsonCluster.nodes.forEach(this.addNode.bind(this));
};

method.addNode = function(jsonNode){
	var n = new ClusterNode(jsonNode);
	n.setCluster(this);
	this.nodes.push(n);
};

method.updateStatus = function(db){
	this.nodes.forEach(
		function(node){
			node.updateStatus(node,db);
		}
	);
};