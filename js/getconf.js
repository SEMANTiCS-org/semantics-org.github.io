function apply_conf(isindex = false) {
  var base = "../";
  if (isindex) {
    base = "";
  }
  $.get(base+"conf.ini", function(data){
    var lines = data.split("\n");
    var index = {};
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if ((line[0] == "#") || (line == "")){
        continue;
      }else {
        var parts = line.split("=");
        index[parts[0]] = parts[1];
      }
    }
    var nav_tag = document.getElementsByTagName('nav')[0];
    console.log(index);
    nav_tag.innerHTML = nav_tag.innerHTML.replace(/__baseurl__/g,index["baseurl"]);
  });
}

function get_conf(isindex = false) {
  var base = "../";
  if (isindex) {
    base = "";
  }
  $.get(base+"conf.ini", function(data){
    var lines = data.split("\n");
    var index = {};
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if ((line[0] == "#") || (line == "")){
        continue;
      }else {
        var parts = line.split("=");
        index[parts[0]] = parts[1];
      }
    }
    return index;
  });
}
