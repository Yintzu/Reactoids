import React, { createContext, useContext, useState } from "react";
import PlayerExplodePath from '../assets/sound/playerExplode.wav'
import ShootBulletPath from '../assets/sound/shootBullet.wav'
import ShootSpikePath from '../assets/sound/shootSpike.wav'
import AsteroidExplode0Path from '../assets/sound/asteroidExplode0.wav'
// import AsteroidExplode1Path from '../assets/sound/asteroidExplode1.wav'

const AudioContext = createContext()
export const useAudioContext = () => useContext(AudioContext)

const AudioProvider = (props) => {
  const volume = 0.2
  
  const [deathAudio] = useState(new Audio(PlayerExplodePath))
  const [shootBulletAudio] = useState(new Audio(ShootBulletPath))
  const [shootSpikeAudio] = useState(new Audio(ShootSpikePath))
  const [asteroidExplode0Audio] = useState(new Audio(AsteroidExplode0Path))

  deathAudio.volume = volume
  shootBulletAudio.volume = volume / 2
  shootSpikeAudio.volume = volume / 2.5
  asteroidExplode0Audio.volume = volume

  const values = {
    deathAudio,
    shootBulletAudio,
    shootSpikeAudio,
    asteroidExplode0Audio
  }

  return (
    <AudioContext.Provider value={values}>
      {props.children}
    </AudioContext.Provider>
  )
}

export default AudioProvider
