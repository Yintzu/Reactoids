import React, { useEffect, useState } from 'react'
import HighscoreList from './HighscoreList'

const TitleScreen = ({ startGame, highscore }) => {
  const [state, setState] = useState(0)

  const toggleState = () => {
    if (state === 0) setState(1)
    if (state === 1) setState(0)
  }

  useEffect(() => {
    let timeout = setTimeout(() => {
      toggleState()
    }, 7000)

    return () => {
      clearTimeout(timeout)
    }

  }, [state]) //eslint-disable-line

  return (
    <>
      {state === 0 &&
        <div className="titleScreen" onClick={() => startGame()}>
          <div>
            <h1>Reactoids</h1>
            <div className='tutorial'>
              <div className='tutorialKeys'>
                <div></div>
                <div className='tutorialKey'>W</div>
                <div></div>
                <div className='tutorialKey'>A</div>
                <div className='tutorialKey'>S</div>
                <div className='tutorialKey'>D</div>
              </div>
              <div className='tutorialShoot'>
                <p>Shoot:</p>
                <span className='tutorialSpaceKey'>Space</span>
              </div>
            </div>
            <p className='textMedium mt-4'>- Click to start -</p>
          </div>
        </div>
      }
      {state === 1 &&
        <HighscoreList highscore={highscore} startGame={startGame} />
      }
    </>
  )
}

export default TitleScreen
