import { useEffect, useRef, useState } from 'react'
import PlayerSprite from './assets/Player.png'
import DevTools from './components/DevTools'
import Asteroid from './components/gameobjects/Asteroid'
import PlayerBullet from './components/gameobjects/PlayerBullet'
import TitleScreen from './components/TitleScreen'
import { useAudioContext } from './contexts/AudioProvider'
import usePlayerBullets from './utilities/usePlayerBullets'
import useStageHandler from './utilities/useStageHandler'
import useUtilities from './utilities/useUtilities.js'
import ParticleEmitter from './components/ParticleEmitter'
import useFirebase from './utilities/useFirebase'
import EndScreen from './components/EndScreen'
import Upgrade from './components/gameobjects/Upgrade'

function App() {
  //Settings
  const screenWidth = 800
  const screenHeight = 800

  const rotationSpeed = 250
  const thrustSpeed = 3.5
  const respawnTime = 1500
  const invulnerabilityTime = 3000

  const playerTemplate = {
    angle: 0,
    x: screenWidth / 2,
    y: screenHeight / 2,
    width: 13,
    height: 15,
    xVelocity: 0,
    yVelocity: 0,
    isAlive: true,
    invulnerable: true,
    upgrades: {
      spread: false
    }
  }

  const [player, setPlayer] = useState(playerTemplate)
  const [particleObjects, setParticleObjects] = useState([])
  const [keysPressed, setKeysPressed] = useState([])
  const [score, setScore] = useState(0)
  const [titleScreen, setTitleScreen] = useState(true)
  const [showDevTools, setShowDevTools] = useState(false)

  const playerLives = useRef(3)
  const gameLoop = useRef(false)
  const update = useRef()
  const asteroidObjects = useRef([])
  const upgradeObjects = useRef([])
  const deltaTime = useRef(null)
  const oldTimestamp = useRef(null)
  const fps = useRef(null)

  const { deathAudio, asteroidExplode0Audio } = useAudioContext()
  const { playerBullets, setPlayerBullets, createBullet } = usePlayerBullets(player)
  const { degToRad, idGen, randomInteger, AsteroidsSmall, /* AsteroidsMedium, */ addAsteroidObject, checkOverlap, euclideanTorus } = useUtilities(screenWidth, screenHeight)
  const { nextStageCheck, currentStage } = useStageHandler(screenWidth, screenHeight)
  const { highscore, postHighscore, deleteHighscore } = useFirebase()

  const playerCollisionCheck = () => {
    asteroidObjects.current.forEach(object => {
      if (player.isAlive && checkOverlap(object, player)) {
        deathAudio.play()
        console.log("crashed and died")
        setParticleObjects(prev => [...prev, { ...player, id: 'player' }])
        setPlayer({ ...playerTemplate, isAlive: false })
        playerLives.current--
        if (playerLives.current >= 0) {
          setTimeout(() => {
            console.log("respawn")
            setPlayer(playerTemplate)
            //Spawn protection
            setTimeout(() => {
              setPlayer(prev => ({ ...prev, invulnerable: false }))
            }, invulnerabilityTime)
          }, respawnTime)
        }
      }
    })
  }

  const playerBulletsCollisionCheck = () => {
    playerBullets.forEach((bullet) => {
      asteroidObjects.current.forEach((gameobject) => {
        if (checkOverlap(bullet, gameobject)) {
          setPlayerBullets(prev => prev.filter(item => item.id !== bullet.id))
          gameobject.health = gameobject.health - 1

          if (gameobject.health <= 0) {
            if (gameobject.type === 'AsteroidMedium') {
              Math.random()
              addAsteroidObject(player, asteroidObjects.current, AsteroidsSmall, randomInteger(3, 5), gameobject.x, gameobject.y)
              setScore(prev => prev + 150)
            } else {
              setScore(prev => prev + 50)
            }

            upgradeObjects.current.push({ x: gameobject.x, y: gameobject.y, id: idGen(), width: 27, height: 14 })

            asteroidExplode0Audio.pause()
            asteroidExplode0Audio.currentTime = 0
            asteroidExplode0Audio.play()

            setParticleObjects(prev => [...prev, { ...gameobject }])
            asteroidObjects.current = asteroidObjects.current.filter(item => item.id !== gameobject.id)

            //Starts next stage
            if (asteroidObjects.current.length <= 0) setTimeout(() => {
              nextStageCheck(player, asteroidObjects.current)
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

  const upgradesCollisionCheck = () => {
    upgradeObjects.current.forEach((object) => {
      if (player.isAlive && checkOverlap(object, player)) {
        setPlayer(prev => ({ ...prev, upgrades: { ...prev, spread: true } }))
        upgradeObjects.current = upgradeObjects.current.filter(item => item.id !== object.id)
      }
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
      if (prev.angle /* - rotationSpeed */ < 0) return { ...prev, angle: prev.angle - rotationSpeed * deltaTime.current + 360 }
      return { ...prev, angle: prev.angle - rotationSpeed * deltaTime.current }
    })
    if (keysPressed.includes("s")) setPlayer(prev => ({
      ...prev,
      xVelocity: prev.xVelocity - thrustSpeed * Math.sin(degToRad(player.angle)),
      yVelocity: prev.yVelocity + thrustSpeed * Math.cos(degToRad(player.angle)),
    }))
    if (keysPressed.includes("d")) setPlayer(prev => {
      if (prev.angle /* + rotationSpeed */ > 360) return { ...prev, angle: prev.angle + rotationSpeed * deltaTime.current - 360 }
      return { ...prev, angle: prev.angle + rotationSpeed * deltaTime.current }
    })
    if (keysPressed.includes(" ")) createBullet()
  }

  const startGame = () => {
    playerLives.current = 3
    setScore(0)
    setPlayer({ ...playerTemplate, invulnerable: false })
    setTitleScreen(false)
    asteroidObjects.current = []
    currentStage.current = 0
    if (!gameLoop.current) {
      gameLoop.current = true
      requestAnimationFrame(update.current)
    }
    setTimeout(() => {
      nextStageCheck(player, asteroidObjects.current)
    }, 1000)
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
    setPlayer(prev => ({ ...prev, x: prev.x + prev.xVelocity * deltaTime.current, y: prev.y + prev.yVelocity * deltaTime.current }))
    setPlayerBullets(prev => prev.map(bullet => {
      return { ...bullet, x: bullet.x + bullet.xVelocity * deltaTime.current, y: bullet.y + bullet.yVelocity * deltaTime.current }
    }))
    asteroidObjects.current.forEach(item => {
      item.x = item.x + item.xVelocity * deltaTime.current
      item.y = item.y + item.yVelocity * deltaTime.current
      item.angle = item.angle + item.rotationSpeed * deltaTime.current
    })

    euclideanTorus(player, setPlayer)
    euclideanTorus(playerBullets, setPlayerBullets)
    euclideanTorus(asteroidObjects.current)

    //Collision checks
    if (!player.invulnerable) playerCollisionCheck()
    playerBulletsCollisionCheck()
    upgradesCollisionCheck()

    //Quit check
    if (!gameLoop.current) return console.log("quit the loop")

    //Restart loop
    requestAnimationFrame(update.current)
  }
  //-----------------------------------
  //----------Game Loop end------------
  //-----------------------------------

  useEffect(() => {
    requestAnimationFrame(update.current)
  }, [])

  const playerStyle = {
    top: `${player.y}px`,
    left: `${player.x}px`,
    transform: `rotate(${player.angle}deg)`,
  }

  return (
    <div className="App" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex="0">
      {/* <div style={{ width: '30px', height: '30px', position: 'fixed', bottom: '0', right: '0' }} onClick={() => setShowDevTools(!showDevTools)}></div> */}
      <div className="gameScreen" style={{ width: screenWidth, height: screenHeight }}>
        {titleScreen && <TitleScreen startGame={startGame} highscore={highscore} />}
        {!titleScreen &&
          <div className="ingame">
            <div className="lives">
              <p>Lives:</p>
              {playerLives.current > 0 && [...Array(playerLives.current)].map((item, i) => (<img src={PlayerSprite} key={i} alt="A life" />))}
            </div>

            <div className="score">
              <p>Score: {score}</p>
            </div>

            {particleObjects.map(object => <ParticleEmitter key={object.id} data={object} setParticleObjects={setParticleObjects} />)}

            {playerLives.current < 0 &&
              <EndScreen highscore={highscore} score={score} startGame={startGame} postHighscore={postHighscore} deleteHighscore={deleteHighscore} />
            }

            {playerBullets.map((item, i) => (
              <PlayerBullet data={item} setPlayerBullets={setPlayerBullets} key={i} />
            ))}

            <img src={PlayerSprite} className={`player ${!player.isAlive && 'hide'} ${player.invulnerable && 'flashing'}`} style={playerStyle} alt="Player ship controlled by you." />

            {asteroidObjects.current.map((item, i) => (
              <Asteroid data={item} key={i} />
            ))}

            {upgradeObjects.current.map((item, i) => (
              <Upgrade data={item} upgradeObjects={upgradeObjects} key={i} />
            ))}
          </div>
        }
      </div>
      {showDevTools &&
        <DevTools player={player} fps={fps} asteroidObjects={asteroidObjects} gameLoop={gameLoop} handleGameLoopToggle={handleGameLoopToggle} addAsteroidObject={addAsteroidObject} />
      }
    </div >
  )
}

export default App
