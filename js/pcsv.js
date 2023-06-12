

function get_pc_csv(fcsv, page) {
    $.ajax({
        url : fcsv,
        dataType: "text",
        success : function (fdata) {
            var json_data = $.csv.toObjects(fdata);
            var html_superchairs = "";
            json_data.forEach(function(entry) {
                var fname = entry["first name"].trim();
                var lname = entry["last name"].trim();
                var role = entry["role"].trim().toLowerCase();
                var affiliation = entry["affiliation"].trim();
                var country = entry["country"].trim();
                var email = entry["email"].trim();
                var webpage = entry["Web page"].trim();
                var image = "../img/person/"+entry["image"].trim();

                //add email
                var str_email = "";
                if ((email != "") && (email.includes("@"))) {
                  str_email = "<a href='mailto:"+email+"'>[[VAR]]</i></a>";
                }

                //add country
                var str_country = "";
                if (country != "") {
                  str_country = ", "+country;
                }

                if (page == "pc"){
                  if (role == "pc member") {
                    //var html_entry = "<li>"+fname+" "+lname+" ("+affiliation+str_country+") "+str_email.replace("[[VAR]]","<i class='bi bi-envelope-at'>")+"</li>";
                    // with no Email
                    var html_entry = "<li>"+fname+" "+lname+" ("+affiliation+str_country+")</li>";
                    $("#pc_members").append(html_entry);
                  }
                  if (role == "superchair") {
                    var html_img = '<img typeof="foaf:Image" src="'+image+'" class="image-profile" alt="">'
                    var str_html = '<div class="person col-sm-4">'+html_img+'<div>'+fname+' '+lname+'</div>'+'<div>'+affiliation+"</div>"+"<div class='person-role'>SUPERCHAIR</div>"+"</div>";
                    //var str_html = '<div class="row psc-mem"><div class="col-lg-3 mx-auto image-profile"><img src="'+image+'" class=" image-profile"></div><div class="col-lg-9 mx-auto profile-details"><b>'+fname+' '+lname+'</b><br/>'+affiliation+str_country+'<br/></div></div>';
                    html_superchairs += str_html;
                  }

                }

            });
            $("#psc_members").append("<div class='row section-content persons'>"+html_superchairs+"</div>");

        }
    });
}

function get_oc_csv(fcsv, page, container) {
    $.ajax({
        url : fcsv,
        dataType: "text",
        success : function (fdata) {
          var json_data = $.csv.toObjects(fdata);
          var count = 0;
          var group_html = "";
          var group_num = 0;
          var group_class = "theme-row-alt";
          var current_role_group = "";
          json_data.forEach(function(entry) {
              //header: Conference Committee,Name,Email,Status,Contacted,Easychair,country,affiliation
              var conf_role = entry["Conference Committee"].trim();
              var conf_role_group = entry["Conference Committee Group"].trim();
              var name = entry["Name"].trim();
              var email = entry["Email"].trim();
              var affiliation = entry["affiliation"].trim();
              var country = entry["country"].trim();
              var image = "../img/person/"+entry["image"].trim();
              let img_size = "60"
              var html_img = '<img typeof="foaf:Image" src="'+image+'" class="image-profile" alt="">'
              //add email
              var str_email = "";
              if ((email != "") && (email.includes("@"))) {
                str_email = "<a href='mailto:"+email+"'>[[VAR]]</i></a>";
                str_email = str_email.replace("[[VAR]]",email);
                str_email = "";
              }

              // add role of each person if different from its group
              var add_person_role = false;
              if (conf_role_group.toLowerCase() != conf_role.toLowerCase()) {
                add_person_role = true;
              }

              // group background style
              if (group_num % 2 == 1) {
                group_class = "";
              }else {
                group_class = "";
              }

              if ((current_role_group == "") || (conf_role_group != current_role_group)) {
                if (current_role_group.trim() != ""){
                  $("#"+container).append('<div class="row section-content persons '+group_class+'">'+group_html+'</div>');
                  group_html = "";
                  count = 0;
                }
                $("#"+container).append('<div class="row"><div class="col-lg-12 group-title"><h2>'+conf_role_group+'</h2></div></div>');
                current_role_group = conf_role_group;
                group_num += 1;
              }

              if (count == 3) {
                $("#"+container).append('<div class="row section-content persons '+group_class+'">'+group_html+'</div>');
                group_html = "";
                count = 0;
              }
              //var str_html = '<div class="row profile"><div class="col-lg-12 mx-auto"><div class="row"><div class="col-lg-3 mx-auto role-profile"><h4>'+conf_role+'</h4></div><div class="col-lg-9 mx-auto"><div class="row"><div class="col-lg-3 mx-auto image-profile"><img src="'+image+'" class=" image-profile"></div><div class="col-lg-9 mx-auto profile-details"><b>'+name+'</b><br/>'+affiliation+'<br/>'+country+'<br />'+str_email+'</div></div></div></div></div></div>';
              var html_body = html_img+'<div class="person-name">'+name+'</div>'+'<div class="person-info">'+affiliation+'</div>';
              if (country != "") {
                html_body += '<div class="person-info">'+country+'</div>';
              }
              if (add_person_role) {
                html_body = html_body + '<div class="person-role">'+conf_role.toUpperCase()+'</div>';
              }
              var str_html = '<div class="person col-sm-4">'+html_body+"</div>";
              group_html = group_html + str_html;
              count = count + 1;
          });
          if (group_html != "") {
            $("#"+container).append('<div class="row section-content persons d-flex justify-content-center">'+group_html+'</div>');
          }else {
              document.getElementById(container).lastChild.innerHTML = document.getElementById(container).lastChild.innerHTML.replace("row section-content persons", "row section-content persons d-flex justify-content-center");
          }
        }
    });
}

