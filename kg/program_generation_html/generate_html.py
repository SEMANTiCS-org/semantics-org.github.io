from rdflib import Graph, Namespace, Literal
from rdflib.namespace import RDF, RDFS
from rdflib.plugins.sparql import prepareQuery

schema = Namespace("https://schema.org/")
g = Graph()
g.parse("../rdf/out.nt", format="ntriples")

# Contants
html_page_start = """
<!DOCTYPE html>
<html lang="en">

<head>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="description" content="">
	<meta name="author" content="">

	<title>SEMANTICS-2023</title>

	<!-- Bootstrap core CSS -->
	<link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

	<!-- Custom styles for this template -->
	<link href="../css/scrolling-nav.css" rel="stylesheet">

	<link href="../css/style.css" rel="stylesheet">
	<link href="../css/accepted_papers_posters.css" rel="stylesheet">
	<link rel="icon" href="../img/semantics2023-logo-white-browser.ico">

	<!-- Mark down -->
	<script type="module" src="../vendor/zero-md-v2/zero-md.min.js"></script>

	<script src="../vendor/jquery/jquery.min.js"></script>

	<script src="../js/getconf.js"></script>
	<script src="../js/pcontent.js"></script>
	<style>
		.custom-link {
		  color: #fefefe;
		  text-decoration: none;
		  transition: color 0.3s, border-bottom 0.3s;
		}
		
		.custom-link:hover {
		  color: #fefefe; 
		}
		</style>

</head>

<body id="page-top">

	<div id="nav-placeholder">

	</div>

	<script>
		$(function() {
			$("#nav-placeholder").load("nav.html", function functionName() {apply_conf_onfunc(update_nav, false);});
			$("#page-footer").load("footer.html", function functionName() {apply_conf_onfunc(update_footer, false);});
		});
	</script>

	<section>
		<div class="container">

			<div class="row">
				<div class="col-lg-12 mx-auto">
							<zero-md src="../content/accepted_papers.md">
								<template><link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"/><link href="../css/md-style.css" rel="stylesheet"/></template>
							</zero-md>
				</div>
			</div>

			<div class="row">
                <div class="col-lg-12 mx-auto">
                    <!-- Creates the bootstrap modal where the image will appear -->
                    <div class="modal fade" id="imagemodal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <!--
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                                </div>
                                -->
                                <div class="modal-body">
                                    <!--img src="" id="imagepreview" style="width: 400px; height: 264px;"-->
                                    <img src="img/illustrations/placeholder.jpg" id="imagepreview" class="img-fluid">
                                </div>
                                <div class="modal-footer">
                                    <span>Credits: <a href="">[ARTIST]</a></span>
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
			</div>
"""

html_page_end = """
</div>
	</section>

	<!-- Footer -->
	<footer id="page-footer"></footer>

	<!-- Bootstrap core JavaScript -->
	<script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

	<!-- Plugin JavaScript -->
	<script src="../vendor/jquery-easing/jquery.easing.min.js"></script>

	<!-- Custom JavaScript for this theme -->
	<script src="../js/scrolling-nav.js"></script>

	<script>
		$(".pop").on("click", function() {
			$('#imagepreview').attr('src', $(this).find("img").attr('src'));
			$('#imagemodal').modal('show');
		});
	</script>

</body>

</html>
"""

template_card_start = """
<div class="col-lg-4 mx-auto text-justify">
    <div class="card">
        <a class="pop" href="[URL_LINK]"><img class="card-img-top" src="../img/illustrations/placeholder.jpg" alt=""></a>
        <div class="card-body">
            <p class="card-text"> <u>[TITLE]</u>. <br/>[AUTHORS].<br/><i><strong>(Paper URL and illustration coming soon)</strong></i><!--<span data-toggle="tooltip" data-placement="top" title="[TITLE]" data-original-title="Digital Object Identifier"><a href="https://doi.org"><img src="../img/icons/doi.png" width="20"></a></span>--></p>
            <ul class="text-left">
                    <!-- LINKED RESOURCES -->
    """
template_card_end = """
            </ul>
        </div>
    </div>
</div>
"""

template_resource_list_start = """
                <!-- RESOURCE_TYPE -->
                <li class="resource-type"><strong>RESOURCE_TYPE</strong>:
                    <ul>
"""
template_resource_list_end = """
                    </ul>
                </li>
"""
template_resource_start = """
<li>
    <a href="[VALUE]"><i class="fas fa-external-link-alt"></i> <span data-toggle="tooltip" data-placement="top" title="[Description not available]" data-original-title="[CODE REPOSITORY]">[CODE REPOSITORY]</span></a>
"""
template_resource_end = "</li>"
template_resource_doi = """<span data-toggle="tooltip" data-placement="top" title="" data-original-title="Digital Object Identifier"><a href="[DOI_LINK]"><img src="../img/icons/doi.png" width="20"></a></span>"""
template_resource_license = """ (<span class="badge badge-primary" data-toggle="tooltip" data-placement="top" title="[LICENSE_NAME]" data-original-title="License"><a href="[LICENSE_URL]" class="custom-link">[LICENSE_NAME]</a></span>)"""



