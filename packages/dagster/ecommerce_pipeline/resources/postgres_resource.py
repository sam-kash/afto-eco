import psycopg2
from psycopg2.extras import RealDictCursor
from dagster import resource, DagsterEventType
import os
from dotenv import load_dotenv

load_dotenv()

@resource
def postgres_resource(context):
    """PostgreSQL connection resource."""
    
    conn_params = {
        'host': os.getenv('POSTGRES_HOST', 'localhost'),
        'port': int(os.getenv('POSTGRES_PORT', 5432)),
        'user': os.getenv('POSTGRES_USER', 'ecommerce_user'),
        'password': os.getenv('POSTGRES_PASSWORD', 'ecommerce_password'),
        'database': os.getenv('POSTGRES_DB', 'ecommerce_db'),
    }

    try:
        conn = psycopg2.connect(**conn_params)
        context.log.info(f"Connected to PostgreSQL: {conn_params['database']}")
        yield conn
    except Exception as e:
        context.log.error(f"Failed to connect to PostgreSQL: {str(e)}")
        raise
    finally:
        if conn:
            conn.close()
            context.log.info("PostgreSQL connection closed")