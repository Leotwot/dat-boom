import { useGameStore } from '../store/gameStore'

export const UI = () => {
  const { score, lives, status } = useGameStore()

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        padding: '20px',
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        color: 'white',
        textShadow: '2px 2px 0 #ff69b4',
        fontSize: '24px',
        fontWeight: 'bold',
        zIndex: 10
      }}>
        <div style={{
          background: 'rgba(255, 105, 180, 0.8)',
          padding: '10px 20px',
          borderRadius: '20px',
          border: '3px solid white'
        }}>
          Score: {score}
        </div>
        
        <div style={{
          background: 'rgba(255, 105, 180, 0.8)',
          padding: '10px 20px',
          borderRadius: '20px',
          border: '3px solid white'
        }}>
          Lives: {'❤️'.repeat(Math.max(0, lives))}
        </div>
      </div>

      {status !== 'playing' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: '"Comic Sans MS", sans-serif',
          zIndex: 20
        }}>
          <h1 style={{ fontSize: '72px', color: status === 'won' ? '#00ff00' : '#ff0000', textShadow: '4px 4px 0 #000' }}>
            {status === 'won' ? 'VICTORY! 🏆' : 'GAME OVER 💀'}
          </h1>
          <p style={{ fontSize: '32px' }}>Press F5 to Restart</p>
        </div>
      )}
    </>
  )
}
