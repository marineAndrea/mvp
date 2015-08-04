var http = require('http');
var fs = require('fs');
var request = require('request');
// var qs = require('querystring');

http.createServer(function (request, response) {
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


var postHandler = function(request, response) {
  var search = '';
  request.on("data", function(chunk) {
    search += chunk;
  });
  request.on("end", function() {
    search = search.split('=')[1]
    console.log('on end', search);
    // send request to google scholar
    requestGoogle(search);
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

var requestGoogle = function(search) {
  request('https://scholar.google.com/scholar?hl=en&q=' + search, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(typeof body) // Show the HTML for the Google homepage. 
    }
  });

  // console.log('req being send to google');
  // var url = 'https://scholar.google.com/scholar?hl=en&q=' + search;
  // console.log('url', url);
  // if(!url) {
  //   console.log('oups');
  // }
  // request('http://' + url).pipe(fs.createWriteStream(url));
  // console.log('request done');
};


// readListOfUrls(archive.downloadUrls);
// readListOfUrls = function(callback){
//   fs.readFile(exports.paths.list, function(err, sites) {
//     sites = sites.toString().split('\n');
//     if( callback ){
//       callback(sites);
//     }
//   });
// };
// downloadUrls = function(urls){
//   // Iterate over urls and pipe to new files
//   _.each(urls, function(url) {
//     if(!url){ return; }
//     request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + "/" + url));
//   });
//   return true;
// };
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


