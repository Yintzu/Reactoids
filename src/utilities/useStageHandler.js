import { useRef } from 'react'
import useUtilities from './useUtilities'

const useStageHandler = (screenWidth, screenHeight) => {
  const { addAsteroidObject, AsteroidsSmall, AsteroidsMedium, AsteroidsLarge } = useUtilities(screenWidth, screenHeight)
  const currentStage = useRef(0)

  const nextStageCheck = (player, gameObjects) => {
    if (gameObjects.length > 0) return

    addAsteroidObject(player, gameObjects, AsteroidsSmall, 4 + currentStage.current)
    addAsteroidObject(player, gameObjects, AsteroidsMedium, 1 + currentStage.current)
    addAsteroidObject(player, gameObjects, AsteroidsLarge, Math.floor(currentStage.current / 2))
    currentStage.current++
  }

  return {
    nextStageCheck,
    currentStage,
  }
}

export default useStageHandler
