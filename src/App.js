import './App.css';
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { ReactDOM } from 'react';
const socket = io.connect("http://localhost:3001")
function App() {
  const [message, setMessage] = useState("")
  const [messageReceived, setMessageReceived] = useState('')
  const [room, setRoom] = useState("")
  const [board, setBoard] = useState(['b','b','b','b','b','b','b','b','b'])

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room)
    }
  }

  const sendMessage = () => {
    socket.emit("send_message", { message, room })
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message)
    }, [socket])
  })

  useEffect(() =>{
    console.log(board)
    board.forEach((elem, idx) => {
      let square = document.getElementsByClassName(idx.toString())
      square[0].setAttribute('id', elem)
      console.log(square)
    })
  }, [board])

  const highlight = (a) => {
    if (a.id === 'x') {
      let newArr = board.map((elem, idx) => 
        (parseInt(a.className) === idx) ? 'b': elem
      )
      setBoard(newArr)
    } else {
      let newArr = board.map((elem, idx) => 
        (parseInt(a.className) === idx) ? 'x': elem
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
      <button>Send Move</button>
    </div>
  );
}

export default App;

