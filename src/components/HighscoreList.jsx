import React from 'react'

const HighscoreList = ({ highscore, startGame, postedHighscoreId }) => {

  const fillDots = (item) => {
    return '.'.repeat(25 - (item.name.length + String(item.score).length))
  }

  return (
    <div className='highscore' onClick={startGame}>
      <p className='textLarge'>Highscore</p>
      {highscore &&
        <div className='highscoreList'>
          {highscore.map((item, i) => (<p className={`highscoreItem ${item.id === postedHighscoreId && 'flashingYellow'}`} style={{ '--DELAY': `${i / 10}s` }} key={item.id}>{item.name}<span>{fillDots(item)}</span>{item.score}</p>))}
        </div>
      }
      <p className='restartText'>- Click to restart -</p>
    </div>
  )
}

export default HighscoreList
