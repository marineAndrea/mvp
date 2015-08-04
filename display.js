var array = [ { link: 'http://isites.harvard.edu/fs/docs/icb.topic1155779.files/Tomasello%20and%20Carpenter%202007.pdf' },
  { link: 'http://research.clps.brown.edu/SocCogSci/Publications/Pubs/Malle_Knobe_(1997)_folk_concept_JESP.pdf' } ];

array = [ { journal: 'harvard.edu [PDF]',
    link: 'http://isites.harvard.edu/fs/docs/icb.topic1155779.files/Tomasello%20and%20Carpenter%202007.pdf' },
  { journal: 'brown.edu [PDF]',
    link: 'http://research.clps.brown.edu/SocCogSci/Publications/Pubs/Malle_Knobe_(1997)_folk_concept_JESP.pdf' } ]
    
var modifyContent = function(arr) {
  var res = '<ul>';
  for (var i = 0; i < arr.length; i++) {
    res += '<li><a href=' + arr[i]['link'] + '>' + (''+arr[i]['journal']) + '</a></li>';
  }
  res += '</ul>';
  return res;
};

console.log(modifyContent(array));


