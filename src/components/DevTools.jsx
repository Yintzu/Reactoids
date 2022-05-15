import React from 'react'
import useAsteroids from '../utilities/useAsteroids'

const DevTools = ({ player, setPlayer, fps, gameLoop, asteroidObjects, handleGameLoopToggle, addAsteroidObject }) => {
  const { AsteroidsSmall, AsteroidsMedium, AsteroidsLarge } = useAsteroids()

  return (
    <div className="devTools">
      <span className="fps">FPS: {String(fps.current)}</span>
      <button className="gameLoopBtn" onClick={handleGameLoopToggle}>GameLoop: {gameLoop.current ? 'ON' : 'OFF'}</button>
      <section>
        <span>Small Asteroids</span>
        <div className="devBtnRow">
          <button className="addBtn" onClick={() => addAsteroidObject(player, asteroidObjects.current, AsteroidsSmall)}>+</button>
          <button className="addBtn" onClick={() => addAsteroidObject(player, asteroidObjects.current, AsteroidsSmall, 5)}>+5</button>
        </div>
      </section>
      <section>
        <span>Medium Asteroids</span>
        <div className="devBtnRow">
          <button className="addBtn" onClick={() => addAsteroidObject(player, asteroidObjects.current, AsteroidsMedium)}>+</button>
        </div>
      </section>
      <section>
        <span>Large Asteroids</span>
        <div className="devBtnRow">
          <button className="addBtn" onClick={() => addAsteroidObject(player, asteroidObjects.current, AsteroidsLarge)}>+</button>
        </div>
      </section>
      <section>
        <span>Remove Asteroids</span>
        <div className="devBtnRow">
          <button className="removeBtn" onClick={() => asteroidObjects.current.pop()}>-</button>
          <button className="removeBtn" onClick={() => asteroidObjects.current.splice(-5, 5)}>-5</button>
        </div>
      </section>
      <section>
        <span>Powerups</span>
        <div className="devBtnRow">
          <button className="removeBtn" onClick={() => setPlayer(prev => ({ ...prev, upgrades: { spread: true, mg: false, laser: false } }))}>Spread</button>
          <button className="removeBtn" onClick={() => setPlayer(prev => ({ ...prev, upgrades: { spread: false, mg: true, laser: false } }))}>MG</button>
          <button className="removeBtn" onClick={() => setPlayer(prev => ({ ...prev, upgrades: { spread: false, mg: false, laser: true } }))}>Laser</button>
        </div>
      </section>
    </div>
  )
}

export default DevTools
