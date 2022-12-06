

function get_pc_csv(fcsv, page) {
    $.ajax({
        url : fcsv,
        dataType: "text",
        success : function (fdata) {
            var json_data = $.csv.toObjects(fdata);
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
                    var lower_name = lname.toLowerCase();
                    // with Email
                    //var str_html = '<div class="row psc-mem"><div class="col-lg-3 mx-auto image-profile"><img src="'+image+'" class=" image-profile"></div><div class="col-lg-9 mx-auto profile-details"><b>'+fname+' '+lname+'</b><br/>'+affiliation+str_country+'<br/>'+str_email.replace("[[VAR]]",email)+'</div></div>';
                    // with no Email
                    var str_html = '<div class="row psc-mem"><div class="col-lg-3 mx-auto image-profile"><img src="'+image+'" class=" image-profile"></div><div class="col-lg-9 mx-auto profile-details"><b>'+fname+' '+lname+'</b><br/>'+affiliation+str_country+'<br/></div></div>';
                    $("#psc_members").append(str_html);
                  }

                }

            });
        }
    });
}

function get_oc_csv(fcsv, page) {
    $.ajax({
        url : fcsv,
        dataType: "text",
        success : function (fdata) {
          var json_data = $.csv.toObjects(fdata);
          json_data.forEach(function(entry) {
              //header: Conference Committee,Name,Email,Status,Contacted,Easychair,country,affiliation
              var conf_role = entry["Conference Committee"].trim();
              var name = entry["Name"].trim();
              var email = entry["Email"].trim();
              var affiliation = entry["affiliation"].trim();
              var country = entry["country"].trim();
              var image = "../img/person/"+entry["image"].trim();
              //add email
              var str_email = "";
              if ((email != "") && (email.includes("@"))) {
                str_email = "<a href='mailto:"+email+"'>[[VAR]]</i></a>";
                str_email = str_email.replace("[[VAR]]",email);
                str_email = "";
              }

              var str_html = '<div class="row profile"><div class="col-lg-12 mx-auto"><div class="row"><div class="col-lg-3 mx-auto role-profile"><h4>'+conf_role+'</h4></div><div class="col-lg-9 mx-auto"><div class="row"><div class="col-lg-3 mx-auto image-profile"><img src="'+image+'" class=" image-profile"></div><div class="col-lg-9 mx-auto profile-details"><b>'+name+'</b><br/>'+affiliation+'<br/>'+country+'<br />'+str_email+'</div></div></div></div></div></div>';
              $("#oc_members").append(str_html);
          });
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
              var img = entry["img"].trim();

              let img_size = 3;
              var img_width = parseInt(img_ratio[0]) * img_size;
              var img_height = parseInt(img_ratio[1]) * img_size;
              var html_img = '<img typeof="foaf:Image" src="'+img+'" width="'+img_width.toString()+'" height="'+img_height.toString()+'" alt="">'

              var url = entry["url"].trim();
              var html_url = "<a href='mailto:"+url+"' target='_blank'>"+html_img+"</a>";

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

function build_pc(conf){
  get_pc_csv(conf["baseurl"]+"content/pc.csv", "pc");
}

function build_oc(conf){
  get_oc_csv(conf["baseurl"]+"content/oc.csv", "oc");
}

function build_organizers_list(conf){
  populate_logo_list(conf["baseurl"]+"content/organizers.csv", "index","org_list");
}

function build_partners_list(conf){
  populate_logo_list(conf["baseurl"]+"content/partners.csv", "index","partners_list");
}
