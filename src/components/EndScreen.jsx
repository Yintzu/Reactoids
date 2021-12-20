import React, { useEffect, useRef, useState } from 'react'

const EndScreen = ({ startGame, highscore }) => {
  const [state, setState] = useState(2)
  const [nameInput, setNameInput] = useState('TEST')
  const inputRefs = useRef([])

  const handleNameInput = (e, i) => {
    console.log("nameInput[i]", nameInput[i])
    setNameInput(prev => (prev.substring(0, i) + e.target.value).toUpperCase() /* + prev.substring(i +1) */)
  }

  const handleClick = () => {
    console.log(inputRefs.current)
    inputRefs.current[nameInput.length].focus()
  }

  const handleKeyDown = (e) => {
    if (["Backspace", "Delete"].includes(e.key)) setNameInput(prev => prev.slice(0, -1))
  }

  const fillDots = (item) => {
    return '.'.repeat(35 - (item.name.length + String(item.score).length))
  }

  const fillRefs = (el) => {
    if (el && !inputRefs.current.includes(el)) inputRefs.current.push(el)
  }

  useEffect(() => {
    if (nameInput.length < inputRefs.current.length) inputRefs.current[nameInput.length].focus()
  }, [nameInput])

  return (
    <>
      {state === 0 &&
        <div className="gameOver" onClick={() => setState(1)}>
          <p className='gameOverText'>Game Over</p>
          <p>- Click to Restart -</p>
        </div>
      }
      {state === 1 &&
        <div className='highscore' onClick={startGame}>
          <p className='highscoreText'>Highscore</p>
          {highscore &&
            <div className='highscoreList'>
              {highscore.map((item, i) => (<p className='highscoreItem' style={{ '--delay': `${i / 10}s` }} key={item.id}>{item.name}<span>{fillDots(item)}</span>{item.score}</p>))}
            </div>
          }
        </div>
      }
      {state === 2 &&
        <div className='nameInputWrapper' onClick={() => handleClick()}>
          <p>New Highscore!</p>
          {[...Array(6)].map((item, i) => (<input type="text" key={i} className={``} value={nameInput[i] ?? ''} onChange={(e) => handleNameInput(e, i)} onKeyDown={handleKeyDown} ref={fillRefs} />))}
        </div>
      }
    </>
  )
}

export default EndScreen
