import React, { useEffect, useRef, useState } from 'react'
import HighscoreList from './HighscoreList'

const EndScreen = ({ startGame, highscore, score, postHighscore, deleteHighscore }) => {
  const [state, setState] = useState(0)
  const [nameInput, setNameInput] = useState('')
  const [postedHighscoreId, setPostedHighscoreId] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const inputRefs = useRef([])

  const handleInputChange = (e, i) => {
    setNameInput(prev => (prev.substring(0, i) + e.target.value).toUpperCase())
  }

  const handleInputClick = (e) => {
    if (nameInput.length < inputRefs.current.length) return inputRefs.current[nameInput.length].focus()
    inputRefs.current[5].focus()
  }

  const handleGameOverClick = () => {
    if (score > highscore[highscore.length - 1].score) return setState(2)
    return setState(1)
  }

  const handleKeyDown = (e) => {
    if (["Backspace", "Delete"].includes(e.key)) return setNameInput(prev => prev.slice(0, -1))
    if (e.key === 'Enter') handleSubmit(e)
  }

  const handleSubmit = async (e) => {
    e.stopPropagation()
    if (isLoading) return
    setIsLoading(true)
    if (highscore.length >= 10) await deleteHighscore(highscore[highscore.length - 1].id)
    const postId = await postHighscore({ name: nameInput, score: score })
    setPostedHighscoreId(postId)
    setState(1)
    setIsLoading(false)
  }

  const fillRefs = (el) => {
    if (el && !inputRefs.current.includes(el)) inputRefs.current.push(el)
  }

  useEffect(() => {
    if (nameInput.length < inputRefs.current.length) inputRefs.current[nameInput.length].focus()
  }, [nameInput, state])

  return (
    <>
      {state === 0 &&
        <div className="gameOver" onClick={handleGameOverClick}>
          <p className='textLarge gameOverText'>Game Over</p>
          <p className='textMedium'>- Click to continue -</p>
        </div>
      }
      {state === 1 &&
        <HighscoreList highscore={highscore} startGame={startGame} postedHighscoreId={postedHighscoreId} />
      }
      {state === 2 &&
        <div className='nameInputWrapper' onClick={handleInputClick}>
          <p className='textLarge'>New Highscore!</p>
          <p className='textLarge'>{score}</p>
          {[...Array(6)].map((item, i) => (<input type="text" key={i} value={nameInput[i] ?? ''} onChange={(e) => handleInputChange(e, i)} onKeyDown={handleKeyDown} ref={fillRefs} />))}
          <p className='submitButton'><span onClick={handleSubmit}>- Submit -</span></p>
        </div>
      }
    </>
  )
}

export default EndScreen
