import { useRef } from 'react'
import useUtilities from './useUtilities'

const useStageHandler = (screenWidth, screenHeight) => {
  const { addAsteroidObject, AsteroidsSmall, AsteroidsMedium } = useUtilities(screenWidth, screenHeight)
  const currentStage = useRef(0)

  const nextStageCheck = (player, gameObjects) => {
    if (gameObjects.length > 0) return

    addAsteroidObject(player, gameObjects, AsteroidsSmall, 5 + currentStage.current)
    addAsteroidObject(player, gameObjects, AsteroidsMedium, currentStage.current)
    currentStage.current++
  }

  return {
    nextStageCheck,
    currentStage,
  }
}

export default useStageHandler