def get_template(paper_uri, title, authors, image, url):
    string_to_return = template_card_start.replace("[TITLE]",title)
    string_to_return = string_to_return.replace("[AUTHORS]",authors)
    if(image):
        string_to_return = string_to_return.replace("../img/illustrations/placeholder.jpg", image)
    if(url):
        url_string = "URL: <a href=\""+url+"\">"+url+"</a>" 
        string_to_return = string_to_return.replace("(Paper URL and illustration coming soon)", url_string)
        string_to_return = string_to_return.replace("[URL_LINK]", url)

    query = '''
    SELECT distinct ?url ?t ?name ?licenseName ?licenseURI ?description ?doi WHERE {
        <%s> schema:hasPart ?resource.
        ?resource a ?t.
        ?resource schema:url ?url.
        optional {?resource schema:name ?name}.
        optional {?resource schema:license ?l.
                  ?l schema:name ?licenseName;
                     schema:url ?licenseURI}.
        optional {?resource schema:description ?description}.
        optional {?resource schema:identifier ?doi}.
    }
    '''%(paper_uri)

    q2 = prepareQuery(query, initNs = {"schema":schema})
    datasets = []
    code = []
    demo = []
    ontology = []
    for resource in g.query(q2):
        type = resource.t
        resource_card = template_resource_start.replace("[VALUE]",resource.url)
        if (resource.name):
            resource_card = resource_card.replace("[CODE REPOSITORY]",resource.name)
        if (resource.description):
            resource_card = resource_card.replace("[Description not available]",resource.description)
        if (resource.doi):
            resource_card += template_resource_doi.replace("[DOI_LINK]",resource.doi)
        if(resource.licenseName):
            resource_card += template_resource_license.replace("[LICENSE_NAME]", resource.licenseName).replace("[LICENSE_URL]", resource.licenseURI)
        resource_card += template_resource_end 
        if "Dataset" in type:
            datasets.append(resource_card)
        elif "Code" in type:
            code.append(resource_card)
        elif "Ontology" in type:
            ontology.append(resource_card)
        elif "Application" in type:
            demo.append(resource_card)

    if len(code) > 0:
        string_to_return += template_resource_list_start.replace("RESOURCE_TYPE", "Code")
        for c in code:
            string_to_return += c
        string_to_return += template_resource_list_end
    if len(datasets) > 0:
        string_to_return += template_resource_list_start.replace("RESOURCE_TYPE", "Data")
        for c in datasets:
            string_to_return += c
        string_to_return += template_resource_list_end
    if len(ontology) > 0:
        string_to_return += template_resource_list_start.replace("RESOURCE_TYPE", "Ontologies")
        for c in ontology:
            string_to_return += c
        string_to_return += template_resource_list_end
    if len(demo) > 0:
        string_to_return += template_resource_list_start.replace("RESOURCE_TYPE", "Demo")
        for c in demo:
            string_to_return += c
        string_to_return += template_resource_list_end


    return  string_to_return + template_card_end

def write_html(location, cards):
    """
    Given a list of cards (HTML formatted rows) this method prints them in a list, with three  per row.
    Contents are saved at the location
    """
    with open(location, 'w') as file:
        html = html_page_start
        count = 0
        for c in cards:
            if count % 3 == 0:
                html += """ <div class="row">\n"""
            html += c + "\n"
            if count % 3 == 2:
                html += """ </div><br/>\n"""
            count += 1
        # In case there is an odd number
        if count % 3 != 2:
                html += """ </div><br/>\n"""

        html += html_page_end
        file.write(html)

    


# Get the paper titles by research track ordered alphabetically (including those without resources)
q1 = prepareQuery('''
  SELECT distinct ?paperURI ?paperTitle ?authorString ?trackName ?img ?url WHERE {
    ?paperURI a schema:ScholarlyArticle;  
        <https://w3id.org/okn/semantics/voc#authorString> ?authorString; 
        schema:isPartOf/schema:name ?trackName;
        schema:name ?paperTitle.
    optional {?paperURI schema:hasPart ?resource}.
    optional {?paperURI schema:image ?img}.
    optional {?paperURI schema:url ?url}.
    
  }order by ?paperTitle
  ''', initNs = { "schema":schema})

demo_cards = []
research_cards = []
industry_cards = []

for paper in g.query(q1):
    track = paper.trackName
    card = get_template(paper.paperURI, paper.paperTitle, paper.authorString, paper.img, paper.url)
    if "Posters and Demos" in track:
        demo_cards.append(card)
    elif "Research" in track:
        research_cards.append(card)
    elif "Industry" in track:
        industry_cards.append(card)

write_html("accepted_posters.html", demo_cards)
write_html("accepted_research.html", research_cards)
write_html("accepted_industry.html", industry_cards)
