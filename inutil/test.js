// var request = require('request');

// request('https://scholar.google.com/scholar?as_vis=0&q=music+language+cognition', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body) // Show the HTML for the Google homepage. 
//   }
// })

////////////////////////////////// LIBRARIES ////////////////////////////

var http = require("http");
var urlParser = require('url');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var Q = require('q'); // for promises


////////////////////////////////// SERVER ////////////////////////////

var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);


////////////////////////////////// REQUEST HANDLER ////////////////////////////
exports.serveAssets = function(res, asset, callback) {
  var encoding = {encoding: 'utf8'};

  // 1. check in public folder
  fs.readFile( archive.paths.siteAssets + asset, encoding, function(err, data){
    if(err){
      // 2. file doesn't exist in public, check archive folder
      fs.readFile( archive.paths.archivedSites + asset, encoding, function(err, data){
        if(err){
          // 3. file doesn't exist in either location
          callback ? callback() : exports.send404(res);
        } else {
          // file exists, serve it
          exports.sendResponse(res, data);
        }
      });
    } else {
      // file exists, serve it
      exports.sendResponse(res, data);
    }
  });
};
var actions = {
  'GET': function(request, response){
    var parts = urlParser.parse(request.url);
    var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
    utils.serveAssets(response, urlPath, function(){
      archive.isUrlInList(urlPath.slice(1), function(found){
        if( found ){ // yes:
          // redirect to loading
          utils.sendRedirect(response, '/loading.html');
        } else {
          // 404
          utils.send404(response);
        }
      });
    });
  },
  'POST': function(request, response){
    collectData(request, function(data){
      var url = data.split('=')[1]; // www.google.com
      // in sites.txt ?
      archive.isUrlInList(url, function(found){
        if( found ){ // yes:
          // is archived ?
          archive.isURLArchived(url, function(exists){
            if( exists ){ // yes:
              // redirect to page
              utils.sendRedirect(response, '/'+url);
            } else { // no:
              // redirect to loading
              utils.sendRedirect(response, '/loading.html');
            }
          });
        } else { // no:
          // append to sites
          archive.addUrlToList(url, function(){
            // redirect to loading
            utils.sendRedirect(response, '/loading.html');
          });
        }
      });
    });
  }
};

var handleRequest = function(request, response) {
  var action = actions[request.method];
  if( action ){
    action(request, response);
  } else {
    utils.sendResponse(response, "Not Found", 404);
  }
};

////////////////////////////////// COLLECT DATA ////////////////////////////

var collectData = function(request, callback){
  var data = "";
  request.on("data", function(chunk){
    data += chunk;
  });
  request.on("end", function(){
    callback(data);
  });
};


/////////////////////////////// REDIRECT AND SEND RESPONSE ////////////////////////////

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

var send404 = function(response){
  exports.sendResponse(response, '404: Page not found', 404);
};
var sendRedirect = function(response, location, status){
  status = status || 302;
  response.writeHead(status, {Location: location});
  response.end();
};

var sendResponse = function(response, obj, status){
  status = status || 200;
  response.writeHead(status, headers);
  response.end(obj);
};

////////////////////////////////////////////////////////////////////////////////////////
