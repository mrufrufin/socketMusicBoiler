//run this with node.js

//declare ports
var exampleFunc;
var socketPort = 80;
var oscIn = 33333;
var oscOut = 11111;
//import libraries
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var osc = require('node-osc');


//init osc
var oscClient = new osc.Client('127.0.0.1', oscOut);
var oscServer = new osc.Server(oscIn, '0.0.0.0');


oscServer.on("message", function (msg, rinfo){

	if(msg[0] == '/clients' && msg[1] == 1){
		console.log(clientCount);
		oscClient.send('/clients', clientList);
	};
	if(msg[0] == "/example"){
	//msg[1] = target, msg[2] on = args
		exampleFunc(msg[1], msg[2], msg[3]);
	};

});

//basic routing
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/javascript/client.js', function(req, res){
	res.sendFile(__dirname + '/javascript/client.js');

});

app.get('/javascript/jquery-2.1.3.min.js', function(req, res){
	res.sendFile(__dirname + '/javascript/jquery-2.1.3.min.js');

});


});
var clients = {};
var clientList = [];
var clientCount = 0;

io.sockets.on('connection', function(socket){

	clients[socket.id] = socket;

	clientList.push(socket.id);	
	clientCount++;

	console.log(clientCount);

	socket.on('disconnect', function(){
		clientCount--;
		delete clients[socket.id];
		//console.log("client  " + socket.id + " left");
		var clientIdx = clientList.indexOf(socket.id);
		if(clientIdx > -1){
		clientList.splice(clientIdx, 1);
		};
	console.log(clientCount);
	});

});

server.listen(socketPort, function(){
	  console.log('listening on ' + socketPort);
});



exampleFunc  = function(target){
	if(target == "all"){
		io.sockets.emit('example', randBuf, delayTF);
		}	
	else{

	io.to(target).emit('example', arg1, arg2);
		};
	};

