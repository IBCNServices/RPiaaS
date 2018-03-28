var express = require('express');
var router = express.Router();
var path = require('path');
var systeminfo = require('./systeminfo');

router.use(function (req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

//start page with info
router.get("/",function(req,res){
    res.render('info');
});

//ping
router.get("/ping",function(req,res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('1');
});

//uptime
router.get("/uptime",function(req,res){
    res.writeHead(200, {'Content-Type': 'application/json'});
    systeminfo.uptime(function(result){res.end(JSON.stringify(result));});
});

// CPU Usage
router.get("/usage/cpu", function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    systeminfo.cpuUsage(function(result){res.end(JSON.stringify(result));});
});

// Memory Usage
router.get("/usage/memory", function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    systeminfo.memoryUsage(function(result){res.end(JSON.stringify(result));});
});

// Disk Usage
router.get("/usage/disk", function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    systeminfo.diskUsage(function(result){res.end(JSON.stringify(result));});
});

// All Info
router.get("/all", function(req,res){
    var info = {};
    res.writeHead(200, {'Content-Type': 'application/json'});
    // 1. Get uptime    
    systeminfo.uptime(
        function(result){
            info.uptime = result;
            // 2. Get CPU Usage
            systeminfo.cpuUsage(    
                function(result){
                    info.cpu = result;
                    // 3. Get Memory Usage
                    systeminfo.memoryUsage(
                        function(result){
                            info.memory = result;
                            // 4. Get disk usage
                            systeminfo.diskUsage(
                                function(result){
                                    info.disk = result;
                                    // Print full result
                                    res.end(JSON.stringify(info));
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

module.exports = router;