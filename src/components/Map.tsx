import { useGameStore } from '../store/gameStore'

export const Map = () => {
  const grid = useGameStore((state) => state.grid)

  if (!grid || grid.length === 0) return null

  return (
    <group>
      {grid.map((row, x) =>
        row.map((cell, y) => {
          if (cell === 0) return null
          
          const position: [number, number, number] = [x - 7.5, 0.5, y - 7.5]
          
          if (cell === 1) { // Wall
            return (
              <mesh key={`${x}-${y}`} position={position} castShadow receiveShadow>
                <boxGeometry />
                <meshStandardMaterial color="#888" />
              </mesh>
            )
          }
          
          if (cell === 2) { // Crate
            return (
              <mesh key={`${x}-${y}`} position={position} castShadow receiveShadow>
                <boxGeometry />
                <meshStandardMaterial color="#d2b48c" />
              </mesh>
            )
          }
          
          return null
        })
      )}
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}
