import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'

interface ExplosionProps {
  id: string
  x: number
  y: number
}

export const Explosion = ({ id, x, y }: ExplosionProps) => {
  const { removeExplosion } = useGameStore()
  const [scale, setScale] = useState(0.1)

  useEffect(() => {
    // Expand
    const expandInterval = setInterval(() => {
      setScale((s) => {
        if (s >= 1) {
          clearInterval(expandInterval)
          return 1
        }
        return s + 0.2
      })
    }, 50)

    // Remove after 500ms
    const timer = setTimeout(() => {
      removeExplosion(id)
    }, 500)

    return () => {
      clearInterval(expandInterval)
      clearTimeout(timer)
    }
  }, [id, removeExplosion])

  return (
    <mesh position={[x - 7.5, 0.5, y - 7.5]} scale={[scale, scale, scale]}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial color="orange" emissive="red" emissiveIntensity={2} transparent opacity={0.8} />
    </mesh>
  )
}
