import { useEffect, useState } from 'react'

interface Server {
  id: string
  name: string
  ipAddress: string
  status: string
}

export function ServerList() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServers = () => {
      fetch('http://localhost:3333/servers')
        .then((res) => res.json())
        .then((data) => {
          setServers(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Erro ao buscar servidores:', err)
          setLoading(false)
        })
    }
    fetchServers()
    const intervalId = setInterval(fetchServers, 10000)

    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return (
      <div className="p=8 text-center text-gray-700 font-medium animate-pulse">
        Buscando servidores...
      </div>
    )
  }

  if (servers.length === 0) {
    return (
      <div className="p=8 text-center text-gray-800 font-medium">
        Nenhum servidor cadastrado na plataforma.
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50/60">
        <h2 className="text-xl font-bold text-gray-800">
          Servidores Monitorados
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100/50">
            <tr>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">IP</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {servers.map((server) => (
              <tr
                key={server.id}
                className="hover:bg-gray-100/90 transition-colors"
              >
                <td className="px-6 py-4 font-bold text-gray-800">
                  {server.name}
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {server.ipAddress}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                    {server.status || 'Ativo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
