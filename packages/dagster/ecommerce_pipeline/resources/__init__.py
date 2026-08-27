"""Resources for the pipeline."""
from .postgres_resource import postgres_resource
from .elasticsearch_resource import elasticsearch_resource

__all__ = ["postgres_resource", "elasticsearch_resource"]