import React from 'react'

const TitleScreen = ({ startGame }) => {
  return (
    <div className="titleScreen" onClick={() => startGame()}>
      <div>
        <h1>Reactoids</h1>
        <p>- Click to start -</p>
      </div>
    </div>
  )
}

export default TitleScreen
