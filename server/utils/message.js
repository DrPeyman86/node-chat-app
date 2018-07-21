//generateMessage is a function that will return an object just like the 
//objects we pass in to the second argument of our .emit() functions in server.js
var moment = require('moment');


var generateMessage = (from, text) => {
    //return an object
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
};

var generateLocationMessage = (from, latitude, longitude)=> {
    return {
        from: from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
}

module.exports = {generateMessage, generateLocationMessage};