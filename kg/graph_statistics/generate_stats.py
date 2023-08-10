from rdflib import Graph, Namespace, Literal
from rdflib.namespace import RDF, RDFS
from rdflib.plugins.sparql import prepareQuery

schema = Namespace("https://schema.org/")
g = Graph()
g.parse("../rdf/out.nt", format="ntriples")
g.serialize("out.ttl",format='ttl')

# How many papers were submitted?
q1 = prepareQuery('''
  SELECT (count(distinct ?paperTitle) as ?c) WHERE {
    ?resource a schema:ScholarlyArticle;
    schema:name ?paperTitle.
  }
  ''', initNs = { "schema":schema})
for r in g.query(q1):
  print("Number of papers: ",r.c)

# How many papers had resources?
q1 = prepareQuery('''
  SELECT (count(distinct ?p) as ?c) WHERE {
    ?p a schema:ScholarlyArticle;
       schema:hasPart ?resource.
  }
  ''', initNs = { "schema":schema})
for r in g.query(q1):
  print("Number of papers with resources: %s"% r.c)

# Number of resources by type
q1 = prepareQuery('''
SELECT (count(distinct ?resource) as ?c) ?type  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  ?resource a ?type.
}group by ?type
''', initNs = { "schema":schema})

print("Papers with datasets, with code or ontologies:")
for r in g.query(q1):
  print(r.type, r.c)

# Resources with license
q1 = prepareQuery('''
SELECT (count(distinct ?resource) as ?c)  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  ?resource schema:license ?l.
}
''', initNs = { "schema":schema})

for r in g.query(q1):
  print("Resources with license: ", r.c)

# Papers with resources with license
q1 = prepareQuery('''
SELECT (count(distinct ?p) as ?c)  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  ?resource schema:license ?l.
}
''', initNs = { "schema":schema})

for r in g.query(q1):
  print("Papers with resources with license: ", r.c)

# Papers with no license in some resources
q1 = prepareQuery('''
SELECT (count(distinct ?p) as ?c)  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  filter not exists{?resource schema:license ?l.}
}
''', initNs = { "schema":schema})

for r in g.query(q1):
  print("Papers with no license in some resource: ", r.c)

# Resources with DOIs
q1 = prepareQuery('''
SELECT (count(distinct ?resource) as ?c)  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  ?resource schema:identifier ?i.
}
''', initNs = { "schema":schema})

for r in g.query(q1):
  print("Resources with DOIs: ", r.c)


# Papers with DOIs on their resources
q1 = prepareQuery('''
SELECT (count(distinct ?p) as ?c)  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  ?resource schema:identifier ?i.
}
''', initNs = { "schema":schema})

for r in g.query(q1):
  print("Papers with resources with DOIs: ", r.c)

# How many papers use GitHub to store their data?
q1 = prepareQuery('''
SELECT (count(distinct ?p) as ?c)  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  ?resource a schema:Dataset;
    schema:url ?u.
  filter(CONTAINS(LCASE(STR(?u)),"github.com"))
}
''', initNs = {"schema":schema})

for r in g.query(q1):
  print("Papers storing data in GitHub: ", r.c)
