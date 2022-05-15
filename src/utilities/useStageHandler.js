import { useRef } from 'react'
import useAsteroids from './useAsteroids'

const useStageHandler = (screenWidth, screenHeight) => {
  const { addAsteroidObject, AsteroidsSmall, AsteroidsMedium, AsteroidsLarge } = useAsteroids(screenWidth, screenHeight)
  const currentStage = useRef(0)

  const nextStageCheck = (player, gameObjects) => {
    if (gameObjects.length > 0) return

    addAsteroidObject(player, gameObjects, AsteroidsSmall, 4 + currentStage.current)
    addAsteroidObject(player, gameObjects, AsteroidsMedium, 1 + currentStage.current)
    addAsteroidObject(player, gameObjects, AsteroidsLarge, Math.floor(currentStage.current / 2))
    currentStage.current++
  }

  const euclideanTorus = (thingToAffect, setFunction) => {
    if (Array.isArray(thingToAffect)) {
      thingToAffect.forEach((object) => {
        if (object.x + object.width < 0) !setFunction ? object.x = screenWidth : setFunction(prev => [...prev.filter(item => item.id !== object.id), { ...object, x: screenWidth }])
        if (object.x > screenWidth) !setFunction ? object.x = 0 - object.width : setFunction(prev => [...prev.filter(item => item.id !== object.id), { ...object, x: 0 - object.width }])
        if (object.y + object.height < 0) !setFunction ? object.y = screenHeight : setFunction(prev => [...prev.filter(item => item.id !== object.id), { ...object, y: screenHeight }])
        if (object.y > screenHeight) !setFunction ? object.y = 0 - object.height : setFunction(prev => [...prev.filter(item => item.id !== object.id), { ...object, y: 0 - object.height }])
      })
    } else if (!Array.isArray(thingToAffect)) {
      if (thingToAffect.x + thingToAffect.width < 0) setFunction(prev => ({ ...prev, x: prev.x + screenWidth }))
      if (thingToAffect.x > screenWidth) setFunction(prev => ({ ...prev, x: prev.x - screenWidth }))
      if (thingToAffect.y + thingToAffect.height < 0) setFunction(prev => ({ ...prev, y: prev.y + screenHeight }))
      if (thingToAffect.y > screenHeight) setFunction(prev => ({ ...prev, y: prev.y - screenHeight }))
    }
  }

  return {
    nextStageCheck,
    currentStage,
    euclideanTorus
  }
}

export default useStageHandler
