# Statistics about the Semantics 2023 KG

The script `generate_stats.py` generates statistics on the Semantics 2023 KG. It will also serialize the KG in TTL.

## Requirements
rdflib

## Running scripe
From the current folder: `python generate_stats.py`

## Statistics results:
- Number of accepted papers:  50
- Number of papers with resources: 26
- Papers with datasets, with code or ontologies:
    - https://schema.org/Dataset 11
    - owl:Ontology 5
    - https://schema.org/SoftwareSourceCode 22
    - https://schema.org/Demo 7
- Resources with license:  27 (some papers have more than 1 resource)
- Papers with resources with license:  22
- Papers with no license in some resource:  13
- Papers with resources with DOIs:  5
- Total number of resources with DOIs:  8
- Papers storing data in GitHub:  7