function populate_logo_list(fcsv, page, container) {
    $.ajax({
        url : fcsv,
        dataType: "text",
        success : function (fdata) {
          var json_data = $.csv.toObjects(fdata);

          var count = 0;
          var group_html = "";
          json_data.forEach(function(entry) {
              //header: Conference Committee,Name,Email,Status,Contacted,Easychair,country,affiliation
              // <div class="org col-sm-3"><a href="http://www.semantic-web.at/" target="_blank"><img typeof="foaf:Image" src="https://2022-eu.semantics.cc/sites/2022-eu.semantics.cc/files/styles/logo/public/Sponsors/swc-logo-web.png?itok=dFh75utd" width="150" height="37" alt=""></a></div>

              var name = entry["name"].trim();
              var img_ratio = entry["img_ratio"].trim().split("/");
              var img = "img/partners_orgs/"+entry["img"].trim();

              let img_size = 3;
              var img_width = parseInt(img_ratio[0]) * img_size;
              var img_height = parseInt(img_ratio[1]) * img_size;
              var html_img = '<img typeof="foaf:Image" src="'+img+'" width="'+img_width.toString()+'" height="'+img_height.toString()+'" alt="">'

              var url = entry["url"].trim();
              var html_url = "<a href='"+url+"' target='_blank'>"+html_img+"</a>";

              var str_html = '<div class="org col-sm-3">'+html_url+"</div>";
              count = count + 1;
              group_html = group_html + str_html;

              if (count == 4) {
                $("#"+container).append('<div class="row section-content orgs">'+group_html+'</div>');
                group_html = "";
                count = 0;
              }
          });
          if (group_html != "") {
            $("#"+container).append('<div class="row section-content orgs d-flex justify-content-center">'+group_html+'</div>');
          }else {
              document.getElementById(container).lastChild.innerHTML = document.getElementById("org_list").lastChild.innerHTML.replace("row section-content orgs", "row section-content orgs d-flex justify-content-center");
          }
        }
    });
}

