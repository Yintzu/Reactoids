import AsteroidSmall0 from "../assets/AsteroidsSmall/AsteroidSmall0.png"
import AsteroidSmall1 from "../assets/AsteroidsSmall/AsteroidSmall1.png"
import AsteroidSmall2 from "../assets/AsteroidsSmall/AsteroidSmall2.png"
import AsteroidSmall3 from "../assets/AsteroidsSmall/AsteroidSmall3.png"

import AsteroidMedium0 from "../assets/AsteroidsMedium/AsteroidMedium0.png"
import AsteroidMedium1 from "../assets/AsteroidsMedium/AsteroidMedium1.png"
import AsteroidMedium2 from "../assets/AsteroidsMedium/AsteroidMedium2.png"
import AsteroidMedium3 from "../assets/AsteroidsMedium/AsteroidMedium3.png"

const importAll = (r) => r.keys().map(r)
const AsteroidSmallSprites = importAll(require.context('../assets/AsteroidsSmall', false, /\.(png|jpe?g|svg)$/))
const AsteroidMediumSprites = importAll(require.context('../assets/AsteroidsMedium', false, /\.(png|jpe?g|svg)$/))

const useUtilities = (screenWidth, screenHeight) => {

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

  // console.log(`deltaTime.current`, deltaTime?.current)

  const AsteroidsMedium = [AsteroidMedium0, AsteroidMedium1, AsteroidMedium2, AsteroidMedium3].map(item => ({ width: 64, height: 61, path: item }))

  const idGen = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  const degToRad = (deg) => {
    return deg * (Math.PI / 180)
  }
  const radToDeg = (rad) => {
    return rad * (180 / Math.PI)
  }

  const checkOverlap = (object, object2) => {
    if (object2.x >= (object.x + object.width) || object.x >= (object2.x + object2.width)) return false
    if ((object2.y + object2.height) <= object.y || (object.y + object.height) <= object2.y) return false
    return true
  }

  const euclideanTorus = (thingToAffect, setFunction) => {
    if (Array.isArray(thingToAffect)) {
      thingToAffect.forEach((object) => {
        if (object.x < 0) !setFunction ? object.x = object.x + screenWidth : setFunction(prev => [...prev.filter(item => item.id !== object.id), { ...object, x: screenWidth }])
        if (object.x > screenWidth) !setFunction ? object.x = object.x - screenWidth : setFunction(prev => [...prev.filter(item => item.id !== object.id), { ...object, x: 0 }])
        if (object.y < 0) object.y = !setFunction ? object.y + screenHeight : setFunction(prev => [...prev.filter(item => item.id !== object.id), { ...object, y: screenHeight }])
        if (object.y > screenHeight) !setFunction ? object.y = object.y - screenHeight : setFunction(prev => [...prev.filter(item => item.id !== object.id), { ...object, y: 0 }])
      })
    } else if (!Array.isArray(thingToAffect)) {
      if (thingToAffect.x < 0) setFunction(prev => ({ ...prev, x: prev.x + screenWidth }))
      if (thingToAffect.x > screenWidth) setFunction(prev => ({ ...prev, x: prev.x - screenWidth }))
      if (thingToAffect.y < 0) setFunction(prev => ({ ...prev, y: prev.y + screenHeight }))
      if (thingToAffect.y > screenHeight) setFunction(prev => ({ ...prev, y: prev.y - screenHeight }))
    }
  }

  const randomCoordinate = (axis) => {
    if (axis === 'x') return Math.floor(Math.random() * screenWidth)
    if (axis === 'y') return Math.floor(Math.random() * screenHeight)
  }

  const objectTemplate = () => {
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
  }

  const addGameObject = (player, gameObjects, objArray, amount = 1, x, y) => {
    for (let i = 0; i < amount; i++) {
      let tempX = randomCoordinate('x')
      let tempY = randomCoordinate('y')
      while (tempX > player.x - spawnSafety && tempX < player.x + spawnSafety && tempY > player.y - spawnSafety && tempY < player.y + spawnSafety) {
        console.log("bad spawn")
        tempX = randomCoordinate('x')
        tempY = randomCoordinate('y')
      }

      gameObjects.push({
        ...objectTemplate(),
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
    degToRad,
    radToDeg,
    addGameObject,
    idGen,
    checkOverlap,
    euclideanTorus,
  }
}

export default useUtilities
