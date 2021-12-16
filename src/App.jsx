import { useEffect, useRef, useState } from 'react'
import PlayerSprite from './assets/Player.png'
import Asteroid from './components/gameobjects/Asteroid'
import PlayerBullet from './components/gameobjects/PlayerBullet'
import TitleScreen from './components/TitleScreen'
import usePlayerBullets from './utilities/usePlayerBullets'
import useStageHandler from './utilities/useStageHandler'
import useUtilities from './utilities/useUtilities.js'
// import playerExplode from './assets/sound/playerExplode.wav'

function App() {
  //Settings
  const screenWidth = 800
  const screenHeight = 800

  const rotationSpeed = 2
  const thrustSpeed = 0.05
  const respawnTime = 1500

  const playerTemplate = {
    angle: 0,
    x: screenWidth / 2,
    y: screenHeight / 2,
    width: 13,
    height: 15,
    xVelocity: 0,
    yVelocity: 0,
    isAlive: true,
  }

  const [player, setPlayer] = useState(playerTemplate)
  const [keysPressed, setKeysPressed] = useState([])
  const [score, setScore] = useState(0)
  const [titleScreen, setTitleScreen] = useState(true)
  // const playerDeathAudio = useRef(new Audio(playerExplode))
  // playerDeathAudio.current.volume = 0.5
  const playerLives = useRef(3)
  const gameLoop = useRef(false)
  const update = useRef()
  const gameobjects = useRef([])
  const deltaTime = useRef(null)
  const oldTimestamp = useRef(null)
  const fps = useRef(null)

  const { playerBullets, setPlayerBullets, createBullet } = usePlayerBullets(player)
  const { degToRad, AsteroidsSmall, AsteroidsMedium, addGameObject, checkOverlap, euclideanTorus } = useUtilities(screenWidth, screenHeight)
  const { nextStageCheck, currentStage } = useStageHandler(screenWidth, screenHeight)

  const playerCollisionCheck = () => {
    gameobjects.current.forEach(object => {
      if (player.isAlive && checkOverlap(object, player)) {
        // console.log("played audio");
        // playerDeathAudio.current.play()
        console.log("crashed and died")
        setPlayer({ ...playerTemplate, isAlive: false })
        playerLives.current--
        if (playerLives.current) {
          setTimeout(() => {
            console.log("respawn")
            setPlayer(playerTemplate)
          }, respawnTime)
        }
      }
    })
  }

  const playerBulletsCollisionCheck = () => {
    playerBullets.forEach((bullet) => {
      gameobjects.current.forEach((gameobject) => {
        if (checkOverlap(bullet, gameobject)) {
          setPlayerBullets(prev => prev.filter(item => item.id !== bullet.id))
          gameobject.health = gameobject.health - 1

          if (gameobject.health <= 0) {
            if (gameobject.type === 'AsteroidMedium') {
              addGameObject(player, gameobjects.current, AsteroidsSmall, 3, gameobject.x, gameobject.y)
              setScore(prev => prev + 150)
            } else {
              setScore(prev => prev + 50)
            }
            gameobjects.current = gameobjects.current.filter(item => item.id !== gameobject.id)

            //Starts next stage
            if (gameobjects.current.length <= 0) setTimeout(() => {
              nextStageCheck(player, gameobjects.current)
            }, 2000)

          } else {
            gameobject.hitFlash = true
            setTimeout(() => {
              gameobject.hitFlash = false
            }, 100)
          }
        }
      })
    })
  }

  const handleGameLoopToggle = () => {
    if (gameLoop.current === true) return gameLoop.current = false
    if (gameLoop.current === false) {
      gameLoop.current = true
      requestAnimationFrame(update.current)
    }
  }

  const handleKeyDown = (e) => {
    if (!keysPressed.includes(e.key)) setKeysPressed(prev => [...prev, e.key])
  }

  const handleKeyUp = (e) => {
    setKeysPressed(prev => prev.filter(key => key !== e.key))
  }

  const keyInputController = () => {
    if (!player.isAlive) return
    if (keysPressed.includes("w")) setPlayer(prev => ({
      ...prev,
      xVelocity: prev.xVelocity + thrustSpeed * Math.sin(degToRad(player.angle)),
      yVelocity: prev.yVelocity - thrustSpeed * Math.cos(degToRad(player.angle)),
    }))
    if (keysPressed.includes("a")) setPlayer(prev => {
      if (prev.angle - rotationSpeed < 0) return { ...prev, angle: prev.angle - rotationSpeed + 360 }
      return { ...prev, angle: prev.angle - rotationSpeed }
    })
    if (keysPressed.includes("s")) setPlayer(prev => ({
      ...prev,
      xVelocity: prev.xVelocity - thrustSpeed * Math.sin(degToRad(player.angle)),
      yVelocity: prev.yVelocity + thrustSpeed * Math.cos(degToRad(player.angle)),
    }))
    if (keysPressed.includes("d")) setPlayer(prev => {
      if (prev.angle + rotationSpeed > 360) return { ...prev, angle: prev.angle + rotationSpeed - 360 }
      return { ...prev, angle: prev.angle + rotationSpeed }
    })
    if (keysPressed.includes(" ")) createBullet()
  }

  const startGame = () => {
    playerLives.current = 3
    setScore(0)
    setPlayer(playerTemplate)
    setTitleScreen(false)
    gameobjects.current = []
    currentStage.current = 0
    if (!gameLoop.current) {
      gameLoop.current = true
      requestAnimationFrame(update.current)
    }
    nextStageCheck(player, gameobjects.current)
  }

  //----------------------------
  //---------Game Loop----------
  //----------------------------
  update.current = (timestamp) => {
    //Fps counter
    deltaTime.current = (timestamp - oldTimestamp.current) / 1000
    oldTimestamp.current = timestamp
    fps.current = Math.round(1 / deltaTime.current)

    //Input handler
    keyInputController()

    //Update position
    setPlayer(prev => ({ ...prev, x: prev.x + prev.xVelocity, y: prev.y + prev.yVelocity }))
    setPlayerBullets(prev => prev.map(bullet => {
      return { ...bullet, x: bullet.x + bullet.xVelocity, y: bullet.y + bullet.yVelocity }
    }))
    gameobjects.current.forEach(item => {
      item.x = item.x + item.xVelocity
      item.y = item.y + item.yVelocity
      item.angle = item.angle + item.rotationSpeed
    })

    euclideanTorus(player, setPlayer)
    euclideanTorus(playerBullets, setPlayerBullets)
    euclideanTorus(gameobjects.current)

    //Collision checks
    playerCollisionCheck()
    playerBulletsCollisionCheck()

    //Quit check
    if (gameLoop.current === false) return console.log("quit the loop")

    //Restart loop
    requestAnimationFrame(update.current)
  }
  //-----------------------------------
  //----------Game Loop end------------
  //-----------------------------------

  useEffect(() => {
    // update.current()
    requestAnimationFrame(update.current)
  }, [])

  const playerStyle = {
    top: `${player.y}px`,
    left: `${player.x}px`,
    transform: `rotate(${player.angle}deg)`,
  }

  return (
    <div className="App" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex="0">
      <div className="gameScreen" style={{ width: screenWidth, height: screenHeight }}>
        {titleScreen && <TitleScreen startGame={startGame} />}
        {!titleScreen &&
          <div className="ingame">
            <div className="lives">
              <span>Lives:</span>
              {[...Array(playerLives.current)].map((item, i) => (<img src={PlayerSprite} key={i} alt="A life"/>))}
            </div>

            <div className="score">
              <span>Score: {score}</span>
            </div>

            {!playerLives.current && <div className="gameOver" onClick={startGame}>
              <p >Game Over</p>
            </div>}

            <img src={PlayerSprite} className={`player${!player.isAlive && ' hide'}`} style={playerStyle} alt="Player ship controlled by you."/>

            {gameobjects.current.map((item, i) => (
              <Asteroid data={item} key={i} />
            ))}
            {playerBullets.map((item, i) => (
              <PlayerBullet data={item} setPlayerBullets={setPlayerBullets} key={i} />
            ))}
          </div>
        }
      </div>
      <div className="devTools">
        <span className="fps">FPS: {String(fps.current)}</span>
        <button className="gameLoopBtn" onClick={handleGameLoopToggle}>GameLoop: {gameLoop.current ? 'ON' : 'OFF'}</button>
        <section>
          <span>Small Asteroids</span>
          <div className="devBtnRow">
            <button className="removeBtn" onClick={() => gameobjects.current.splice(-5, 5)}>-5</button>
            <button className="removeBtn" onClick={() => gameobjects.current.pop()}>-</button>
            <button className="addBtn" onClick={() => addGameObject(player, gameobjects.current, AsteroidsSmall)}>+</button>
            <button className="addBtn" onClick={() => addGameObject(player, gameobjects.current, AsteroidsSmall, 5)}>+5</button>
          </div>
        </section>
        <section>
          <span>Medium Asteroids</span>
          <div className="devBtnRow">
            <button className="removeBtn" onClick={() => gameobjects.current.pop()}>-</button>
            <button className="addBtn" onClick={() => addGameObject(player, gameobjects.current, AsteroidsMedium)}>+</button>
          </div>
        </section>
      </div>
    </div >
  )
}

export default App