function populate_sponsors_list(fcsv, page, container) {
    $.ajax({
        url : fcsv,
        dataType: "text",
        success : function (fdata) {
          var json_data = $.csv.toObjects(fdata);
          var MAX_ELEMS = 2;
          var col_size = 12/MAX_ELEMS;

          var sponsor_type_list = ["gold","silver","bronze","startup"]
          for (var i = 0; i < sponsor_type_list.length; i++) {

            var count = 0;
            var count_by_type = 0;
            var group_html = "";
            sponsor_type = sponsor_type_list[i];

            //add sponsor header
            $("#"+container+" #s_"+sponsor_type).append('<div class="row section-content sponsor-header justify-content-center"><img width="80px" height="80px" typeof="foaf:Image" src="img/icons/'+sponsor_type+'.svg"></div>');

            json_data.forEach(function(entry) {
                if (entry["type"].trim() == sponsor_type) {

                    var name = entry["name"].trim();
                    var img_ratio = entry["img_ratio"].trim().split("/");
                    var img = "img/sponsors/"+entry["img"].trim();

                    let img_size = 3;
                    var img_width = parseInt(img_ratio[0]) * img_size;
                    var img_height = parseInt(img_ratio[1]) * img_size;
                    // for propotions use:
                    var html_img = '<img class="sponsor-img" width="'+img_width.toString()+'" height="'+img_height.toString()+'" typeof="foaf:Image" src="'+img+'" alt="">'
                    //var html_img = '<img class="sponsor-img" typeof="foaf:Image" src="'+img+'" alt="">'

                    var url = entry["url"].trim();
                    var html_url = "<a href='"+url+"' target='_blank'>"+html_img+"</a>";

                    var str_html = '<div class="sponsor d-flex align-items-center justify-content-center col-'+col_size.toString()+'">'+html_url+"</div>";
                    count = count + 1;
                    count_by_type = count_by_type + 1;
                    group_html = group_html + str_html;

                    if (count == MAX_ELEMS) {
                      $("#"+container+" #s_"+sponsor_type).append('<div class="row section-content sponsors justify-content-center">'+group_html+'</div>');
                      group_html = "";
                      count = 0;
                    }
                }
            });
            if (group_html != "") {
              while (MAX_ELEMS - count > 0) {
                //group_html += '<div class="sponsor col-'+col_size.toString()+'"></div>';
                count += 1;
              }
              $("#"+container+" #s_"+sponsor_type).append('<div class="row section-content sponsors justify-content-center">'+group_html+'</div>');
            }
            if (count_by_type == 0) {
              $("#"+container+" #s_"+sponsor_type).remove();
            }

          }


        }
    });
}

function populate_keyspeakers(fcsv, page, container, baseurl) {
    $.ajax({
        url : fcsv,
        dataType: "text",
        success : function (fdata) {
          var json_data = $.csv.toObjects(fdata);

          var count = 0;
          var group_html = "";
          json_data.forEach(function(entry) {
              //header: Conference Committee,Name,Email,Status,Contacted,Easychair,country,affiliation
              // <div class="org col-sm-3"><a href="http://www.semantic-web.at/" target="_blank"><img typeof="foaf:Image" src="https://2022-eu.semantics.cc/sites/2022-eu.semantics.cc/files/styles/logo/public/Sponsors/swc-logo-web.png?itok=dFh75utd" width="150" height="37" alt=""></a></div>

              var name = entry["name"].trim();
              var affiliation = entry["affiliation"].trim();
              var presentation = entry["presentation"].trim();
              var page_name = entry["page_name"].trim();
              var img = entry["image"].trim();
              let img_size = "60"

              var html_img = '<img typeof="foaf:Image" src="img/person/'+img+'" class="image-profile" alt="">'
              var html_presentation = "<a href='"+baseurl+"page/speakers?page="+page_name+"' class='person-talk'>"+presentation+"</a>";
              var html_body = html_img+'<div class="person-name">'+name+'</div>'+'<div class="person-info">'+affiliation+'</div>'+html_presentation;

              var str_html = '<div class="ks col-sm-4">'+html_body+"</div>";
              group_html = group_html + str_html;
              count = count + 1;
              if (count == 3) {
                $("#"+container).append('<div class="row section-content kss">'+group_html+'</div>');
                group_html = "";
                count = 0;
              }
          });
          if (group_html != "") {
            $("#"+container).append('<div class="row section-content kss d-flex justify-content-center">'+group_html+'</div>');
          }else {
              document.getElementById(container).lastChild.innerHTML = document.getElementById(container).lastChild.innerHTML.replace("row section-content kss", "row section-content kss d-flex justify-content-center");
          }
        }
    });
}

