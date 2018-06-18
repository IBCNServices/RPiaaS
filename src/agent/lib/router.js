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
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(1));
});

//uptime
router.get("/uptime",function(req,res){
    systeminfo.uptime(printResult.bind( {res: res} ));
});

// CPU Temperature
router.get("/temp/cpu", function(req, res) {
    systeminfo.cpuTemp(printResult.bind( {res: res} ));
});

// CPU Usage
router.get("/usage/cpu", function(req, res) {
    systeminfo.cpuUsage(printResult.bind( {res: res} ));
});

// Memory Usage
router.get("/usage/memory", function(req, res) {
    systeminfo.memoryUsage(printResult.bind( {res: res} ));
});

// Disk Usage
router.get("/usage/disk", function(req, res) {
    systeminfo.diskUsage(printResult.bind( {res: res} ));
});

// All Info
router.get("/all", function(req,res){
    systeminfo.all(printResult.bind( {res: res} ));
});

function printResult(error,result) {
    // function body
    // optional return;
    if(error){
        console.log(error);
        this.res.status(404).send(error);
    } else {
        this.res.writeHead(200, {'Content-Type': 'application/json'});
        this.res.end(JSON.stringify(result));
    }
};

module.exports = router;