var socket = io();

socket.on('connect', () => {
    console.log('Index connected');

    socket.on('loadRooms', function(rooms) {
        console.dir(rooms)
        var rooms_select = $('#room-select')
        rooms.forEach(function(room) {
            rooms_select.append($('<option></option>').text(room.toUpperCase()).attr('value', `${room}`))
        });
    })


})