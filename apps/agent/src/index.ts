import si from 'systeminformation'

const API_URL = 'http://localhost:3333/logs'

const SERVER_ID = '6f28a188-0cbd-45bf-bb59-f0413f0bd3c4'

async function collectAndSendMetrics() {
  try {
    const cpu = await si.currentLoad()
    const mem = await si.mem()

    const cpuUsage = Math.round(cpu.currentLoad)
    const memoryUsage = Math.round((mem.active / mem.total) * 100)

    const payload = {
      serverId: SERVER_ID,
      cpuUsage,
      memoryUsage,
      timestamp: new Date().toISOString(),
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      console.log(
        `[${payload.timestamp}] 🚀 Métricas enviadas! CPU: ${cpuUsage}% | RAM: ${memoryUsage}%`,
      )
    } else {
      console.error(
        `❌ A API recusou o dado (Status: ${response.status}). O serverId está correto?`,
      )
    }
  } catch (error) {
    console.error(
      '⚠️ Falha ao conectar. A API principal (Fastify) está rodando?',
      error,
    )
  }
}

console.log('Agente Igris iniciado. Monitorando hardware...')
collectAndSendMetrics()
setInterval(collectAndSendMetrics, 5000)
