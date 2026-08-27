from dagster import op
from typing import Dict, Any, List
import psycopg2

@op(required_resource_keys={"postgres_resource"})
def postgres_loader_op(context, transformed_data: Dict[str, Any]):
    """Load transformed data into PostgreSQL."""
    
    context.log.info("Starting PostgreSQL data load")
    
    conn = context.resources.postgres_resource
    cursor = conn.cursor()
    
    try:
        # Load categories
        context.log.info(f"Loading {len(transformed_data['categories'])} categories")
        for category in transformed_data['categories']:
            cursor.execute(
                """
                INSERT INTO categories (name)
                VALUES (%s)
                ON CONFLICT DO NOTHING
                """,
                (category['name'],)
            )
        conn.commit()
        context.log.info("Categories loaded successfully")
        
        # Load subcategories
        context.log.info(f"Loading {len(transformed_data['subcategories'])} subcategories")
        for subcategory in transformed_data['subcategories']:
            cursor.execute(
                """
                INSERT INTO subcategories (name, category_id)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
                """,
                (subcategory['name'], subcategory['category_id'])
            )
        conn.commit()
        context.log.info("Subcategories loaded successfully")
        
        # Load products
        context.log.info(f"Loading {len(transformed_data['products'])} products")
        for product in transformed_data['products']:
            cursor.execute(
                """
                INSERT INTO products (
                    sku, name, description, price, currency, 
                    availability, images, category_id, subcategory_id
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (sku) DO UPDATE SET
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    price = EXCLUDED.price,
                    currency = EXCLUDED.currency,
                    availability = EXCLUDED.availability,
                    images = EXCLUDED.images,
                    updated_at = NOW()
                """,
                (
                    product['sku'],
                    product['name'],
                    product['description'],
                    product['price'],
                    product['currency'],
                    product['availability'],
                    product['images'],
                    product['category_id'],
                    product['subcategory_id'],
                )
            )
        conn.commit()
        context.log.info("Products loaded successfully")
        
        # Log summary
        cursor.execute("SELECT COUNT(*) FROM products")
        total_products = cursor.fetchone()[0]
        context.log.info(f"Total products in database: {total_products}")
        
    except Exception as e:
        conn.rollback()
        context.log.error(f"PostgreSQL load failed: {str(e)}")
        raise
    finally:
        cursor.close()