function populate_quotes_container(fcsv, page, container, baseurl) {

  $.ajax({
      url : fcsv,
      dataType: "text",
      success : function (fdata) {
        var json_data = $.csv.toObjects(fdata);
        var body_html = `
              <div id="carousel_container" class="carousel slide" data-ride="carousel">
                  <ol class="carousel-indicators">
                    __INDICATORS__
                  </ol>
                  <div class="carousel-inner">
                      __SLIDES__
                  </div>
              </div>
        `;

        all_html_elems = "";
        all_html_ol = "";
        count_slide = 0;
        is_active = "active";
        json_data.forEach(function(entry) {
          var name = entry["person"].trim();
          var affiliation = entry["affiliation"];
          var quote = entry["quote"];

          var image = "../img/person/"+entry["img"].trim();
          if (page == "index") {
            image = baseurl+"img/person/"+entry["img"].trim();
          }

          var html_img = '<img typeof="foaf:Image" src="'+image+'" class="image-profile" alt="">';
          var person_body = html_img+'<div class="person-name">'+name+'</div>'+'<div class="person-info">'+affiliation+'</div>';

          all_html_elems += `
              <div class="carousel-item `+is_active+`">
                <div class="row">
                  <div class="col-lg-5 mx-auto text-center align-self-center">`+person_body+`</div>
                  <div class="col-lg-7 mx-auto text-justify align-self-center person-quote"><i>"`+quote+`"</i></div>
                </div>
          </div>`;
          all_html_ol += `<li data-target="#carousel_container" data-slide-to="`+count_slide.toString()+`" class="`+is_active+`"></li>`;
          count_slide += 1;
          is_active = "";
        });

        body_html = body_html.replace('__INDICATORS__', all_html_ol);
        body_html = body_html.replace('__SLIDES__', all_html_elems);
        $("#"+container).append(body_html);
      }
    });
}


function populate_news_container(fcsv, page, container, baseurl) {
  $.ajax({
      url : fcsv,
      dataType: "text",
      success : function (fdata) {
        var json_data = $.csv.toObjects(fdata);
        var body_html = `<div class="row section-content"> __NEWS__ </div>`;
        var all_html_elems = "";
        var count_news = 1;
        const MAX_NEWS = 4;
        json_data.forEach(function(entry) {
          if (count_news <= MAX_NEWS) {
            var title = entry["title"].trim();
            var text = entry["text"];
            var page_name = entry["page_name"];
            var image = "../img/news/"+entry["img"].trim();
            if (page == "index") {
              image = baseurl+"img/news/"+entry["img"].trim();
            }

            var html_img = '<div class="container-img-news"><img typeof="foaf:Image" src="'+image+'" class="news-img" alt=""></div>';
            all_html_elems += `<div class="col-lg-3 mx-auto text-justify news-box">`
                    + html_img
                    + `<h5>`+title + `</h5>`
                    + `<div class="news-abs">`
                    + text
                    + `</div>`
                    + `<div class="news-link text-right"><a href="`+baseurl+"page/news?page="+page_name+`">READ MORE</a></div>`
                    + `</div>`;
          }
          count_news += 1;
        });

        body_html = body_html.replace('__NEWS__', all_html_elems);
        $("#"+container).append(body_html);
      }
    });
}

