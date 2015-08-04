///////////////////////////////////////////////////////////////////////////////////////////////

utils.serveAssets(response, urlPath, function(){
  utils.sendRedirect(response, '/loading.html');
  exports.sendRedirect = function(response, location, status){
  status = status || 302;
  response.writeHead(status, {Location: location});
  response.end();
};

exports.serveAssets = function(res, asset, callback) {
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

///////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////


// var disp = function(arr, cl, subclass, cb) {
//   for (var i = 0; i < arr.length; i++) {
//     $newLink = $('<a class="' + subclass + 'href=' + arr[i]['' + subclass] + '</a>');
//     $(cl).append($newLink);
//   }
//   cb();
// };

disp(content, ".links", "link", function() {
        // and then send new html
        fs.readFile('./index.html', 'utf8', function(error, data) {
          if (error) {
            send404(response);
          }
          else {
            sendResponse(response, data);
          }
        });
      });


///////////////////////////////////////////////////////////////////////////////////////////////


// var requestGoogle = function(search) {
//   // console.log('requesting google');
//   var promise = request('https://scholar.google.com/scholar?hl=en&q=' + search, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       return body;
//     }
//   });
//   promise.then(parser.parseString(body, function (err, data) {
//     console.log('d1', data);
//     // console.log(util.inspect(data, false, null));
//   }));
// };

///////////////////////////////////////////////////////////////////////////////////////////////


 //var html = "<div><div><span></span><div class='gs_md_wp gs_ttss' id='gs_ggsW18'><a href='http://stackoverflow.com/'><span class='gs_ggsL'></span><span class='gs_ggsS'>'nature.com'</span></a></div></div></div></div>";
      var html = body;
      var $ = cheerio.load(html);
      var a = $(".gs_md_wp");
      // var link = $(".gs_md_wp.gs_ttss").children();
      // console.log(link.attr("href"));
      console.log(a.html());

      

 // "<div class='gs_md_wp gs_ttss' id='gs_ggsW18'>
      //                     <a href='http://stackoverflow.com/'>
      //                       <span class='gs_ggsL'></span>
      //                       <span class='gs_ggsS'> 'nature.com' </span>
      //                     </a>
      //                 </div>"

      // console.log('body', body);
      // var $ = cheerio.load(body);
      // $(".entry-title > a").each(function() {
      //   var link = $(this);
      //   var text = link.text();
      //   var href = link.attr("href");
      //   console.log(text + " -> " + href);
      // });


///////////////////////////////////////////////////////////////////////////////////////////////

 // var handler = new htmlparser.DefaultHandler(function (error, dom) {
//   if (error) {
//     console.log('error');
//   } else {
//     console.log()
//   }
// });
// var rawHtml = "Xyz <script language= javascript>var foo = '<<bar>>';< /  script><!--<!-- Waah! -- -->";
// var parser = new htmlparser.Parser(handler);
// parser.parseComplete(rawHtml);
// sys.puts(sys.inspect(handler.dom, false, null));

// if(!url) {
//   console.log('oups');
// }
// request('http://' + url).pipe(fs.createWriteStream(url));

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
