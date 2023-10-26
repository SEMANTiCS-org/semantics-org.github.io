from rdflib import Graph, Namespace, Literal

# Create a graph
g = Graph()

# Load the .nt file
g.parse("out.nt", format="nt")

# Define the namespaces
schema = Namespace("https://schema.org/")
okn = Namespace("https://w3id.org/okn/semantics/i/")

# Define the target property and object
target_property = schema.isPartOf
target_object = okn.Track_4

# Query for subjects with the target property and object
query = """
    SELECT ?s
    WHERE {
        ?s ?p ?o .
        FILTER (?p = ?target_property && ?o = ?target_object)
    }
"""

# Bind the target_property and target_object to the query
g.bind("schema", schema)
g.bind("okn", okn)
results = g.query(query, initBindings={"target_property": target_property, "target_object": target_object})

# Create a new graph to store the results
result_graph = Graph()

# Helper function to recursively retrieve properties for URLs
def retrieve_properties_recursive(subject):
    for s, p, o in g.triples((subject, None, None)):
        result_graph.add((s, p, o))
        if isinstance(o, Literal):
            continue
        retrieve_properties_recursive(o)

# Iterate through the subjects that match the criteria
for row in results:
    subject = row[0]
    retrieve_properties_recursive(subject)

# Serialize the result to a .ttl file
result_graph.serialize("out_track_4.ttl", format="turtle")
