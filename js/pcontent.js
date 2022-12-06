function update_nav(val) {
  var nav_tag = document.getElementsByTagName('nav')[0];
  nav_tag.innerHTML = nav_tag.innerHTML.replace(/__baseurl__/g,val["baseurl"]);
}
