import logoIgris from '../../../assets/logo-igris-platform.png'
import { AnomaliesList } from './components/AnomaliesList'

export function App() {
  return (
    <div className="min-h-screen bg-igris-gradient p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col justify-center items-center mb-8">
          <img className="w-12" src={logoIgris} alt="Logo Igris Platform" />
          <h1 className="text-3xl font-extrabold text-red-900 tracking-tight">
            IGRIS
          </h1>
          <p className="text-zinc-300 mt-1">Painel de Monitoramento</p>
        </header>

        <main>
          <AnomaliesList />
        </main>
      </div>
    </div>
  )
}
