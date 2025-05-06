import psycopg
import os
from dotenv import load_dotenv

class DB(object):
  def __init__(self):
    load_dotenv()
    self.dbname = os.environ["DB_NAME"]
    self.user = os.environ["DB_USER"]
    self.host = os.environ["DB_HOST"]
    self.port = os.environ["DB_PORT"]
    self.password = os.environ["DB_PASS"]

  def get_connection_string(self):
    return f"dbname={self.dbname} user={self.user} host={self.host} port={self.port} password={self.password}"

  def fetch(self, query, values = []):
    with psycopg.connect(self.get_connection_string()) as conn:
      with conn.cursor() as cur:
        cur.execute(query, values)
        data = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
        data = [dict([column_name, t[index]] for index, column_name in enumerate(colnames)) for t in data]

    return data
  
  def fetchAllEntries(self):
    return self.fetch("SELECT * FROM entries ORDER BY created_at DESC")
  
  def upsert(self, query, values):
    print(query)
    print(values)
    with psycopg.connect(self.get_connection_string()) as conn:
      with conn.cursor() as cur:
        cur.executemany(query, values)
        conn.commit()
        cur.close()