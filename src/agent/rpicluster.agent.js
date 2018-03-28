const AGENT_PORT=8081; 

var express = require('express');
var path = require('path'); 
var app = express();

var router = require('./lib/router');

router.use(function (req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

function handleRequest(request, response){
    try {
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'pug');

app.use("/",router);
app.use("*",function(req,res){
  res.end();
});

app.listen(AGENT_PORT,function(){
    console.log("Agent ready, listening on: http://localhost:%s", AGENT_PORT);
});

