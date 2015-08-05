/////////////////////////////// LIBRARIES ////////////////////////////

var http = require('http');
var fs = require('fs');
var request = require('request');
var cheerio = require("cheerio");


/////////////////////////////// PARSER ////////////////////////////

var parsit = function(body, cb) {
  var content = [];
  var html = body;
  var $ = cheerio.load(html);
  $('.gs_md_wp.gs_ttss').each(function(i, el) {
    var sibl = $(el).parent().next().children().first().children().first().text();
    var child = $(el).children().children($('span.gs_ggsS')).text();
    content.push({journal: child});
    content[i]['title'] = sibl;
    content[i]['link'] = $(el).children().attr("href");
  });
  console.log('parsed', content);
  cb(content);
} 


/////////////////////////////// SERVER ////////////////////////////

http.createServer(function (request, response) {
  console.log('handling '+ request.method + " request for url: " + request.url);
  if (request.method === 'POST') {
    postHandler(request, response);
  } else if (request.method === 'GET') {
    getHandler(request, response);
  } else {
    send404(response);
  }
}).listen(8080, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8080/');


/////////////////////////////// REQUEST HANDLER ////////////////////////////

var postHandler = function(request, response) {
  console.log('post request');
  var search = '';
  request.on("data", function(chunk) {
    search += chunk;
  });
  request.on("end", function() {
    search = search.split('=')[1];
    // send request to google scholar at https://scholar.google.com/scholar?hl=en&q=
    requestGoogle(search, function(content) {

      writeContent(content, function() {
        fs.readFile('./results.html', function(err, data){
          sendResponse(response, data);
        });
      });

    });
  });
};


var getHandler = function(request, response) {
  console.log('get request');
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
      // console.log(body);
      parsit(body, function(body) {
        cb(body);
      });
    }
  });
};


/////////////////////////////// WRITE HTML FILE ////////////////////////////

var writeContent = function(content, cb) {
  modifyContent(content);
  deleteContent(function() {
    fs.appendFile('./results.html', modifyContent(content), function(err, file) {
      cb();
    });
  });
};

var deleteContent = function(cb) {
  fs.writeFile('./results.html', '', function() {
    cb();
  })
};

var modifyContent = function(arr) {
  var res = '<body><br><h1>Open Scholar</h1><br><br>';
  res +=  '<h2>Enter your request to Google Scholar</h2><form method="POST"><input type="text" name="search"></input></form><br><br>'
  for (var i = 0; i < arr.length; i++) {
    res += '<h3 class="title">' + (''+arr[i]['title']) + '</h3>' + '<a href=' + arr[i]['link'] + '>' + (''+arr[i]['journal']) + '</a><br><br>';
  }
  res += '</body>';
  return res;
};

/////////////////////////////// REDIRECT AND SEND RESPONSE ////////////////////////////

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
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