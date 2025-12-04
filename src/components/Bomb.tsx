import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'
import { Vector3 } from 'three'

interface BombProps {
  id: string
  x: number
  y: number
}

export const Bomb = ({ id, x, y }: BombProps) => {
  const meshRef = useRef<any>(null)
  // Only get stable actions
  const { removeBomb, addExplosion, updateGridCell, decreaseLives, removeBot, addScore } = useGameStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      // Get fresh state directly to avoid dependency cycle resetting the timer
      const state = useGameStore.getState()
      const { grid, playerPos, bots } = state

      // Explosion Logic
      removeBomb(id)
      
      // Helper to check collisions
      const checkCollision = (cx: number, cy: number) => {
        // Check Player
        if (Math.round(playerPos.x) === cx && Math.round(playerPos.y) === cy) {
            decreaseLives()
        }
        // Check Bots
        bots.forEach(bot => {
            if (bot.x === cx && bot.y === cy) {
                removeBot(bot.id)
                addScore(100)
            }
        })
      }

      // Center
      addExplosion({ id: `${id}-c`, x, y })
      checkCollision(x, y)
      
      // Directions: Up, Down, Left, Right
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
      
      directions.forEach(([dx, dy]) => {
        for (let i = 1; i <= 2; i++) { // Range 2
          const nx = x + dx * i
          const ny = y + dy * i
          
          if (grid[nx] && grid[nx][ny] !== undefined) {
            const cell = grid[nx][ny]
            if (cell === 1) break // Wall blocks
            
            addExplosion({ id: `${id}-${nx}-${ny}`, x: nx, y: ny })
            checkCollision(nx, ny)
            
            if (cell === 2) { // Crate
              updateGridCell(nx, ny, 0) // Destroy crate
              break // Stop after destroying crate
            }
             if (cell === 3) { // Another Bomb
               // Optional: Chain reaction could go here
               break 
            }
          }
        }
      })
      
    }, 3000)

    return () => clearTimeout(timer)
    // Dependencies should be minimal and stable
  }, [id, x, y, removeBomb, addExplosion, updateGridCell, decreaseLives, removeBot, addScore])

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <mesh ref={meshRef} position={[x - 7.5, 0.5, y - 7.5]} castShadow>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial color="black" roughness={0.2} metalness={0.8} />
      {/* Fuse */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </mesh>
  )
}
