import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import { Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'

const MOVEMENT_SPEED = 0.15

export const Player = () => {
  const { grid, playerPos, setPlayerPos, addBomb } = useGameStore()
  const meshRef = useRef<any>(null)
  const [targetPos, setTargetPos] = useState(new Vector3(playerPos.x - 7.5, 0.5, playerPos.y - 7.5))
  const isMoving = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMoving.current) return

      let newX = playerPos.x
      let newY = playerPos.y

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          newY -= 1
          break
        case 'ArrowDown':
        case 's':
          newY += 1
          break
        case 'ArrowLeft':
        case 'a':
          newX -= 1
          break
        case 'ArrowRight':
        case 'd':
          newX += 1
          break
        case ' ':
          // Place Bomb
          // Check if bomb already exists at this location
          // (Simple check, can be improved)
          addBomb({ 
            id: `${Date.now()}`, 
            x: Math.round(playerPos.x), 
            y: Math.round(playerPos.y), 
            timer: 3000 
          })
          return
        default:
          return
      }

      // Collision Check
      if (grid[newX] && grid[newX][newY] === 0) {
        setPlayerPos({ x: newX, y: newY })
        setTargetPos(new Vector3(newX - 7.5, 0.5, newY - 7.5))
        isMoving.current = true
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [playerPos, grid, setPlayerPos])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    if (isMoving.current) {
      const currentPos = meshRef.current.position
      const dist = currentPos.distanceTo(targetPos)
      
      if (dist < 0.05) {
        meshRef.current.position.copy(targetPos)
        isMoving.current = false
      } else {
        meshRef.current.position.lerp(targetPos, MOVEMENT_SPEED)
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[playerPos.x - 7.5, 0.5, playerPos.y - 7.5]} castShadow>
      {/* Body */}
      <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
      <meshStandardMaterial color="#00ffff" />
      
      {/* Head/Face */}
      <group position={[0, 0.2, 0]}>
         {/* Eyes */}
        <mesh position={[0.12, 0.1, 0.25]}>
          <sphereGeometry args={[0.06]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[-0.12, 0.1, 0.25]}>
          <sphereGeometry args={[0.06]} />
          <meshStandardMaterial color="black" />
        </mesh>
        {/* Blush */}
        <mesh position={[0.18, 0.05, 0.22]}>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color="#ff69b4" />
        </mesh>
        <mesh position={[-0.18, 0.05, 0.22]}>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial color="#ff69b4" />
        </mesh>

        {/* Cat Ears */}
        <mesh position={[0.15, 0.35, 0]} rotation={[0, 0, -0.2]}>
            <coneGeometry args={[0.1, 0.2, 32]} />
            <meshStandardMaterial color="#00ffff" />
        </mesh>
        <mesh position={[-0.15, 0.35, 0]} rotation={[0, 0, 0.2]}>
            <coneGeometry args={[0.1, 0.2, 32]} />
            <meshStandardMaterial color="#00ffff" />
        </mesh>
      </group>
    </mesh>
  )
}
