import pandas as pd
from sklearn.ensemble import IsolationForest
from influxdb_client import InfluxDBClient

def start_engine():
    print('🧠 Igris AI Engine inicializada com sucesso!')
    print("Aguardando conexão com o fluxo de telemetria...")

if __name__ == '__main__':
    start_engine()