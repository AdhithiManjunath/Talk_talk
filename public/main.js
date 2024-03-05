

const socket = io()

const ct = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-ip')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone = new Audio('/chat-tone.mp3')


messageForm.addEventListener('submit', (e)=>{
e.preventDefault();
sendMessage()}
)

function sendMessage(){
  // console.log(messageInput.value)
  if(messageInput.value === '')return
  // create a data json object that we need to send it to the server
  const data = {
    name:nameInput.value,
    message:messageInput.value,
    dateTime:new Date()

  }
  socket.emit('message',data)
  addMessageToUI(true,data)
  messageInput.value =''

}
// pop sound added here
socket.on('chat-message',(data)=>{
  // console.log(data)
  messageTone.play()
  addMessageToUI(false,data)
   
})

socket.on('clients-total',(data)=>{
  // console.log(data)
    ct.innerText= `Total clients: ${data}`
})
// ${moment(data.dateTime).fromNow()}
// bubble for my message 
function addMessageToUI(isOwnMessage,data){
  clearFeedback()
  const element = ` <li class="${isOwnMessage? "message-right": "message-left"}">
          <p class="message">
           ${data.message}
            <span>${data.name}● ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>
        `
messageContainer.innerHTML+=element; 
scrollToBottom();      
}
// need to scroll to bottom automatically
function scrollToBottom(){
  messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

// handling of feedback , to show who is typing and who is not 
messageInput.addEventListener('focus', (e)=>{
    socket.emit('feedback',{
      feedback:`${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('keypress', (e)=>{
  socket.emit('feedback',{
      feedback:`${nameInput.value} is typing a message`
    })
})
messageInput.addEventListener('blur', (e)=>{
  socket.emit('feedback',{
      feedback:``,
    })
})

socket.on('feedback',(data)=>{
  clearFeedback()
   const elem = `<li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li> `
    messageContainer.innerHTML+=elem
})

// to clear feedback messages 

function clearFeedback(){
  document.querySelectorAll('li.message-feedback').forEach(e=>{
    e.parentNode.removeChild(e)
  })
}