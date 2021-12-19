import React, { useState } from 'react'

const EndScreen = ({ startGame, highscore }) => {
  const [state, setState] = useState(0)

  const fillDots = (item) => {
    return '.'.repeat(35 - (item.name.length + String(item.score).length))
  }

  return (
    <>
      {state === 0 &&
        <div className="gameOver" onClick={() => setState(1)}>
          <p className='gameOverText'>Game Over</p>
          <p>- Click to Restart -</p>
        </div>
      }
      {state === 1 &&
        <div className='highscore' onClick={startGame}>
          <p className='highscoreText'>Highscore</p>
          {highscore &&
            <div className='highscoreList'>
              {highscore.map((item, i) => (<p className='highscoreItem' style={{ '--delay': i }} key={item.id}>{item.name}{fillDots(item)}{item.score}</p>))}
            </div>
          }
        </div>
      }
      {state === 2 &&
        <div className='nameInputWrapper'>

        </div>
      }
    </>
  )
}

export default EndScreen
