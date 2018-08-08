var socket = io();//the io() method gets available when we add the socket.io.js above.
//the socket stores the initialize request to the server from the client and to keep that connection open
//this will keep the connection open and allow us to send data back forth between the client and server

function scrollToBottom() {
    //selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        //console.log('should scroll');
        messages.scrollTop(scrollHeight);
    }
}

//create a  socket to send to client when we successfully connect to server
//exactly like the socket.io in the server side, expect the argument is different
socket.on('connect', function()  {
    var params = $.deparam(window.location.search);

    //create a join event listener to the server.js server so that when new 
    //user logs into a room, this will emit an event called join. which the 
    //server will be listening for. the callback is to kick the user back out
    //if the user did not provide a name or room number
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/'//this will send the user back up one page
        } else {
            console.log('no error');
        }
    })
    
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

socket.on('updateUserList', function(users) {
    //console.log('users list', users);
    var ol = $('<ol></ol>');

    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    })

    $('#users').html(ol);//wipe the list and create new list
})

//custom function. Custom function are anything that is not native to the socket.on argument list
//everytime the client hears something a newEmail event coming across the pipeline enter here
//the email is the object that is being returned from the socket.emit() in server side
socket.on('newEmail', function(email) {
    console.log('New Email', email);
})

socket.on('newMessage', function(message) {
    //console.log('New Message', message);
    /*set the template you want to render*/
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    //pass in the object using render and an object as its second argument.
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom()
    
    // var li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // $('#messages').append(li);

})

socket.on('newLocationMessage', function(message) {
    // var li = $('<li></li>');
    // var a = $('<a target="_blank">My Current Location</a>')
    var formattedTime = moment(message.createdAt).format('h:mm a');
    
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url)
    // li.append(a);

    // $('#messages').append(li);

    var template =$('#location-message-template').html()
    var html = Mustache.render(template, {
        url: message.url,
        createdAt: formattedTime,
        from: message.from
    })

    $('#messages').append(html);
    scrollToBottom()
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

    var messageTextbox = $('[name=message]')
    
    socket.emit('createMessage', {
        //from: 'User',//removed this so that we will send the users name from the server to the client
        text: messageTextbox.val()
    }, function() {
        //console.log('callback');
        messageTextbox.val('');
    })
})

var locationButton = $('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {//navigator.geolocation is a property that all browsers come with. if it doesn't exist, it will enter here
        return alert('Geolocation not supported by browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');

    //getCurrentPosition function of the navigator.geolocation method has 2 arguments. the success and error. First argument is success. second is error.
    navigator.geolocation.getCurrentPosition(function (position) {
        //console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        locationButton.removeAttr('disabled').text('Send Location');
    }, function() {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location');
    })
})