import os

db_username = os.getenv("DB_USER", "admin")
db_password = os.getenv("DB_PASSWORD", "mentorme")
db_name = os.getenv("DB_NAME", "mentorme")
db_host = os.environ.get("DB_HOST")