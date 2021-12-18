import React, { createContext, useContext, useState } from "react";
import PlayerExplodePath from '../assets/sound/playerExplode.wav'
import ShootBulletPath from '../assets/sound/shootBullet.wav'
import AsteroidExplode0Path from '../assets/sound/asteroidExplode0.wav'
import AsteroidExplode1Path from '../assets/sound/asteroidExplode1.wav'

const AudioContext = createContext()
export const useAudioContext = () => useContext(AudioContext)

const AudioProvider = (props) => {
  const volume = 0.1
  
  const [deathAudio] = useState(new Audio(PlayerExplodePath))
  const [shootBulletAudio] = useState(new Audio(ShootBulletPath))
  const [asteroidExplode0Audio] = useState(new Audio(AsteroidExplode0Path))

  deathAudio.volume = volume
  shootBulletAudio.volume = volume / 3
  asteroidExplode0Audio.volume = volume

  const values = {
    deathAudio,
    shootBulletAudio,
    asteroidExplode0Audio
  }

  return (
    <AudioContext.Provider value={values}>
      {props.children}
    </AudioContext.Provider>
  )
}

export default AudioProvider
