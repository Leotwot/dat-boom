import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import { Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'

const MOVEMENT_SPEED = 0.05

interface BotProps {
  id: string
  x: number
  y: number
  targetX?: number
  targetY?: number
}

export const Bot = ({ id, x, y, targetX, targetY }: BotProps) => {
  const { grid, updateBot, addBomb } = useGameStore()
  const meshRef = useRef<any>(null)
  const [currentPos, setCurrentPos] = useState(new Vector3(x - 7.5, 0.5, y - 7.5))
  const [movingTo, setMovingTo] = useState<Vector3 | null>(null)

  // AI Logic
  useEffect(() => {
    if (movingTo) return

    const interval = setInterval(() => {
      // Simple AI: Random movement
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
      const validMoves = directions.filter(([dx, dy]) => {
        const nx = x + dx
        const ny = y + dy
        return grid[nx] && grid[nx][ny] === 0 // Empty cell
      })

      if (validMoves.length > 0) {
        const [dx, dy] = validMoves[Math.floor(Math.random() * validMoves.length)]
        const nx = x + dx
        const ny = y + dy
        
        updateBot(id, { x: nx, y: ny, targetX: nx, targetY: ny })
        setMovingTo(new Vector3(nx - 7.5, 0.5, ny - 7.5))

        // Randomly place bomb
        if (Math.random() > 0.9) {
             addBomb({ 
                id: `${id}-${Date.now()}`, 
                x: x, 
                y: y, 
                timer: 3000 
              })
        }
      }
    }, 1000 + Math.random() * 1000) // Random delay

    return () => clearInterval(interval)
  }, [x, y, grid, movingTo, id, updateBot, addBomb])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    if (movingTo) {
      const dist = meshRef.current.position.distanceTo(movingTo)
      
      if (dist < 0.05) {
        meshRef.current.position.copy(movingTo)
        setMovingTo(null)
      } else {
        meshRef.current.position.lerp(movingTo, MOVEMENT_SPEED)
      }
    } else {
        // Sync position if not moving (initial or snapped)
        meshRef.current.position.set(x - 7.5, 0.5, y - 7.5)
    }
  })

  return (
    <mesh ref={meshRef} position={[x - 7.5, 0.5, y - 7.5]} castShadow>
      {/* Body - Red Slime/Monster */}
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial color="#ff4444" roughness={0.3} />
      
      {/* Angry Eyes */}
      <group position={[0, 0.1, 0.3]}>
        <mesh position={[0.15, 0, 0]} rotation={[0, 0, -0.2]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.15, 0, 0]} rotation={[0, 0, 0.2]}>
            <capsuleGeometry args={[0.05, 0.15, 4, 8]} />
            <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Horns */}
      <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.08, 0.25, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.2, 0.3, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.08, 0.25, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </mesh>
  )
}
