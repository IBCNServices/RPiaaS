// Configuration
const PORT=8080;		// MASTER SERVICE PORT
const INTERVAL=60; 		// UPDATE INTERVAL (in seconds)

// Includes
var express = require("express");
var path = require('path'); 
var app = express();

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('rpiaas-mongo:27017/rpiaas-cms');

var Cluster = require('./lib/cluster');
var Utils = require('./lib/utils');
var router = require('./lib/router');

// Initialize cluster data
global.config = require('./static/config.json');
global.clusters = [];
global.config.clusters.forEach(function(clusterJSON){
	var cluster = new Cluster(clusterJSON);
	global.clusters.push(cluster);
});

app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'pug');

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    res.locals.utils = new Utils();
    next();
});

// Static content
app.use(express.static(path.join(__dirname,'static')))
app.use("/",router);
app.use("*",function(req,res){
  res.end();
});

app.listen(PORT,function(){
    console.log("[INF] Master ready, listening on: http://localhost:%s", PORT);
});

updateStatus();

function updateStatus(){
	console.log("[INF] Update Cluster Status");
	global.clusters.forEach(function(cluster,c_i){
		cluster.updateStatus(db);
	});
	setTimeout(updateStatus, INTERVAL * 1000); // Refresh every 60 seconds;
}