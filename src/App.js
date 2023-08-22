import './App.css';
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
const socket = io.connect("http://localhost:3001")
function App() {
  const [message, setMessage] = useState("")
  const [messageReceived, setMessageReceived] = useState('')
  const [room, setRoom] = useState("")
  const [board, setBoard] = useState(['b','b','b','b','b','b','b','b','b'])
  const [turn, setTurn] = useState(null)

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room)
    }
  }

  const sendMessage = () => {
    socket.emit("send_message", { message, room })
  }

  const sendBoard = () => {
    let lockedBoard = board.map(elem => {
      if (elem === 'x') {
        return 'X'
      } else if(elem === 'o') {
        return 'O'
      } else {
        return elem
      }
    })
    let newTurn = true
    if (turn !== null) {
      newTurn = !turn
    }
    setTurn(newTurn)
    setBoard(lockedBoard)
    socket.emit("send_board", {lockedBoard, newTurn, room})
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message)
      console.log(data.message)
    }, [socket])
    socket.on("receive_board", (data) => {
      setBoard(data.lockedBoard)
      setTurn(data.newTurn)
    }, [socket])
  })
  
  

  useEffect(() =>{
    board.forEach((elem, idx) => {
      let square = document.getElementsByClassName(idx.toString())
      square[0].setAttribute('id', elem)
    })
  }, [board])

  const highlight = (a) => {
    if (a.id === 'b') {
      let newArr = board.map((elem, idx) => 
        (parseInt(a.className) === idx) ? 'x': elem
      )
      setBoard(newArr)
    } else if (a.id === 'x' || a.id === 'y') {
      let newArr = board.map((elem, idx) => 
        (parseInt(a.className) === idx) ? 'b': elem
      )
      setBoard(newArr)
    }
  }
  return (
    <div className="App">
      <input type="select" placeholder='Room #' onChange={(event) => {
        setRoom(event.target.value)
      }} />
      <button onClick={joinRoom} style={{backgroundColor: messageReceived}}>Join Room</button>
      <input type="color" placeholder='Message...' onChange={(event) => {
        setMessage(event.target.value)}}/>
      <button onClick={sendMessage}>Send Message</button>
      <h1>Message</h1>
      {turn == null &&
        <div>First to go gets to be X</div>
      }
      {messageReceived}
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
    </div>
  );
}

export default App;

