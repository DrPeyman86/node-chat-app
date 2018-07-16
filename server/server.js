const path = require('path')//pre-built in function with node js
const http = require('http')//pre-built in function with node js
const express = require('express');//set up http server
const socketIO = require('socket.io');//makes it easy to set up server that supports web sockets and to create a front end that communicates with the server socket/backend

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

    socket.on('disconnect', ()=> {
        console.log('User was disconnected');
    })
})

app.use(express.static(publicPath));//set a middleware for the app to use for your client side files. the app will initiate the
//client files everytime the server starts

//the app.listen literally calls http.createServer method
//app.listen(port, () => {
server.listen(port, ()=> {//replaces code abovel line since switched to socketIO and since server.listen calls the same function as app.listen
    console.log(`Server running on port ${port}`);
})