import time
import pandas as pd
import requests
from sklearn.ensemble import IsolationForest
from influxdb_client import InfluxDBClient

# ================= CONFIGURAÇÕES =============
INFLUX_URL = 'http://localhost:8086'
INFLUX_TOKEN = 'supersecrettoken123'
INFLUX_ORG = 'igris'
INFLUX_BUCKET = 'logs'

API_BASE_URL = 'http://localhost:3333'
API_SERVERS_URL = f'{API_BASE_URL}/servers'
API_ANOMALIES_URL = f'{API_BASE_URL}/anomalies'

POLL_INTERVAL_SECONDS = 60 
# ==============================================

def get_active_servers():
    """Busca a lista de servidores atualizada da API Fastify."""
    try:
        response = requests.get(API_SERVERS_URL)
        if response.status_code == 200:
            return response.json()
        else:
            print(f'Erro ao buscar servidores: Código {response.status_code}')
            return []
    except Exception as e:
        print(f'Falha de rede ao conectar na API Node.js: {e}')
        return []

def fetch_cpu_data(server_id):
    """Extrai os dados de CPU de UM servidor específico dos últimos 15 minutos."""
    print(f'   Extraindo dados do InfluxDB...')

    client = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)
    query_api = client.query_api()

    query = f"""
        from(bucket: "{INFLUX_BUCKET}")
          |> range(start: -15m)
          |> filter(fn: (r) => r["_measurement"] == "system_metrics")
          |> filter(fn: (r) => r["serverId"] == "{server_id}")
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
    """Aplica o filtro heurístico e o Isolation Forest."""
    df_high_cpu = df[df['cpuUsage'] >= 60.0].copy()

    if df_high_cpu.empty or len(df_high_cpu) < 5:
        return pd.DataFrame()

    df_critical = df_high_cpu[df_high_cpu['cpuUsage'] >= 95.0].copy()
    if not df_critical.empty:
        df_critical['anomaly'] = -1
        df_critical['type'] = 'CRITICAL_OVERRIDE'
        return df_critical

    X = df_high_cpu[['cpuUsage']]
    model = IsolationForest(contamination=0.1, random_state=51)
    df_high_cpu['anomaly'] = model.fit_predict(X)

    real_anomalies = df_high_cpu[df_high_cpu['anomaly'] == -1].copy()

    if not real_anomalies.empty:
        real_anomalies['type'] = 'ISOLATION_FOREST'

    return real_anomalies

def send_alert_to_api(row, server_id):
    """Envia a anomalia detectada para o banco relacional via API."""
    formatted_time = pd.to_datetime(row['timestamp']).tz_convert('UTC').strftime('%Y-%m-%dT%H:%M:%S.%fZ')

    payload = {
        'serverId': server_id,
        'cpuUsage': float(row['cpuUsage']),
        'type': row['type'],
        'timestamp': formatted_time
    }

    try:
        response = requests.post(API_ANOMALIES_URL, json=payload)
        if response.status_code == 201:
            print(f"   [🚨 ALERTA] Anomalia enviada! CPU: {payload['cpuUsage']}% | Tipo: {payload['type']}")
        else:
            print(f"   [ERRO API] Código {response.status_code}: {response.text}")
    except Exception as e:
        print(f"   [FALHA] Não foi possível enviar alerta para a API: {e}")

def process_server(server):
    """Função orquestradora para um único servidor."""
    server_id = server['id']
    server_name = server['name']
    
    print(f"\n Analisando servidor: {server_name} ({server['ipAddress']})")
    
    df = fetch_cpu_data(server_id)

    if df.empty:
        print('   Tabela vazia. Nenhum dado gerado nos últimos 15 min.')
        return
    
    anomalies = detect_anomalies(df)

    if anomalies.empty:
        print('   Sistema estável. Nenhuma anomalia detectada.')
    else: 
        print(f'   ATENÇÃO: {len(anomalies)} anomalias encontradas! Transmitindo...')
        for index, row in anomalies.iterrows():
            send_alert_to_api(row, server_id)

def start_engine():
    """Loop principal que mantém a IA rodando infinitamente."""
    print('==================================================')
    print('🧠 Igris AI Engine iniciada em modo CONTÍNUO')
    print('==================================================')
    
    while True:
        print('\n Iniciando ciclo de varredura global...')
        
        servers = get_active_servers()
        active_servers = [s for s in servers if s.get('status') == 'Ativo']
        
        if not active_servers:
            print('Nenhum servidor ativo encontrado no momento.')
        else:
            for server in active_servers:
                process_server(server)
                
        print(f'\n Ciclo finalizado. Aguardando {POLL_INTERVAL_SECONDS} segundos...')
        time.sleep(POLL_INTERVAL_SECONDS)

if __name__ == '__main__':
    start_engine()