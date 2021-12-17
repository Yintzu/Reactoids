import { useState } from 'react'
import Bullet from '../assets/Bullet.png'
import useUtilities from './useUtilities'

const usePlayerBullets = (player) => {
  const { degToRad, idGen } = useUtilities()

  const speed = 500
  const cooldownTime = 200
  const width = 5
  const height = 5

  const bulletTemplate = {
    id: idGen(),
    angle: player.angle,
    width: width,
    height: height,
    x: player.x + player.width / 2 - width / 2,
    y: player.y + player.height / 2 - height / 2,
    xVelocity: 0 + speed * Math.sin(degToRad(player.angle)),
    yVelocity: 0 - speed * Math.cos(degToRad(player.angle)),
    path: Bullet
  }

  const [weaponCooldown, setWeaponCooldown] = useState(false)
  const [playerBullets, setPlayerBullets] = useState([])

  const createBullet = () => {
    if (weaponCooldown) return
    setPlayerBullets(prev => [...prev, { ...bulletTemplate }])
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
