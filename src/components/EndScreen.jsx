import React, { useEffect, useRef, useState } from 'react'

const EndScreen = ({ startGame, highscore, score, postHighscore, deleteHighscore }) => {
  const [state, setState] = useState(2)
  const [nameInput, setNameInput] = useState('')
  const [postedHighscoreId, setPostedHighscoreId] = useState(null)
  const inputRefs = useRef([])

  const handleInputChange = (e, i) => {
    console.log("nameInput[i]", nameInput[i])
    setNameInput(prev => (prev.substring(0, i) + e.target.value).toUpperCase())
  }

  const handleClick = (e) => {
    console.log(inputRefs.current)
    if (nameInput.length < inputRefs.current.length) return inputRefs.current[nameInput.length].focus()
    inputRefs.current[5].focus()
  }

  const handleKeyDown = (e) => {
    console.log(`e`, e)
    if (["Backspace", "Delete"].includes(e.key)) return setNameInput(prev => prev.slice(0, -1))
    if (e.key === 'Enter') handleSubmit(e)
  }

  const handleSubmit = async (e) => {
    e.stopPropagation()
    const postId = await postHighscore({ name: nameInput, score: score })
    console.log(`postId from end screen`, postId)
    setPostedHighscoreId(postId)
    setState(1)
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
        <div className="gameOver" onClick={() => setState(2)}>
          <p className='textLarge'>Game Over</p>
          <p>- Click to continue -</p>
        </div>
      }
      {state === 1 &&
        <div className='highscore' onClick={startGame}>
          <p className='textLarge'>Highscore</p>
          {highscore &&
            <div className='highscoreList'>
              {highscore.map((item, i) => (<p className={`highscoreItem ${item.id === postedHighscoreId && 'flashingYellow'}`} style={{ '--DELAY': `${i / 10}s` }} key={item.id}>{item.name}<span>{fillDots(item)}</span>{item.score}</p>))}
            </div>
          }
          <p className='restartText'>- Click to restart -</p>
        </div>
      }
      {state === 2 &&
        <div className='nameInputWrapper' onClick={handleClick}>
          <p className='textLarge'>New Highscore!</p>
          <p className='textLarge'>{score}</p>
          {[...Array(6)].map((item, i) => (<input type="text" key={i} className={``} value={nameInput[i] ?? ''} onChange={(e) => handleInputChange(e, i)} onKeyDown={handleKeyDown} ref={fillRefs} />))}
          <p className='submitButton'><span onClick={handleSubmit}>- Submit -</span></p>
        </div>
      }
    </>
  )
}

export default EndScreen
