import { useRef } from "react"
import { idGen, randomInteger } from "./helpers"

const usePowerups = player => {
  const powerupObjects = useRef([])

  const powerupTemplate = (gameobject, type) => ({
    x: gameobject.x,
    y: gameobject.y,
    id: idGen(),
    width: 25,
    height: 12,
    type,
    score: type === "1k" ? 1000 : 350,
  })

  const spawnPowerupCheck = gameobject => {
    const hasPowerup = Object.values(player.powerup).includes(true)
    if (Math.round(Math.random() * 100) <= (hasPowerup ? 6 : 15)) {
      switch (randomInteger(0, hasPowerup ? 3 : 2)) {
        case 0:
          powerupObjects.current.push({
            ...powerupTemplate(gameobject, "spread"),
          })
          break
        case 1:
          powerupObjects.current.push({
            ...powerupTemplate(gameobject, "mg"),
          })
          break
        case 2:
          powerupObjects.current.push({
            ...powerupTemplate(gameobject, "laser"),
          })
          break
        case 3:
          powerupObjects.current.push({
            ...powerupTemplate(gameobject, "1k"),
          })
          break
        default:
          throw new Error("Missing switch case")
      }
    }
  }

  return {
    powerupObjects,
    spawnPowerupCheck,
  }
}

export default usePowerups
