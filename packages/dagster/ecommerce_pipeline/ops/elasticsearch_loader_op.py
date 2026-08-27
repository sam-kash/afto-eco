
from dagster import op
from typing import Dict, Any
import json

@op(required_resource_keys={"elasticsearch_resource"})
def elasticsearch_loader_op(context, transformed_data: Dict[str, Any]):
    """Index products into Elasticsearch."""
    
    context.log.info("Starting Elasticsearch indexing")
    
    es = context.resources.elasticsearch_resource
    index_name = "products"
    
    try:
        # Create index if it doesn't exist
        if not es.indices.exists(index=index_name):
            context.log.info(f"Creating Elasticsearch index: {index_name}")
            
            mapping = {
                "settings": {
                    "number_of_shards": 1,
                    "number_of_replicas": 0,
                    "analysis": {
                        "analyzer": {
                            "default": {
                                "type": "standard",
                                "stopwords": "_english_"
                            }
                        }
                    }
                },
                "mappings": {
                    "properties": {
                        "sku": {"type": "keyword"},
                        "name": {
                            "type": "text",
                            "analyzer": "standard",
                            "fields": {
                                "keyword": {"type": "keyword"}
                            }
                        },
                        "description": {
                            "type": "text",
                            "analyzer": "standard"
                        },
                        "price": {"type": "float"},
                        "currency": {"type": "keyword"},
                        "availability": {"type": "keyword"},
                        "images": {"type": "keyword"},
                        "category_id": {"type": "integer"},
                        "category_name": {"type": "keyword"},
                        "subcategory_id": {"type": "integer"},
                        "subcategory_name": {"type": "keyword"},
                        "created_at": {"type": "date"},
                    }
                }
            }
            
            es.indices.create(index=index_name, body=mapping)
            context.log.info(f"Index {index_name} created successfully")
        
        # Clear existing data (for idempotency)
        context.log.info(f"Clearing existing data from {index_name}")
        es.indices.delete(index=index_name)
        es.indices.create(index=index_name, body={
            "settings": {
                "number_of_shards": 1,
                "number_of_replicas": 0,
            },
            "mappings": {
                "properties": {
                    "sku": {"type": "keyword"},
                    "name": {
                        "type": "text",
                        "analyzer": "standard",
                        "fields": {"keyword": {"type": "keyword"}}
                    },
                    "description": {
                        "type": "text",
                        "analyzer": "standard"
                    },
                    "price": {"type": "float"},
                    "currency": {"type": "keyword"},
                    "availability": {"type": "keyword"},
                    "images": {"type": "keyword"},
                    "category_id": {"type": "integer"},
                    "category_name": {"type": "keyword"},
                    "subcategory_id": {"type": "integer"},
                    "subcategory_name": {"type": "keyword"},
                }
            }
        })
        
        # Create category and subcategory name maps
        category_map = {cat['id']: cat['name'] for cat in transformed_data['categories']}
        subcategory_map = {sub['id']: sub['name'] for sub in transformed_data['subcategories']}
        
        # Index products
        context.log.info(f"Indexing {len(transformed_data['products'])} products")
        
        for product in transformed_data['products']:
            doc = {
                'sku': product['sku'],
                'name': product['name'],
                'description': product['description'],
                'price': product['price'],
                'currency': product['currency'],
                'availability': product['availability'],
                'images': product['images'],
                'category_id': product['category_id'],
                'category_name': category_map.get(product['category_id'], ''),
                'subcategory_id': product['subcategory_id'],
                'subcategory_name': subcategory_map.get(product['subcategory_id'], ''),
            }
            
            es.index(
                index=index_name,
                id=product['sku'],
                document=doc
            )
        
        context.log.info(f"Successfully indexed {len(transformed_data['products'])} products")
        
        # Verify
        count = es.count(index=index_name)
        context.log.info(f"Total documents in Elasticsearch: {count['count']}")
        
    except Exception as e:
        context.log.error(f"Elasticsearch indexing failed: {str(e)}")
        raise
