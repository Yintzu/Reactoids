import { useState } from "react"
import { idGen } from "./helpers"

const usePickupScore = () => {
  const [pickupScoreObjects, setPickupScoreObjects] = useState([])

  const pickupScoreTemplate = (powerupObj) => ({
    id: idGen(),
    score: powerupObj.score,
    x: powerupObj.x,
    y: powerupObj.y,
  })

  const createPickupScore = (powerupObj) => {
    setPickupScoreObjects(prev => [...prev, pickupScoreTemplate(powerupObj)])
  }

  return {
    pickupScoreObjects,
    setPickupScoreObjects,
    createPickupScore
  }
}

export default usePickupScore