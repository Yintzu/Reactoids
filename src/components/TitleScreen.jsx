import React from 'react'

const TitleScreen = ({ startGame }) => {
  return (
    <div className="titleScreen" onClick={() => startGame()}>
      <div>
        <h1>Reactoids</h1>
        <p>- Click to start -</p>
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
      </div>
    </div>
  )
}

export default TitleScreen
