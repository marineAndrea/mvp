/////////////////////////////// LIBRARIES ////////////////////////////

var http = require('http');
var fs = require('fs');
var request = require('request');
var util = require('util');
var cheerio = require("cheerio");
// var q = require('q');
// var htmlparser = require("htmlparser");
//var qs = require('querystring');
// var parser = require('xml2js').parseString;
//var parser = parseString.Parser();


/////////////////////////////// SERVER ////////////////////////////

http.createServer(function (request, response) {
  console.log('handling '+ request.method + " request for url: " + request.url);
  // console.log('server starting...');
  if (request.method === 'POST') {
    // console.log('post starting...');
    postHandler(request, response);
  } else if (request.method === 'GET') {
    // console.log('get starting...');
    getHandler(request, response);
  } else {
    // console.log('404...');
    send404(response);
  }
}).listen(8080, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8080/');


/////////////////////////////// REQUEST HANDLER ////////////////////////////

var postHandler = function(request, response) {
  var search = '';
  request.on("data", function(chunk) {
    search += chunk;
  });
  request.on("end", function() {
    search = search.split('=')[1];
    console.log('on end', search);
    // send request to google scholar
    requestGoogle(search, function (data) {
      response.writeHead(200, headers);
      response.end(data);
    });
    // at https://scholar.google.com/scholar?hl=en&q=
  });
};

var getHandler = function(request, response) {
  fs.readFile('./index.html', 'utf8', function(error, data) {
    if (error) {
      send404(response);
    }
    else {
      sendResponse(response, data);
    }
  });
};


/////////////////////////////// REQUEST GOOGLE ////////////////////////////

var requestGoogle = function(search, cb) {
  console.log('requesting google');
  request('https://scholar.google.com/scholar?hl=en&q=' + search, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      // var output = parsit("<div><div><span></span><div class='gs_md_wp gs_ttss' id='gs_ggsW18'><a href='http://stackoverflow.com/'><span class='gs_ggsL'></span><span class='gs_ggsS'>'nature.com'</span></a></div></div></div></div>");
      //var output = parsit(body);
      // console.log('output', output);
      cb();
    }
  });
};

var parsit = function(body){
  var beg = body.indexOf("gs_md_wp gs_ttss") + 41;
  var res = '';
  var end = parseEnd(beg, body);
  for (var i = beg; i <= end; i++) {
    res += body[i];
  };
  return res;
}

var parseEnd = function(idx, body) {
  idx += 1;
  while (true) {
    if (body[idx] !== "'") {
      idx++
    } else {
      return idx;
    }
  }
}
/////////////////////////////// REDIRECT AND SEND RESPONSE ////////////////////////////

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

var send404 = function(response){
  sendResponse(response, '404: Page not found', 404);
};

var sendResponse = function(response, obj, status){
  status = status || 200;
  response.writeHead(status, headers);
  response.end(obj);
};

////////////////////////////////////////////////////////////////////////////////////////


