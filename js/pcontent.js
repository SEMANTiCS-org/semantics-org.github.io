function update_nav(val) {
  var nav_tag = document.getElementsByTagName('nav')[0];
  nav_tag.innerHTML = nav_tag.innerHTML.replace(/__baseurl__/g,val["baseurl"]);
  var header_tag = document.getElementById('topHeader');
  header_tag.innerHTML = header_tag.innerHTML.replace(/__baseurl__/g,val["baseurl"]);
}

function update_footer(val) {
  var footer_tag = document.getElementsByTagName('footer')[0];
  footer_tag.innerHTML = footer_tag.innerHTML.replace(/__baseurl__/g,val["baseurl"]);
}