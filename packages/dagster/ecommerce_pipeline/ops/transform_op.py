from dagster import op
from typing import List, Dict, Any

@op
def transform_op(context, raw_data: List[Dict[str, Any]]):
    """Transform and validate product data."""
    
    context.log.info("Transforming raw product data")
    
    transformed_data = {
        'categories': [],
        'subcategories': [],
        'products': [],
    }
    
    category_map = {}  # Map category name to ID
    subcategory_map = {}  # Map (category, subcategory) to ID
    
    product_id = 1
    category_id = 1
    subcategory_id = 1
    
    try:
        for group in raw_data:
            category_name = group.get('category', 'Uncategorized')
            subcategory_name = group.get('subcategory', 'General')
            products = group.get('products', [])
            
            # Handle category
            if category_name not in category_map:
                category_map[category_name] = category_id
                transformed_data['categories'].append({
                    'id': category_id,
                    'name': category_name,
                })
                category_id += 1
            
            cat_id = category_map[category_name]
            
            # Handle subcategory
            subcat_key = (category_name, subcategory_name)
            if subcat_key not in subcategory_map:
                subcategory_map[subcat_key] = subcategory_id
                transformed_data['subcategories'].append({
                    'id': subcategory_id,
                    'name': subcategory_name,
                    'category_id': cat_id,
                })
                subcategory_id += 1
            
            subcat_id = subcategory_map[subcat_key]
            
            # Handle products
            for product in products:
                transformed_data['products'].append({
                    'id': product_id,
                    'sku': product.get('id', f'SKU-{product_id}'),
                    'name': product.get('name', f'Product {product_id}'),
                    'description': product.get('description', ''),
                    'price': float(product.get('price', 0)),
                    'currency': product.get('currency', 'CAD'),
                    'availability': product.get('availability', 'in_stock'),
                    'images': product.get('images', []),
                    'category_id': cat_id,
                    'subcategory_id': subcat_id,
                })
                product_id += 1
        
        context.log.info(
            f"Transformation complete. "
            f"Categories: {len(transformed_data['categories'])}, "
            f"Subcategories: {len(transformed_data['subcategories'])}, "
            f"Products: {len(transformed_data['products'])}"
        )
        
        return transformed_data
    
    except Exception as e:
        context.log.error(f"Transformation failed: {str(e)}")
        raise