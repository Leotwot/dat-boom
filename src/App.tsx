import { GameScene } from './components/GameScene'
import { UI } from './components/UI'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GameScene />
      <UI />
    </div>
  )
}

export default App
