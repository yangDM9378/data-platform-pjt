
from influxdb import InfluxDBClient

def influxdb_v1_client(url: str, dbname: str, username: str, password: str) -> InfluxDBClient:
    if url.startswith("http://"):
        url = url[len("http://"):]
    host, port = url.split(":")

    client = InfluxDBClient(
        host=host.strip(),
        port=int(port.strip()),
        username=username,
        password=password,
        database=dbname
    )
    return client

