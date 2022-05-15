import AsteroidSmall0 from "../assets/AsteroidsSmall/AsteroidSmall0.png"
import AsteroidSmall1 from "../assets/AsteroidsSmall/AsteroidSmall1.png"
import AsteroidSmall2 from "../assets/AsteroidsSmall/AsteroidSmall2.png"
import AsteroidSmall3 from "../assets/AsteroidsSmall/AsteroidSmall3.png"

import AsteroidMedium0 from "../assets/AsteroidsMedium/AsteroidMedium0.png"
import AsteroidMedium1 from "../assets/AsteroidsMedium/AsteroidMedium1.png"
import AsteroidMedium2 from "../assets/AsteroidsMedium/AsteroidMedium2.png"
import AsteroidMedium3 from "../assets/AsteroidsMedium/AsteroidMedium3.png"
import { idGen } from "./helpers"

const importAll = (r) => r.keys().map(r)
const AsteroidSmallSprites = importAll(require.context('../assets/AsteroidsSmall', false, /\.(png|jpe?g|svg)$/))
const AsteroidMediumSprites = importAll(require.context('../assets/AsteroidsMedium', false, /\.(png|jpe?g|svg)$/))
const AsteroidLargeSprites = importAll(require.context('../assets/AsteroidsLarge', false, /\.(png|jpe?g|svg)$/))

const useAsteroids = (screenWidth, screenHeight) => {

  const spawnSafety = 200
  const asteroidSpeed = 200
  const asteroidRotationSpeed = 30

  const AsteroidsSmall = [
    {
      width: 20,
      height: 17,
      path: AsteroidSmall0,
    },
    {
      width: 21,
      height: 18,
      path: AsteroidSmall1,
    },
    {
      width: 20,
      height: 21,
      path: AsteroidSmall2,
    },
    {
      width: 22,
      height: 14,
      path: AsteroidSmall3,
    },
  ]

  const AsteroidsMedium = [AsteroidMedium0, AsteroidMedium1, AsteroidMedium2, AsteroidMedium3].map(item => ({ width: 64, height: 61, path: item }))
  const AsteroidsLarge = AsteroidLargeSprites.map(item => ({ width: 128, height: 128, path: item }))

  const randomCoordinate = (axis) => {
    if (axis === 'x') return Math.floor(Math.random() * screenWidth)
    if (axis === 'y') return Math.floor(Math.random() * screenHeight)
  }

  const asteroidTemplate = () => {
    return {
      id: idGen(),
      xVelocity: (Math.random() - 0.5) * asteroidSpeed,
      yVelocity: (Math.random() - 0.5) * asteroidSpeed,
      angle: Math.floor(Math.random() * 360),
      rotationSpeed: (Math.random() - 0.5) * asteroidRotationSpeed,
    }
  }

  const configueType = (objArray) => {
    if (AsteroidSmallSprites.includes(objArray[0].path)) return { type: 'AsteroidSmall', health: 1 }
    if (AsteroidMediumSprites.includes(objArray[0].path)) return { type: 'AsteroidMedium', health: 3, hitFlash: false }
    if (AsteroidLargeSprites.includes(objArray[0].path)) return { type: 'AsteroidLarge', health: 12, hitFlash: false }
  }

  const addAsteroidObject = (player, gameObjects, objArray, amount = 1, x, y) => {
    for (let i = 0; i < amount; i++) {
      let tempX = randomCoordinate('x')
      let tempY = randomCoordinate('y')
      while (tempX > player.x - spawnSafety && tempX < player.x + spawnSafety && tempY > player.y - spawnSafety && tempY < player.y + spawnSafety) {
        console.log("bad spawn")
        tempX = randomCoordinate('x')
        tempY = randomCoordinate('y')
      }

      gameObjects.push({
        ...asteroidTemplate(),
        ...configueType(objArray),
        ...objArray[Math.floor(Math.random() * objArray.length)],
        x: x ?? tempX,
        y: y ?? tempY,
      })
    }
  }

  return {
    AsteroidsSmall,
    AsteroidsMedium,
    AsteroidsLarge,
    addAsteroidObject,
  }
}

export default useAsteroids
