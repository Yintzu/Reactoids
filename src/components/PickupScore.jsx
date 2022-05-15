import { useEffect } from "react"

const PickupScore = ({ setPickupScoreObjects, data }) => {

  const lifetime = 800

  const style = {
    position: 'absolute',
    top: data.y,
    left: data.x,
  }

  useEffect(() => {
    setTimeout(() => {
      setPickupScoreObjects(prev => prev.filter(item => item.id !== data.id))
    }, lifetime)
  }, []) //eslint-disable-line

  return (
    <div className="floatUp" style={style} >
      <p className="pickupScoreFlash">{data.score}</p>
    </div>
  )
}

export default PickupScore