// this represents the server side

const express = require("express")
const app = express()
const path = require('path')
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, ()=> console.log(`chat server on port ${PORT}`))


const io = require('socket.io')(server)


// public folder as static directory 
app.use(express.static(path.join(__dirname,'public')))

let clientsConnected = new Set()


io.on('connection', onConnection)

function onConnection(socket){
   console.log(socket.id)
   clientsConnected.add(socket.id)

   io.emit('clients-total',clientsConnected.size)

   socket.on('disconnect',()=>{
    console.log("socket disconnected",socket.id)
    clientsConnected.delete(socket.id)
     io.emit('clients-total',clientsConnected.size)
   })

   socket.on('message',(data)=>{
    // to send it to everyone except the sender itself
      // console.log(data)
      socket.broadcast.emit('chat-message',data)
     
   })

   socket.on('feedback',(data)=>{
    socket.broadcast.emit('feedback',data)
   })
}

