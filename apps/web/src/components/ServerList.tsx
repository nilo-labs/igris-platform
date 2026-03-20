import { useEffect, useState } from 'react'
import { AddServerModal } from './AddServerModal'

interface Server {
  id: string
  name: string
  ipAddress: string
  status: string
}

export function ServerList() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchServers = () => {
      fetch(`http://localhost:3333/servers?_t=${refreshTrigger}`)
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
  }, [refreshTrigger])

  const handleServerAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-700 font-medium animate-pulse">
        Buscando servidores...
      </div>
    )
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50/60 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Servidores Monitorados
          </h2>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 cursor-pointer hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            + Adicionar
          </button>
        </div>

        <div className="overflow-x-auto">
          {servers.length === 0 ? (
            <div className="p-8 text-center text-gray-800 font-medium">
              Nenhum servidor cadastrado na plataforma.
            </div>
          ) : (
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
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          server.status === 'Ativo'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {server.status || 'Ativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleServerAdded}
      />
    </>
  )
}
