import React, { createContext, useContext, useState } from "react";
import PlayerExplodePath from '../assets/sound/playerExplode.wav'
import ShootBulletPath from '../assets/sound/shootBullet.wav'
import ShootSpikePath from '../assets/sound/shootSpike.wav'
import ShootLaserPath from '../assets/sound/shootLaser.wav'
import AsteroidExplode0Path from '../assets/sound/asteroidExplode0.wav'
import PowerupPickupPath from '../assets/sound/powerupPickup.wav'
// import AsteroidExplode1Path from '../assets/sound/asteroidExplode1.wav'

const AudioContext = createContext()
export const useAudioContext = () => useContext(AudioContext)

const AudioProvider = (props) => {
  const volume = 0.2
  
  const [deathAudio] = useState(new Audio(PlayerExplodePath))
  const [shootBulletAudio] = useState(new Audio(ShootBulletPath))
  const [shootSpikeAudio] = useState(new Audio(ShootSpikePath))
  const [shootLaserAudio] = useState(new Audio(ShootLaserPath))
  const [powerupPickupAudio] = useState(new Audio(PowerupPickupPath))
  const [asteroidExplode0Audio] = useState(new Audio(AsteroidExplode0Path))

  deathAudio.volume = volume
  asteroidExplode0Audio.volume = volume
  powerupPickupAudio.volume = volume
  shootBulletAudio.volume = volume / 2
  shootSpikeAudio.volume = volume / 2.5

  const values = {
    deathAudio,
    shootBulletAudio,
    shootSpikeAudio,
    shootLaserAudio,
    powerupPickupAudio,
    asteroidExplode0Audio,
  }

  return (
    <AudioContext.Provider value={values}>
      {props.children}
    </AudioContext.Provider>
  )
}

export default AudioProvider
