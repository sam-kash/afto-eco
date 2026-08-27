import json
import os
from dagster import op, DagsterInvariantViolationError
from dotenv import load_dotenv

load_dotenv()

@op
def read_json_op(context):
    """Read products JSON from scraper output."""
    
    json_path = os.getenv('SCRAPER_OUTPUT_PATH', '../scraper/output/products.json')
    
    # Resolve relative path
    if not os.path.isabs(json_path):
        # Get the package root directory
        package_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_path = os.path.join(package_dir, '..', json_path)
    
    json_path = os.path.normpath(json_path)
    
    context.log.info(f"Reading JSON from: {json_path}")
    
    if not os.path.exists(json_path):
        raise DagsterInvariantViolationError(
            f"JSON file not found at {json_path}. Run the scraper first."
        )
    
    try:
        with open(json_path, 'r') as f:
            data = json.load(f)
        
        context.log.info(f"Successfully read JSON. Found {len(data)} category groups")
        return data
    except json.JSONDecodeError as e:
        raise DagsterInvariantViolationError(f"Invalid JSON: {str(e)}")
    except Exception as e:
        raise DagsterInvariantViolationError(f"Error reading JSON: {str(e)}")