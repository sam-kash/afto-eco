from elasticsearch import Elasticsearch
from dagster import resource
import os
from dotenv import load_dotenv

load_dotenv()

@resource
def elasticsearch_resource(context):
    """Elasticsearch connection resource."""
    
    es_host = os.getenv('ELASTICSEARCH_HOST', 'localhost')
    es_port = int(os.getenv('ELASTICSEARCH_PORT', 9200))
    es_scheme = os.getenv('ELASTICSEARCH_SCHEME', 'http')
    
    es_url = f"{es_scheme}://{es_host}:{es_port}"
    
    try:
        es = Elasticsearch([es_url])
        info = es.info()
        context.log.info(f"Connected to Elasticsearch: {info['version']['number']}")
        yield es
    except Exception as e:
        context.log.error(f"Failed to connect to Elasticsearch: {str(e)}")
        raise