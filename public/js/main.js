const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users')

//Get username and room from URL
const {username, room } = Qs.parse(location.search, {   
  ignoreQueryPrefix: true
});

const socket = io();

//Join chatroom
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({room, users}) => {
  outPutRoomName(room);
  outPutUsers(users);
})

//Message from server
socket.on('message', message => {
  console.log(message);
  outPutMassage(message);

  //Scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
})

//Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;
  
  //Emit message to serve
  socket.emit('chatMessage', msg);

  //Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

//Output Message to DOM
function outPutMassage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.useName} <span>${message.time}</span> </p> 
    <p class="text">
      ${message.text}      
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
};

//Add room name to DOM
function outPutRoomName(room){
  roomName.innerText = room;
};

//Add users list to DOM
function outPutUsers(users){
  usersList.innerHTML = `${users.map(users => `<li>${users.username}</li>`).join('')}`;
};
