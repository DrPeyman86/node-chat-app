var socket = io();//the io() method gets available when we add the socket.io.js above.
//the socket stores the initialize request to the server from the client and to keep that connection open
//this will keep the connection open and allow us to send data back forth between the client and server

//create a  socket to send to client when we successfully connect to server
//exactly like the socket.io in the server side, expect the argument is different
socket.on('connect', function()  {
    console.log('connected to server');

    // socket.emit('createEmail', {
    //     to: "sepide.c@gmail.com",
    //     text: "hey this is peyman",
    //     createdAt: "6/16/2018"
    // })

    // socket.emit('createMessage', {
    //     from: "john",
    //     text: "peyman!",
    //     createdAt: "6/16/2018"
    // })
})

socket.on('disconnect', function() {
    console.log('Disconnected from server');
})
//custom function. Custom function are anything that is not native to the socket.on argument list
//everytime the client hears something a newEmail event coming across the pipeline enter here
//the email is the object that is being returned from the socket.emit() in server side
socket.on('newEmail', function(email) {
    console.log('New Email', email);
})

socket.on('newMessage', function(message) {
    console.log('New Message', message);
})