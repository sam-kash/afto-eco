from dagster import job
from ecommerce_pipeline.ops import (
    read_json_op,
    transform_op,
    postgres_loader_op,
    elasticsearch_loader_op,
)
from ecommerce_pipeline.resources import (
    postgres_resource,
    elasticsearch_resource,
)

@job(
    resource_defs={
        "postgres_resource": postgres_resource,
        "elasticsearch_resource": elasticsearch_resource,
    }
)
def ingest_pipeline():
    """
    Main data ingestion pipeline.
    
    Flow:
    1. Read JSON from scraper
    2. Transform data (normalize structure)
    3. Load into PostgreSQL
    4. Index into Elasticsearch
    """
    
    raw_data = read_json_op()
    transformed = transform_op(raw_data)
    postgres_loader_op(transformed)
    elasticsearch_loader_op(transformed)