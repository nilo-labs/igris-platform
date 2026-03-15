import pandas as pd
from influxdb_client import InfluxDBClient

INFLUX_URL = 'http://localhost:8086'
INFLUX_TOKEN = 'supersecrettoken123'
INFLUX_ORG = 'igris'
INFLUX_BUCKET= 'logs'

def fetch_cpu_data():
    print('⏳ Conectando ao InfluxDB e extraindo dados de CPU dos últimos 15 minutos...')

    client = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)
    query_api = client.query_api()

    query = f"""
        from(bucket: "{INFLUX_BUCKET}")
          |> range(start: -15m)
          |> filter(fn: (r) => r["_measurement"] == "system_metrics")
          |> filter(fn: (r) => r["_field"] == "cpuUsage")
    """

    result = query_api.query(org=INFLUX_ORG, query=query)

    records = []
    for table in result:
        for record in table.records:
            records.append({
                "timestamp": record.get_time(),
                "cpuUsage": record.get_value()
            })
        
    client.close()

    df = pd.DataFrame(records)
    return df

def start_engine():
    print('🧠 Igris AI Engine inicializada com sucesso!')
    
    df = fetch_cpu_data()

    if df.empty:
        print('⚠️ A tabela voltou vazia. O seu Agente Node.js está rodando e gerando logs?')
        return

    print("\n✅ DataFrame montado com sucesso! Estrutura dos dados:")
    print(df.head())
    print(f'\nTotal de registros coletados: {len(df)}')

if __name__ == '__main__':
    start_engine()