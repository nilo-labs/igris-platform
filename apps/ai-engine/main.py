import pandas as pd
import requests
from sklearn.ensemble import IsolationForest
from influxdb_client import InfluxDBClient

INFLUX_URL = 'http://localhost:8086'
INFLUX_TOKEN = 'supersecrettoken123'
INFLUX_ORG = 'igris'
INFLUX_BUCKET= 'logs'

API_URL = 'http://localhost:3333/anomalies'
SERVER_ID = '6f28a188-0cbd-45bf-bb59-f0413f0bd3c4'

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

    return pd.DataFrame(records)

def detect_anomalies(df):
    print('Aplicando filtro heuristico (Threshold >= 60%)...')

    df_high_cpu = df[df['cpuUsage'] >= 60.0].copy()

    if df_high_cpu.empty or len(df_high_cpu) < 5:
        print('\nServidor operando em zona de conforto. AI em repouso.')
        return pd.DataFrame()

    df_critical = df_high_cpu[df_high_cpu['cpuUsage'] >= 95.0].copy()
    if not df_critical.empty:
        print(f'⚠️  OVERRIDE CRÍTICO: {len(df_critical)} leituras de exaustão extrema (>= 95%) detectadas!')
        df_critical['anomaly'] = -1
        df_critical['type'] = 'CRITICAL_OVERRIDE'
        return df_critical

    print("Analisando área cinzenta com Isolation Forest...")
    X = df_high_cpu[['cpuUsage']]

    model = IsolationForest(contamination=0.1, random_state=51)
    df_high_cpu['anomaly'] = model.fit_predict(X)

    real_anomalies = df_high_cpu[df_high_cpu['anomaly'] == -1].copy()

    if not real_anomalies.empty:
        real_anomalies['type'] = 'ISOLATION_FOREST'

    return real_anomalies

def send_alert_to_api(row):
    formatted_time = pd.to_datetime(row['timestamp']).tz_convert('UTC').strftime('%Y-%m-%dT%H:%M:%S.%fZ')

    payload = {
        'serverId': SERVER_ID,
        'cpuUsage': float(row['cpuUsage']),
        'type': row['type'],
        'timestamp': formatted_time
    }

    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 201:
            print(f"[SUCESSO] Alerta enviado: CPU {payload['cpuUsage']}% | Tipo: {payload['type']}")
        else:
            print(f'[ERRO API] Código {response.status_code}: {response.text}')
    except Exception as e:
        print(f'[FALHA DE REDE] Não foi possível conectar à API: {e}')

def start_engine():
    print('🧠 Igris AI Engine inicializada com sucesso!')
    
    df = fetch_cpu_data()

    if df.empty:
        print('\nA tabela voltou vazia. O seu Agente Node.js está rodando e gerando logs?')
        return
    
    print(f'\nTotal de registros coletados: {len(df)}')
    anomalies = detect_anomalies(df)

    if anomalies.empty:
        print('Nenhuma anomalia detectada nos últimos 15 minutos. Sistema estável.')
    else: 
        print(f'\nALERTA: {len(anomalies)} anomalias encontradas. Iniciando transmissão para a API...')

        for index, row in anomalies.iterrows():
            send_alert_to_api(row)

if __name__ == '__main__':
    start_engine()