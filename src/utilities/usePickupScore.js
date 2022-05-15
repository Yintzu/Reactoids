import { useState } from "react"
import useAsteroids from "./useAsteroids"

const usePickupScore = () => {
  const { idGen } = useAsteroids()
  const [pickupScoreObjects, setPickupScoreObjects] = useState([])

  const pickupScoreTemplate = (powerupObj) => ({
    id: idGen(),
    value: null,
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