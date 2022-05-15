import { useState } from 'react'
import Bullet from '../assets/Bullet.png'
import BulletSpike from '../assets/BulletSpike.png'
import BulletSpread from '../assets/BulletSpread.png'
import BulletLaser from '../assets/BulletLaser.png'
import { useAudioContext } from '../contexts/AudioProvider'
import { idGen, playAudio, degToRad } from './helpers'

const usePlayerBullets = (player) => {
  const { shootBulletAudio, shootSpikeAudio, shootLaserAudio } = useAudioContext()

  const speed = player.powerup.laser ? 1000 : 500
  const cooldownTime = player.powerup.spread ? 500 : player.powerup.mg ? 100 : player.powerup.laser ? 1000 : 250
  const width = 5
  const height = 5

  const configureType = () => {
    if (player.powerup.spread) return { path: BulletSpread, type: 'spread' }
    if (player.powerup.mg) return { path: BulletSpike, type: 'mg' }
    if (player.powerup.laser) return { path: BulletLaser, type: 'laser' }
    return { path: Bullet, type: 'bullet' }
  }

  const bulletTemplate = () => ({
    id: idGen(),
    angle: player.angle,
    width: width,
    height: height,
    x: player.x + player.width / 2 - width / 2,
    y: player.y + player.height / 2 - height / 2,
    xVelocity: 0 + speed * Math.sin(degToRad(player.angle)),
    yVelocity: 0 - speed * Math.cos(degToRad(player.angle)),
    ...configureType()
  })

  const [weaponCooldown, setWeaponCooldown] = useState(false)
  const [playerBullets, setPlayerBullets] = useState([])

  const createBullet = () => {
    if (weaponCooldown) return
    if (player.powerup.mg) playAudio(shootSpikeAudio)
    // else if (player.powerup.laser) playAudio(shootLaserAudio)
    else playAudio(shootBulletAudio)

    if (player.powerup.spread) setPlayerBullets(prev => [...prev, { ...bulletTemplate() },
    { ...bulletTemplate(), xVelocity: 0 + speed * Math.sin(degToRad(player.angle + 5)), yVelocity: 0 - speed * Math.cos(degToRad(player.angle + 5)), },
    { ...bulletTemplate(), xVelocity: 0 + speed * Math.sin(degToRad(player.angle - 5)), yVelocity: 0 - speed * Math.cos(degToRad(player.angle - 5)), }])
    else setPlayerBullets(prev => [...prev, { ...bulletTemplate() }])

    setWeaponCooldown(true)
    setTimeout(() => {
      setWeaponCooldown(false)
    }, cooldownTime)
  }

  return {
    playerBullets,
    setPlayerBullets,
    createBullet,
  }
}

export default usePlayerBullets
