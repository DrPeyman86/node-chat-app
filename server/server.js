const path = require('path')//pre-built in function with node js
const http = require('http')//pre-built in function with node js
const express = require('express');//set up http server
const socketIO = require('socket.io');//makes it easy to set up server that supports web sockets and to create a front end that communicates with the server socket/backend

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express()
//var server = http.createServer((req,res) => {

//})//create the server. you can just replace the function with the name of you app, this case "app" because express and socketIO are so integreated together that there are many shortcuts
//replaces code above for short
var server = http.createServer(app);
var io = socketIO(server);//configure the server to use socketIO. pass in the server we want to use.  
//this returns the web socket server that we can emit or listening to events in client side

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


    //socket.on is opposite to emit where .on is now listening to the client for a request called createEmail
    socket.on('createEmail', (newEmail) => {
        console.log('createEmail', newEmail);
    })

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
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app Peyman'))

    //send a message to all users logged on that there is a new user 
    // socket.broadcast.emit('newMessage', {
    //     from: "Admin",
    //     text: "New User Peyman Joined",
    //     createdAt: new Date().getTime()
    // })
    //replaces lines above where we instead use a function to return our data
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message, callback)=> {//if the client side has a callback function ready, then you need callback here and call it below
        console.log("createMessage", message);
        //io.emit emits what you do to every single user that is connected.
        //so if you want to send the same message to every open tab, use io.emit
        // io.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })

        //socket.broadcast.emit is same syntax as .emit() except broadcast
        //will only send to every other user logged on other than the person
        //who trigged this event in their client web page
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
        callback('This is from the callback');//call the callback() so that the client callback will be called once this is done in server
        //callback({data: 'Data got back',when: new Date().getTime()})
    })


    //when the user disconnects, listen to that event and do something in callback
    socket.on('disconnect', ()=> {
        console.log('User was disconnected');
    })
})//io.on end

app.use(express.static(publicPath));//set a middleware for the app to use for your client side files. the app will initiate the
//client files everytime the server starts

//the app.listen literally calls http.createServer method
//app.listen(port, () => {
server.listen(port, ()=> {//replaces code abovel line since switched to socketIO and since server.listen calls the same function as app.listen
    console.log(`Server running on port ${port}`);
})