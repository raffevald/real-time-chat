const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Fastchat bot';

//Run when client connetcs
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room } ) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    
    console.log(username, room);

    //Welcome current user
    socket.emit('message', formatMessage(botName, 'Bem vindo ao chat -_-.'));

    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} junto-se ao chat.`));

    //Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  });

  //Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //Run when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if(user){
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} deixo o chat.`));

    //Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
    }
  });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
