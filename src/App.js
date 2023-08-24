import './App.css';
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
const socket = io.connect("http://localhost:3001")
function App() {
  const winArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const [message, setMessage] = useState("")
  const [messageReceived, setMessageReceived] = useState('')
  const [room, setRoom] = useState("")
  const [board, setBoard] = useState(['b','b','b','b','b','b','b','b','b'])
  const [turn, setTurn] = useState(null)
  const [myTurn, setMyTurn] = useState(true)
  const [win, setWin] = useState(false)
  const [messageBoard, setMessageBoard] = useState([2])

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room)
    }
  }

  const sendMessage = () => {
    socket.emit("send_message", { message, room })
  }

  const sendBoard = () => {
    if (myTurn === true && room !== '') {
      let theirTurn = false
      let lockedBoard = board.map(elem => {
        if (elem === 'x') {
          setMyTurn(false)
          theirTurn = true
          return 'X'
        } else if(elem === 'o') {
          setMyTurn(false)
          theirTurn = true
          return 'O'
        } else {
          return elem
        }
      })
      console.log(lockedBoard)
      let passWin = false
      winArray.forEach(elem => {
        console.log(elem[0])
        console.log(lockedBoard[elem[0]])
        if (lockedBoard[elem[0]]===lockedBoard[elem[1]] 
          && lockedBoard[elem[2]]===lockedBoard[elem[0]] 
          && lockedBoard[elem[0]] !== 'b') {
            passWin = true
          }
      })
      let newTurn = true
      if (turn !== null) {
        newTurn = !turn
      }
      setTurn(newTurn)
      setBoard(lockedBoard)
      setWin(passWin)
      console.log(passWin)
      socket.emit("send_board", {lockedBoard, newTurn, theirTurn, passWin, room})
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message)
      console.log(data.message)
    }, [socket])
    socket.on("receive_board", (data) => {
      setBoard(data.lockedBoard)
      setTurn(data.newTurn)
      setMyTurn(data.theirTurn)
      setWin(data.passWin)
    }, [socket])
    socket.on("new_game", (data) => {
      setBoard(data.newBoard)
      setTurn(data.newTurn)
      setMyTurn(data.newMyTurn)
      setWin(data.newWin)
    }, [socket])
  })
  
  

  useEffect(() =>{
    board.forEach((elem, idx) => {
      let square = document.getElementsByClassName(idx.toString())
      square[0].setAttribute('id', elem)
    })
  }, [board])

  const highlight = (a) => {
    if(myTurn) {
      if (a.id === 'b' && !turn) {
        let newArr = board.map((elem, idx) => {
          if (parseInt(a.className) === idx) {
            return 'x'
          } else if (elem === 'x') {
            return 'b'
          } else {
            return elem
          }
        }
        )
        setBoard(newArr)
      } else if (a.id === 'b' && turn) {
        let newArr = board.map((elem, idx) => {
          if (parseInt(a.className) === idx) {
            return 'o'
          } else if (elem === 'o') {
            return 'b'
          } else {
            return elem
          }
        }
        )
        setBoard(newArr)
      } else if (a.id === 'x' || a.id === 'o') {
        let newArr = board.map((elem, idx) => 
          (parseInt(a.className) === idx) ? 'b': elem
        )
        setBoard(newArr)
      }
    }
  }
  const newGameState = () => {
    setWin(false)
    setTurn(null)
    setMyTurn(true)
    setBoard(['b','b','b','b','b','b','b','b','b'])
  }
  const newGame = () => {
    newGameState()
    let newWin = false
    let newTurn = null
    let newMyTurn = true
    let newBoard = ['b','b','b','b','b','b','b','b','b']
    socket.emit("new_game", {newWin, newTurn, newMyTurn, newBoard, room})
  }

  console.log(messageBoard)
  return (
    <div className="App">
      <input type="select" placeholder='Room #' onChange={(event) => {
        setRoom(event.target.value)
      }} />
      <button onClick={joinRoom}>Join Room</button>
      <br/>
      <input type="text" placeholder='Message...' onChange={(event) => {
        setMessage(event.target.value)}}/>
      <button onClick={sendMessage}>Send Message</button>
      <h1>Message</h1>
      {turn == null &&
        <div>First to go gets to be X</div>
      }
      {win &&
        <div>
          <h1>VICTORY</h1>
          <button onClick={newGame}>New Game</button>
        </div>
      }
      <div className="board">
        <div className="0" onClick={(event) => {highlight(event.target)}}></div>
        <div className="1" onClick={(event) => {highlight(event.target)}}></div>
        <div className="2" onClick={(event) => {highlight(event.target)}}></div>
        <div className="3" onClick={(event) => {highlight(event.target)}}></div>
        <div className="4" onClick={(event) => {highlight(event.target)}}></div>
        <div className="5" onClick={(event) => {highlight(event.target)}}></div>
        <div className="6" onClick={(event) => {highlight(event.target)}}></div>
        <div className="7" onClick={(event) => {highlight(event.target)}}></div>
        <div className="8" onClick={(event) => {highlight(event.target)}}></div>
      </div>
      <button onClick={sendBoard}>Send Move</button>
      <div>{turn}</div>
      {messageReceived}
      {messageBoard &&
      messageBoard.map(function(elem) {
      return (
        <div>
          {elem}
        </div>
        )
      })}
    </div>
  );
}

export default App;

