import { useEffect } from "react"

const PickupScore = ({ setPickupScoreObjects, data }) => {

  const lifetime = 5000

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
    <p style={style}>{data.value}</p>
  )
}

export default PickupScore