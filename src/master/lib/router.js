var express = require('express');
var router = express.Router();

router.use(function (req,res,next) {
  //console.log("/" + req.method);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Main web pages
router.get("/",function(req,res){	
	res.render('cluster');
});

router.get("/config",function(req,res){	
	res.render('config');
});

// Config files
router.get("/conf/dnsmasq.conf",function(req,res){
	res.setHeader('content-type', 'text/plain');
	res.render('conf/dnsmasq');
});

router.get("/conf/dnsmasq_static_hosts",function(req,res){
	res.setHeader('content-type', 'text/plain');
	res.render('conf/dnsmasq_static_hosts');
});


router.get("/conf/exports",function(req,res){
	res.setHeader('content-type', 'text/plain');
	res.render('conf/exports');
});

// Get history
router.get("/api/history/*/*/", function(req,res){
	var parts = (req.params[0]).split("/");

	if(parts[0] < clusters.length && parts[1] < clusters[parts[0]].nodes.length){
		var selectedNode = (clusters[parts[0]]).nodes[parts[1]];
		
		// Get historical data
		var db = req.db;

		var collection = db.get(selectedNode.getFQDN());
		collection.find({},{},function(e,data){
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(data));
		});
	}
});

// API (forwarder request)
router.get("/api/*/*/*",function(req,res){
	var parts = (req.originalUrl).split("/");
	var c_i = parts[2];
	var n_i = parts[3];

	if(c_i < clusters.length && n_i < clusters[c_i].nodes.length){
		var selectedNode = (clusters[c_i]).nodes[n_i];
		if(selectedNode.online == 1){
			var request = require('request');
			var url = "http://"+selectedNode.getIPAddress()+":8081/"+parts.slice(4).join("/");
			request(url).pipe(res);
		} else {
			
			res.writeHead(200, {'Content-Type': 'application/json'});
			if(parts.slice(4) == 'ping'){
				res.end(JSON.stringify(0));
			} else {
				res.end(JSON.stringify("Selected node is offline."));
			}
		}
	} else {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify("Invalid Request."));
	}
});

router.get("/*/*/",function(req,res){	
	var parts = (req.params[0]).split("/");
	if(parts[0] < clusters.length && parts[1] < clusters[parts[0]].nodes.length){
		var selectedNode = (clusters[parts[0]]).nodes[parts[1]];
		
		// Get historical data
		var db = req.db;
		
    	var collection = db.get(selectedNode.getFQDN());
		collection.find({},{},function(e,data){
        	res.render('clusternode', {selectednode: selectedNode, history: data, ci: parts[0], ni: parts[1]});
    	});
	} else {
		res.render('cluster');
	}
});

module.exports = router;