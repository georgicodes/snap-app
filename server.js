var express = require("express");
var app = express();
var port = 3700;
 
app.get("/", function(req, res){
	res.sendfile('./index.html');
});

app.use(express.static(__dirname + '/'));
app.listen(port);
console.log("Listening on port " + port);