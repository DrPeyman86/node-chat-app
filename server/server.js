const path = require('path')//pre-built in function with node js
const http = require('http')//pre-built in function with node js
const express = require('express');//set up http server
const socketIO = require('socket.io');//makes it easy to set up server that supports web sockets and to create a front end that communicates with the server socket/backend


const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Rooms} = require('./utils/rooms');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

//things to do to expand the app
//1.make the room name ignore case so that lowercase and uppercase having same room will still be in same room
//2.make the user names unique so that two people can't have the same name
//3.have a dropdown in the main menu join a chat room page so that you can join an active room - that's hardest of the 2 above




var app = express()
//var server = http.createServer((req,res) => {

//})//create the server. you can just replace the function with the name of you app, this case "app" because express and socketIO are so integreated together that there are many shortcuts
//replaces code above for short
var server = http.createServer(app);
var io = socketIO(server);//configure the server to use socketIO. pass in the server we want to use.  
//this returns the web socket server that we can emit or listening to events in client side
var users = new Users();//instantiate the Users class
var rooms = new Rooms();

app.use(express.static(publicPath));//set a middleware for the app to use for your client side files. the app will initiate the
//client files everytime the server starts


//console.log(__dirname + '/../public')
//console.log(path.join(__dirname,'../public'));

//the io.on() with 'connection' argument listens to anytime there is a new connection made 
//to the URL or PORT in this case. Once triggered, it will call the callback and you can do certain things
//the socket argument represents the individual sockets connecting to the app
io.on('connection', (socket) => {
    //the reason why we get this without the client actually hitting the page is because when a connection
    //drops the client is still goint to try to reconnect. When we try to restart the server, there is about a quarter 
    //of a second of time where the server is down and the client notices that the server went down and tries to reconnect
    //as soon as it reconnects, it hits the io.on() method, and that's when you see the New user Connected
    console.log('New User connected');
    //
    //emit creates and event rather than listening
    //the name of the emit event has to be exactly what it is in client side
    //that the client is listening to
    //most commonly you will be sending an object across the pipeline
    // socket.emit('newEmail', {
    //     from: "peymanc123@gmail.com",
    //     text: "hey whats up",
    //     createdAt: "7/16/2018"
    // })
    socket.emit('loadRooms', rooms.loadRooms());

    //console.log('usersroom:',users.returnUniqueRooms());


    //socket.on is opposite to emit where .on is now listening to the client for a request called createEmail
    socket.on('createEmail', (newEmail) => {
        console.log('createEmail', newEmail);
    })

    
    socket.on('join', (params, callback) => {
        var room_input = params.room.toUpperCase()
        var room_select = params.room_select.toUpperCase();

        var room = room_input || room_select;
        console.log('room joined:',room);
        //console.log('id:',socket.id);
        if (!isRealString(params.name) || !isRealString(room)) {
            return callback('Name and room name are required');//use return so that none of the code below this fires if there is validation error
        }

        if(isRealString(room_select) && isRealString(room_input)) {
			return callback('Either select a room or create one');
		}

        let roomCheck = () => {
            if(!rooms.loadRooms().includes(room)) {
                rooms.addRooms(room);
            }
            console.log('rooms:', rooms.loadRooms());
        }
    

        let joinRooms = () => {

            //only want to emit messages that are only in the same room as you
            socket.join(room)//special place to talk to whoever is in the same exact room
            //socket.leave('The name of the room')//will kick you out of the room you are in
            users.removeUser(socket.id)//remove the socket.id that belongs to a particular user so that they are not in more than one room at a time
            users.addUser(socket.id, params.name, room);//add the user to the name using the Users class
            
            roomCheck();
            
            io.to(room).emit('updateUserList', users.getUserList(room));
            
            //io.emit - will emit to everyone 
            //io.to('The office fans').emit will send an emit event to whoever that is in that room
            //socket.broadcast.emit will send message to everyone except for the current person sending message
            //socket.broadcast.to('The office fans').emit - will send emit to all who is in the office fans room except current user
            //socket.emit - will send only to a specific user
        
            //socket.emit emits the message to a single particular connection
            // socket.emit('newMessage', {
            //     from: "peyman",
            //     to: "john",
            //     createdAt: "7/16/2018"
            // })

            //when a new user joins, create a welcome message to them
            // socket.emit('newMessage', {
            //     from: "Admin",
            //     text: "Welcome Peyman",
            //     createdAt: new Date().getTime()
            // })
            //replaces lines above where we instead use a function to return our data
            //moved the following socket.emit and socket.broadcast.emit inside the .join event listener 
            //because we only want to emit these messages once the user has been veirifed to join a particular chat group

            socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat app ${params.name}`))

            //send a message to all users logged on that there is a new user 
            // socket.broadcast.emit('newMessage', {
            //     from: "Admin",
            //     text: "New User Peyman Joined",
            //     createdAt: new Date().getTime()
            // })
            //replaces lines above where we instead use a function to return our data
            //instead of socket.broadcast.emit() we add a .to() param to only emit a broadcast to those that are
            //in that group the user justed joined into
            socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        
            
        }

        

        //if(users.checkUniqueName(params.name)) {
        if(users.getUserList(room).includes(params.name)) {
            roomCheck();
            return callback('Someone else has already the same name as you, select a different name');
        } else {
            joinRooms();
        }

        callback();//send back to callback with no errors
 
        
    })
    
    
    socket.on('createMessage', (message, callback)=> {//if the client side has a callback function ready, then you need callback here and call it below
        //console.log("createMessage", message);
        //io.emit emits what you do to every single user that is connected.
        //so if you want to send the same message to every open tab, use io.emit
        // io.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
        var user = users.getUser(socket.id);
        //socket.broadcast.emit is same syntax as .emit() except broadcast
        //will only send to every other user logged on other than the person
        //who trigged this event in their client web page
        
        //want to verify user does exist and make sure text is real string and not just blank spaces
        if(user && isRealString(message.text)) {

            //only emit .to() users that are in the same room as the user that is sending
            io.to(user.room).emit('newMessage', {
                from: user.name,
                text: message.text,
                createdAt: new Date().getTime()
            })

        }
        
        
        callback('This is from the server callback');//call the callback() so that the client callback will be called once this is done in server
        //callback({data: 'Data got back',when: new Date().getTime()})
    })

    socket.on('createLocationMessage',(coords)=> {
        var user = users.getUser(socket.id);//get the user id that is making the request
        
        if (user) {
            //use .to() to only send to room that the user that is logged into.
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
    })


    //when the user disconnects, listen to that event and do something in callback
    socket.on('disconnect', ()=> {
        console.log('User was disconnected');
        var user = users.removeUser(socket.id);//store potential removed users, this will return removed users

        //if a user was removed and emit the message to every person in the chat room
        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left chat room` ))
        }
    })
})//io.on end


//the app.listen literally calls http.createServer method
//app.listen(port, () => {
server.listen(port, ()=> {//replaces code abovel line since switched to socketIO and since server.listen calls the same function as app.listen
    console.log(`Server running on port ${port}`);
})