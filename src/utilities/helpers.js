export const idGen = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const degToRad = (deg) => {
  return deg * (Math.PI / 180)
}
export const radToDeg = (rad) => {
  return rad * (180 / Math.PI)
}

export const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const playAudio = (audio) => {
  audio.pause()
  audio.currentTime = 0
  audio.play()
}

export const checkOverlap = (object, object2) => {
  if (object2.x >= (object.x + object.width) || object.x >= (object2.x + object2.width)) return false
  if ((object2.y + object2.height) <= object.y || (object.y + object.height) <= object2.y) return false
  return true
}

