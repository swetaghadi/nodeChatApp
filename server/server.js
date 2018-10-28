// including built-inp path module. 
// REF: nodejs.org -> Docs -> Latest Version API -> scroll down and click on Path
const path = require('path'); 

//including built-in http module which express is using to create the server
const http = require('http');

//include express in project root
const express = require('express');

//include socket.io library which enables realtime, bi-directional communication between web clients and servers.
const socketIO = require('socket.io');

//Integrating utility functions into the application
const {generateMessage, generateLocationMessage} = require('./utils/message');

// call validation script
const {isRealString} = require('./utils/validation');

const {Users} = require('./utils/users');	//Adding jQuery to update the DOM

//using in-built path.join() method to clean up our path
const publicPath = path.join(__dirname, '../public');

//configure dynamic server or localhost port
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);		//Configuring the server to use Socket.io to accept (incoming) WebSocket connections
var users = new Users();

app.use(express.static(publicPath));

//Communication between the client and server is entirely run on the events.
io.on('connection', (socket) => {		// => is the Ecma Script = works like return("...")
  console.log('New user connected');

  socket.on('join', (params, callback) => {		//create an event listener
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);	
    users.removeUser(socket.id);	
    users.addUser(socket.id, params.name, params.room);	//Adding user with unique ID to the user's list

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));	//Emitting the event to the clients

	//The emit() method is really similar to the listeners; although, instead of listening to an event, we are creating the event
	//Socket.emit emits an event to a single connection, whereas io.emit emits an event to every single connection.
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
	
	//broadcast to just users inside the room that we just joined
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));  
    }
  });

  socket.on('disconnect', function () {
    var user = users.removeUser(socket.id);	//Removing users when they leave the chatroom

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));	// Updating the users list when someone left the chatroom
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));	//Emitting custom message
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
