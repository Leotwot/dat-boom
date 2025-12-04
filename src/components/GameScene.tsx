import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Sky } from '@react-three/drei'
import { Suspense } from 'react'
import { Map } from './Map'
import { Player } from './Player'
import { Bomb } from './Bomb'
import { Explosion } from './Explosion'
import { Bot } from './Bot'
import { useGameStore } from '../store/gameStore'
import { useEffect } from 'react'

const Bombs = () => {
  const bombs = useGameStore((state) => state.bombs)
  return (
    <>
      {bombs.map((bomb) => (
        <Bomb key={bomb.id} {...bomb} />
      ))}
    </>
  )
}

const Explosions = () => {
  const explosions = useGameStore((state) => state.explosions)
  return (
    <>
      {explosions.map((explosion) => (
        <Explosion key={explosion.id} {...explosion} />
      ))}
    </>
  )
}

const Bots = () => {
  const bots = useGameStore((state) => state.bots)
  return (
    <>
      {bots.map((bot) => (
        <Bot key={bot.id} {...bot} />
      ))}
    </>
  )
}

export const GameScene = () => {
  const initGame = useGameStore((state) => state.initGame)

  useEffect(() => {
    initGame()
  }, [initGame])

  return (
    <Canvas shadows camera={{ position: [0, 15, 10], fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        <Sky sunPosition={[10, 20, 10]} />
        <Stars />
        
        <Map />
        <Player />
        
        {/* Bombs */}
        <Bombs />
        {/* Explosions */}
        <Explosions />
        
        {/* Bots */}
        <Bots />

        <OrbitControls />
      </Suspense>
    </Canvas>
  )
}
