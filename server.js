/*
 * a websocket server
 * user can set PUERTOTCP number and max connection number
 * broadcast messages except sender
 * display connection number on http page
 * reject connection if full
 *
 * usage: node server.js 8080 2
 *        listen on ws://localhost:8080
 *        max conn number is 2
 */
"use strict";

var PUERTOTCP, CONEXIONMAXIMA;
var connections = [];
var connectionSeqNum = 0;

function setContexto() {
  if(process.argv.length < 2 + 2) {
    var node = process.argv[0];
    var pname = process.argv[1];
    console.log("uso:", node, pname, "PUERTOTCP", "max_conn");
    console.log("ejemplo:", node, pname, "8080 2");
    process.exit(1);
  } else {
    PUERTOTCP = parseInt(process.argv[2]);
    CONEXIONMAXIMA = parseInt(process.argv[3]);
  }
}

setContexto();

function getConnectionSeqNum() {
  return connectionSeqNum ++;
}

function addConnection(conn) {
  connections.push(conn);
}

function delConnection(conn) {
  var i;
  for(i = 0; i < connections.length; i ++) {
    if(connections[i] == conn) {
      connections.splice(i, 1);
      return;
    }
  }
}

function broadcast(msg, except) {
  var i;
  for(i = 0; i < connections.length; i ++) {
    if(connections[i] != except) {
      connections[i].sendUTF(msg);
    }
  }
}

function onReceiveMessage(message) {
  broadcast(message.utf8Data, this);
}

function onWebSocketRequest(request) {
  if(connections.length == CONEXIONMAXIMA)
    request.reject();
  else {
    var conn = request.accept(null, request.origin);
    conn.on("message", onReceiveMessage);
    addConnection(conn);
  }
}

function onWebSocketClose(conn, reason, desc) {
  delConnection(conn);
}

var http = require("http");

function printServerIP(response) {
  response.write("server IP:\n");
  var os = require("os");
  var ifaces = os.networkInterfaces();
  for (var dev in ifaces) {
    ifaces[dev].forEach( function (details) {
      if (details.family == "IPv4" && dev != "lo") {
        response.write(details.address + "\n");
      }
    });
  }
}

function printConnections(response) {
  response.write("" + connections.length + " connections, from:\n");
  var i;
  for(i = 0; i < connections.length; i ++)
    response.write(connections[i].remoteAddress + "\n");
}

function handle(request, response) {
  response.setHeader("Content-Type", "text/plain");
  printServerIP(response);
  response.write("\n");
  printConnections(response);
  response.end();
}
var httpServer = http.createServer(handle);
httpServer.listen(PUERTOTCP);

var WebSocketServer = require("websocket").server;
var WSServer = new WebSocketServer();
WSServer.on("request", onWebSocketRequest);
WSServer.on("close", onWebSocketClose);
WSServer.mount({httpServer: httpServer});

process.on("SIGINT", function () {
  console.log("shutdown websocket server");
  WSServer.shutDown();
  process.exit();
});
