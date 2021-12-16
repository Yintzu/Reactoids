import { useRef } from 'react'
import useUtilities from './useUtilities'

const useStageHandler = (screenWidth, screenHeight) => {
  const { addGameObject, AsteroidsSmall, AsteroidsMedium } = useUtilities(screenWidth, screenHeight)
  const currentStage = useRef(0)

  const nextStageCheck = (player, gameObjects) => {
    if (gameObjects.length > 0) return

    addGameObject(player, gameObjects, AsteroidsSmall, 5 + currentStage.current)
    addGameObject(player, gameObjects, AsteroidsMedium, currentStage.current)
    currentStage.current++
  }

  return {
    nextStageCheck,
    currentStage,
  }
}

export default useStageHandler
