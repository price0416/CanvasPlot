var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/query"] = requestHandlers.query;
handle["/flot"] = requestHandlers.flot;
handle["/loadCSS.css"] = requestHandlers.loadCSS;
handle["/getImg"] = requestHandlers.getImg;
handle["/getOrg"] = requestHandlers.getOrg;
handle["/fetchData"] = requestHandlers.fetchData;
handle["/getJSON"] = requestHandlers.getJSON;

server.start(router.route, handle);
