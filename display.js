// for (var i = 0; i < content.length; i++) {
//   content[i]['link']
//   $newLink = $('<a class="link" href=' + content[i]['link'] + '</a>');
//   $("#links").append($newLink);
// }

// var disp = function(arr, cl, subclass) {
//   for (var i = 0; i < arr.length; i++) {
//     $newLink = $('<a class="' + subclass + 'href=' + arr[i]['' + subclass] + '</a>');
//     $(cl).append($newLink);
//   }
//   return 'yeah';
// }


var array = [ { link: 'http://isites.harvard.edu/fs/docs/icb.topic1155779.files/Tomasello%20and%20Carpenter%202007.pdf' },
  { link: 'http://research.clps.brown.edu/SocCogSci/Publications/Pubs/Malle_Knobe_(1997)_folk_concept_JESP.pdf' } ];
// console.log(disp(array, 'links', 'link'));

// var modifyContent = function(arr) {
//   var res = '<ul>';
//   for (var i = 0; i < arr.length; i++) {
//     res += '<li><a href=' + arr[i]['link'] + '>title' + (''+(i+1)) + '</a></li>';
//   }
//   res += '</ul>';
//   return res;
// }

// console.log(modifyContent(array));

var fs = require('fs');

var writeContent = function(content) {
  fs.appendFile('./results.html', modifyContent(content), function(err, file){
    return file;
  });
}


var modifyContent = function(arr) {
  var res = '<ul>';
  for (var i = 0; i < arr.length; i++) {
    res += '<li><a href=' + arr[i]['link'] + '>title' + (''+(i+1)) + '</a></li>';
  }
  res += '</ul>';
  return res;
}

console.log(writeContent(array));