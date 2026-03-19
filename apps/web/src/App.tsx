import logoIgris from '../../../assets/logo-igris-platform.png'
import { AnomaliesList } from './components/AnomaliesList'

export function App() {
  return (
    <div className="min-h-screen bg-igris-gradient p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col justify-center mb-8">
          <div className="flex flex-col items-center justify-cente">
            <img className="w-12" src={logoIgris} alt="Logo Igris Platform" />
            <h1 className="text-2xl font-extrabold text-zinc-400 tracking-tight">
              IGRIS
            </h1>
          </div>
          <p className="flex justify-center items-center text-white/80 mt-1">
            Painel de Monitoramento
          </p>
        </header>

        <main>
          <AnomaliesList />
        </main>
      </div>
    </div>
  )
}