function populate_news_list_container(fcsv, page, container, baseurl) {
  $.ajax({
      url : fcsv,
      dataType: "text",
      success : function (fdata) {
        var json_data = $.csv.toObjects(fdata);
        var body_html = ``;
        var all_html_elems = `<div class='row'><div style="padding:5px;" class="col-lg-12 mx-auto text-center"><h2>ALL NEWS</h2></div></div><div><div>`;
        var prev_date_group = "";
        json_data.forEach(function(entry) {
          var title = entry["title"].trim();
          var page_name = entry["page_name"];
          //get date
          const index_months = {  "01": "January",  "02": "February",  "03": "March",  "04": "April",  "05": "May",  "06": "June",  "07": "July",  "08": "August",  "09": "September",  "10": "October",  "11": "November",  "12": "December"};
          var parts_date = page_name.split("-");
          const year = parts_date[0];
          const month = parts_date[1];
          const day = parts_date[2];
          const g_date_id = month+"_"+year;
          const g_date = index_months[month] + ", "+ year;
          if (g_date != prev_date_group) {
              all_html_elems += `</div></div>`
                +`<div class="card-header" id="heading_`+g_date_id+`"><button class="btn" data-toggle="collapse" data-target="#collapse_`+g_date_id+`" aria-expanded="true" aria-controls="collapse_`+g_date_id+`">`
                + g_date
                + `</button></div>`
                + `<div id="collapse_`+g_date_id+`" class="collapse show" aria-labelledby="heading_`+g_date_id+`" data-parent="#allnews">`
                + `<div class="card-body">`;
              prev_date_group = g_date
          }

          all_html_elems += `<div class="row">
                              <a href="`+baseurl+"page/news?page="+page_name+`"> >> `+title+`</a>
                            </div>`;
        });

        all_html_elems += `</div></div>`
                            +`<div class="card-header" id="heading_news_2022"><a href="https://2022-eu.semantics.cc/interviews-and-news">Check past news (from SEMANTiCS 2022)</a></div>`;

        body_html = all_html_elems + `</div></div>`;
        body_html = `<div id="allnews"><div class="card">`+body_html+`</div></div>`;
        $("#"+container).append(body_html);
      }
    });
}

function populate_ks_att(fcsv, page, container, baseurl) {
  const current_page = urlParams.get('page');
  $.ajax({
      url : fcsv,
      dataType: "text",
      success : function (fdata) {
        var json_data = $.csv.toObjects(fdata);
        var body_html = ``;
        var all_html_elems = `<div class='row'><div style="padding:5px;" class="col-lg-12 mx-auto text-center"><h2>ALL Available material for this talk</h2></div></div><div><div>`;
        var prev_date_group = "";
        json_data.forEach(function(entry) {
          var page_name = entry["page_name"];
          if (current_page == page_name) {
            console.log(entry);
          }

          all_html_elems += `<div class="row"><a href="`+baseurl+"page/kp?page="+page_name+`"> >> `+title+`</a></div>`;
        });

        all_html_elems += `</div></div>`;

        body_html = all_html_elems + `</div></div>`;
        body_html = `<div id="allnews"><div class="card">`+body_html+`</div></div>`;
        $("#"+container).append(body_html);
      }
    });
}


function build_pc(conf){
  get_pc_csv(conf["baseurl"]+"content/pc.csv", "pc");
}

function build_oc(conf){
  get_oc_csv(conf["baseurl"]+"content/oc.csv", "oc", "oc_members");
}

function build_organizers_list(conf){
  populate_logo_list(conf["baseurl"]+"content/organizers.csv", "index","org_list");
}

function build_partners_list(conf){
  populate_logo_list(conf["baseurl"]+"content/partners.csv", "index","partners_list");
}

function build_sponsors_list(conf){
  populate_sponsors_list(conf["baseurl"]+"content/sponsors.csv", "index","sponsors_list");
}

function build_ks(conf){
  populate_keyspeakers(conf["baseurl"]+"content/keyspeakers.csv", "index", "keynote_list", conf["baseurl"]);
}
function build_ks_att(conf){
  populate_ks_att(conf["baseurl"]+"content/keyspeakers.csv", "keyspeakers","ks_att", conf["baseurl"]);
}

function build_quotes(conf){
  populate_quotes_container(conf["baseurl"]+"content/quotes.csv", "index","quotes", conf["baseurl"]);
}

function build_news(conf){
  populate_news_container(conf["baseurl"]+"content/news.csv", "index","news", conf["baseurl"]);
}

function build_news_list(conf){
  populate_news_list_container(conf["baseurl"]+"content/news.csv", "news","news_list", conf["baseurl"]);
}
