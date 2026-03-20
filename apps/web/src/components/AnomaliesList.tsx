import { useEffect, useState } from 'react'

interface Anomaly {
  id: string
  serverId: string
  cpuUsage: number
  type: string
  timestamp: string
}

export function AnomaliesList() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3333/anomalies')
      .then((res) => res.json())
      .then((data) => {
        setAnomalies(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Erro ao buscar dados:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-300 font-medium animate-pulse">
        Buscando alertas do sistema...
      </div>
    )
  }

  if (anomalies.length === 0) {
    return (
      <div className="p-8 text-center text-gray-300">
        Nenhuma anomalia registrada ainda. O sistema está operando
        perfeitamente.
      </div>
    )
  }

  return (
    <div className="bg-white/30 rounded-2xl shadow-sm border border-gray-400 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-white/20">
        <h2 className="text-xl font-bold text-gray-800">
          Anomalias de CPU Detectadas
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-900 uppercase bg-white/10">
            <tr>
              <th className="px-6 py-4">Servidor (UUID)</th>
              <th className="px-6 py-4">Uso de CPU</th>
              <th className="px-6 py-4">Tipo de Alerta</th>
              <th className="px-6 py-4">Data/Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/50">
            {anomalies.map((anomaly) => (
              <tr
                key={anomaly.id}
                className="hover:bg-zinc-300/60 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-xs text-black">
                  {anomaly.serverId}
                </td>
                <td className="px-6 py-4 text-red-600 font-bold">
                  {anomaly.cpuUsage.toFixed(2)}%
                </td>
                <td className="px-6 py-4">
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                    {anomaly.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {new Date(anomaly.timestamp).toLocaleString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
