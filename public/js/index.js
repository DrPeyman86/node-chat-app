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
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $('#messages').append(li);

})

socket.on('newLocationMessage', function(message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My Current Location</a>')
    li.text(`${message.from}: `);
    a.attr('href', message.url)
    li.append(a);

    $('#messages').append(li);
})

// socket.emit('createMessage', {
//     from: 'Peyman',
//     text: 'Hi Peyman'
// }, function(data){//the third argument in the emit() is the callback. So after the server has done something to the data we send, the callback gets called
//     //if your callback function from server had something in it, give it name above
//     console.log('Got it:', data);
// })

$('#message-form').on('submit', function (e) {
    e.preventDefault();//prevents the default of the event. so if submit button refreshes a page, the preventDefault prevents the page from refreshing. 

    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    }, function() {
        console.log('callback');
    })
})

var locationButton = $('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {//navigator.geolocation is a property that all browsers come with. if it doesn't exist, it will enter here
        return alert('Geolocation not supported by browser');
    }

    //getCurrentPosition function of the navigator.geolocation method has 2 arguments. the success and error. First argument is success. second is error.
    navigator.geolocation.getCurrentPosition(function (position) {
        //console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        alert('Unable to fetch location');
    })
})