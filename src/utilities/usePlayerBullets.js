import { useState } from 'react'
import Bullet from '../assets/Bullet.png'
import BulletSpike from '../assets/BulletSpike.png'
import BulletSpread from '../assets/BulletSpread.png'
import BulletLaser from '../assets/BulletLaser.png'
import { useAudioContext } from '../contexts/AudioProvider'
import useUtilities from './useUtilities'

const usePlayerBullets = (player) => {
  const { degToRad, idGen, playAudio } = useUtilities()
  const { shootBulletAudio, shootSpikeAudio, shootLaserAudio } = useAudioContext()

  const speed = 500
  const cooldownTime = player.upgrades.spread ? 500 : player.upgrades.mg ? 100 : 250
  const width = 5
  const height = 5

  const configureType = () => {
    if (player.upgrades.spread) return { path: BulletSpread, type: 'spread' }
    if (player.upgrades.mg) return { path: BulletSpike, type: 'mg' }
    if (player.upgrades.laser) return { path: BulletLaser, type: 'laser' }
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
    if (player.upgrades.mg) playAudio(shootSpikeAudio)
    // else if (player.upgrades.laser) playAudio(shootLaserAudio)
    else playAudio(shootBulletAudio)

    if (player.upgrades.spread) setPlayerBullets(prev => [...prev, { ...bulletTemplate() },
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
