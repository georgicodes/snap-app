var express = require("express");
var app = express();
var port = 3700;
 
app.get("/", function(req, res){
	res.sendfile('./index.html');
});

app.use(express.static(__dirname + '/'));

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});