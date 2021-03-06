import { useEffect, useRef, useState } from 'react'
import { useAudioContext } from './contexts/AudioProvider'
import { degToRad, randomInteger, playAudio, checkOverlap } from './utilities/helpers'
import usePowerups from './utilities/usePowerups'
import usePlayerBullets from './utilities/usePlayerBullets'
import useStageHandler from './utilities/useStageHandler'
import useAsteroids from './utilities/useAsteroids.js'
import useFirebase from './utilities/useFirebase'
import usePickupScore from './utilities/usePickupScore'
import DevTools from './components/DevTools'
import Asteroid from './components/gameobjects/Asteroid'
import PlayerBullet from './components/gameobjects/PlayerBullet'
import TitleScreen from './components/TitleScreen'
import ParticleEmitter from './components/ParticleEmitter'
import EndScreen from './components/EndScreen'
import Powerup from './components/gameobjects/Powerup'
import PickupScore from './components/PickupScore'
import PlayerSprite from './assets/Player.png'

function App() {
  //Settings
  const screenWidth = 800
  const screenHeight = 800

  const rotationSpeed = 250
  const thrustSpeed = 3.5
  const respawnTime = 1500
  const invulnerabilityTime = 3000

  const powerupsTemplate = {
    spread: false,
    mg: false,
    laser: false,
  }

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
    powerup: { ...powerupsTemplate }
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
  const deltaTime = useRef(null)
  const oldTimestamp = useRef(null)
  const fps = useRef(null)

  const { deathAudio, powerupPickupAudio, asteroidExplode0Audio } = useAudioContext()
  const { playerBullets, setPlayerBullets, createBullet } = usePlayerBullets(player)
  const { powerupObjects, spawnPowerupCheck } = usePowerups(player)
  const { pickupScoreObjects, setPickupScoreObjects, createPickupScore } = usePickupScore()
  const { AsteroidsSmall, AsteroidsMedium, addAsteroidObject } = useAsteroids(screenWidth, screenHeight)
  const { nextStageCheck, currentStage, euclideanTorus } = useStageHandler(screenWidth, screenHeight)
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
          if (bullet.type === 'laser' && gameobject.type === 'AsteroidLarge') {
            gameobject.health = gameobject.health - 4
          } else gameobject.health = gameobject.health - 1
          if (bullet.type !== 'laser' || (gameobject.type === 'AsteroidLarge' && gameobject.health > 0)) setPlayerBullets(prev => prev.filter(item => item.id !== bullet.id))
          if (gameobject.health <= 0) {
            if (gameobject.type === 'AsteroidLarge') {
              addAsteroidObject(player, asteroidObjects.current, AsteroidsMedium, randomInteger(4, 5), gameobject.x, gameobject.y)
              setScore(prev => prev + 500)
            }
            else if (gameobject.type === 'AsteroidMedium') {
              addAsteroidObject(player, asteroidObjects.current, AsteroidsSmall, randomInteger(3, 4), gameobject.x, gameobject.y)
              setScore(prev => prev + 150)
            } else {
              setScore(prev => prev + 50)
            }

            spawnPowerupCheck(gameobject)

            playAudio(asteroidExplode0Audio)

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

  const powerupCollisionCheck = () => {
    powerupObjects.current.forEach((object) => {
      if (player.isAlive && checkOverlap(object, player)) {
        playAudio(powerupPickupAudio)
        if (object.type !== '1k') {
          setPlayer(prev => ({ ...prev, powerup: { ...powerupsTemplate, [object.type]: true } }))
        }
        setScore(prev => prev + object.score)
        createPickupScore(object)
        powerupObjects.current = powerupObjects.current.filter(item => item.id !== object.id)
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
      if (prev.angle < 0) return { ...prev, angle: prev.angle - rotationSpeed * deltaTime.current + 360 }
      return { ...prev, angle: prev.angle - rotationSpeed * deltaTime.current }
    })
    if (keysPressed.includes("s")) setPlayer(prev => ({
      ...prev,
      xVelocity: prev.xVelocity - thrustSpeed * Math.sin(degToRad(player.angle)),
      yVelocity: prev.yVelocity + thrustSpeed * Math.cos(degToRad(player.angle)),
    }))
    if (keysPressed.includes("d")) setPlayer(prev => {
      if (prev.angle > 360) return { ...prev, angle: prev.angle + rotationSpeed * deltaTime.current - 360 }
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
    powerupCollisionCheck()

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
      <div style={{ width: '30px', height: '30px', position: 'fixed', bottom: '0', right: '0' }} onClick={() => setShowDevTools(!showDevTools)}></div>
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

            {pickupScoreObjects.map(object => <PickupScore key={object.id} data={object} setPickupScoreObjects={setPickupScoreObjects} />)}

            {playerLives.current < 0 &&
              <EndScreen highscore={highscore} score={score} startGame={startGame} postHighscore={postHighscore} deleteHighscore={deleteHighscore} />
            }

            {powerupObjects.current.map((item) => (
              <Powerup data={item} powerupObjects={powerupObjects} key={item.id} />
            ))}

            {playerBullets.map((item) => (
              <PlayerBullet data={item} setPlayerBullets={setPlayerBullets} key={item.id} />
            ))}

            <img src={PlayerSprite} className={`player ${!player.isAlive && 'hide'} ${player.invulnerable && 'flashing'}`} style={playerStyle} alt="Player ship controlled by you." />

            {asteroidObjects.current.map((item, i) => (
              <Asteroid data={item} key={i} />
            ))}
          </div>
        }
      </div>
      {showDevTools &&
        <DevTools player={player} setPlayer={setPlayer} fps={fps} asteroidObjects={asteroidObjects} gameLoop={gameLoop} handleGameLoopToggle={handleGameLoopToggle} addAsteroidObject={addAsteroidObject} />
      }
    </div >
  )
}

export default App
