import { create } from 'zustand'

export type CellType = 0 | 1 | 2 | 3 // 0: Empty, 1: Wall, 2: Crate, 3: Bomb

interface GameState {
  grid: CellType[][]
  playerPos: { x: number; y: number }
  score: number
  lives: number
  bombs: { id: string; x: number; y: number; timer: number }[]
  explosions: { id: string; x: number; y: number }[]
  bots: { id: string; x: number; y: number; targetX?: number; targetY?: number }[]
  status: 'playing' | 'won' | 'lost'
  setGrid: (grid: CellType[][]) => void
  setPlayerPos: (pos: { x: number; y: number }) => void
  addScore: (points: number) => void
  decreaseLives: () => void
  addBomb: (bomb: { id: string; x: number; y: number; timer: number }) => void
  removeBomb: (id: string) => void
  addExplosion: (explosion: { id: string; x: number; y: number }) => void
  removeExplosion: (id: string) => void
  updateGridCell: (x: number, y: number, type: CellType) => void
  initGame: () => void
  updateBot: (id: string, pos: { x: number; y: number; targetX?: number; targetY?: number }) => void
  removeBot: (id: string) => void
}

export const useGameStore = create<GameState>((set) => ({
  grid: [],
  playerPos: { x: 1, y: 1 },
  score: 0,
  lives: 3,
  bombs: [],
  explosions: [],
  bots: [],
  status: 'playing',
  setGrid: (grid) => set({ grid }),
  setPlayerPos: (pos) => set({ playerPos: pos }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  decreaseLives: () => set((state) => {
    const newLives = state.lives - 1
    return { lives: newLives, status: newLives <= 0 ? 'lost' : 'playing' }
  }),
  addBomb: (bomb) => set((state) => {
    const newGrid = [...state.grid]
    newGrid[bomb.x] = [...newGrid[bomb.x]]
    newGrid[bomb.x][bomb.y] = 3 // 3 = Bomb
    return { bombs: [...state.bombs, bomb], grid: newGrid }
  }),
  removeBomb: (id) => set((state) => {
    const bomb = state.bombs.find(b => b.id === id)
    if (bomb) {
        const newGrid = [...state.grid]
        newGrid[bomb.x] = [...newGrid[bomb.x]]
        newGrid[bomb.x][bomb.y] = 0 // Clear bomb cell
        return { bombs: state.bombs.filter((b) => b.id !== id), grid: newGrid }
    }
    return { bombs: state.bombs.filter((b) => b.id !== id) }
  }),
  addExplosion: (explosion) => set((state) => ({ explosions: [...state.explosions, explosion] })),
  removeExplosion: (id) => set((state) => ({ explosions: state.explosions.filter((e) => e.id !== id) })),
  updateGridCell: (x, y, type) => set((state) => {
    const newGrid = [...state.grid]
    newGrid[x] = [...newGrid[x]]
    newGrid[x][y] = type
    return { grid: newGrid }
  }),
  updateBot: (id, pos) => set((state) => ({
    bots: state.bots.map((b) => b.id === id ? { ...b, ...pos } : b)
  })),
  removeBot: (id) => set((state) => {
      const newBots = state.bots.filter((b) => b.id !== id)
      return { bots: newBots, status: newBots.length === 0 ? 'won' : state.status }
  }),
  initGame: () => {
    const size = 15
    const newGrid: CellType[][] = []
    for (let x = 0; x < size; x++) {
      const row: CellType[] = []
      for (let y = 0; y < size; y++) {
        if (x === 0 || x === size - 1 || y === 0 || y === size - 1) {
          row.push(1)
        } else if (x % 2 === 0 && y % 2 === 0) {
          row.push(1)
        } else {
          row.push(Math.random() > 0.7 ? 2 : 0)
        }
      }
      newGrid.push(row)
    }
    // Clear spawn area
    newGrid[1][1] = 0
    newGrid[1][2] = 0
    newGrid[2][1] = 0
    
    // Spawn bots
    const newBots = []
    for(let i=0; i<3; i++) {
        let bx, by
        do {
            bx = Math.floor(Math.random() * size)
            by = Math.floor(Math.random() * size)
        } while(newGrid[bx][by] !== 0 || (bx < 5 && by < 5)) // Avoid walls and player spawn
        newBots.push({ id: `bot-${i}`, x: bx, y: by })
    }

    set({ grid: newGrid, playerPos: { x: 1, y: 1 }, score: 0, lives: 3, bombs: [], explosions: [], bots: newBots, status: 'playing' })
  }
}))
