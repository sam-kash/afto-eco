from setuptools import find_packages, setup

setup(
    name="ecommerce_pipeline",
    version="0.0.1",
    packages=find_packages(exclude=["tests"]),
    install_requires=[
        "dagster==1.5.11",
        "dagster-webserver==1.5.11",
        "psycopg2-binary==2.9.9",
        "elasticsearch==8.10.0",
        "python-dotenv==1.0.0",
        "pydantic==2.5.0",
    ],
    author="Your Name",
    author_email="your.email@example.com",
    description="E-Commerce data ingestion pipeline",
    url="https://github.com/yourusername/ecommerce-platform",
)