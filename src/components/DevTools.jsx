import React from 'react'
import useUtilities from '../utilities/useUtilities'

const DevTools = ({ player, fps, gameLoop, gameobjects, handleGameLoopToggle, addAsteroidObject }) => {
  const { AsteroidsSmall, AsteroidsMedium } = useUtilities()

  return (
    <div className="devTools">
      <span className="fps">FPS: {String(fps.current)}</span>
      <button className="gameLoopBtn" onClick={handleGameLoopToggle}>GameLoop: {gameLoop.current ? 'ON' : 'OFF'}</button>
      <section>
        <span>Small Asteroids</span>
        <div className="devBtnRow">
          <button className="removeBtn" onClick={() => gameobjects.current.splice(-5, 5)}>-5</button>
          <button className="removeBtn" onClick={() => gameobjects.current.pop()}>-</button>
          <button className="addBtn" onClick={() => addAsteroidObject(player, gameobjects.current, AsteroidsSmall)}>+</button>
          <button className="addBtn" onClick={() => addAsteroidObject(player, gameobjects.current, AsteroidsSmall, 5)}>+5</button>
        </div>
      </section>
      <section>
        <span>Medium Asteroids</span>
        <div className="devBtnRow">
          <button className="removeBtn" onClick={() => gameobjects.current.pop()}>-</button>
          <button className="addBtn" onClick={() => addAsteroidObject(player, gameobjects.current, AsteroidsMedium)}>+</button>
        </div>
      </section>
    </div>
  )
}

export default DevTools
