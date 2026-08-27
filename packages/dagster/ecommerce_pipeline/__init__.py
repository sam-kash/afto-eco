"""E-Commerce data ingestion pipeline."""
from .jobs.ingest_pipeline import ingest_pipeline

__all__ = ["ingest_pipeline"]