//generateMessage is a function that will return an object just like the 
//objects we pass in to the second argument of our .emit() functions in server.js

var generateMessage = (from, text) => {
    //return an object
    return {
        from,
        text,
        createdAt: new Date().getTime()
    }
};

var generateLocationMessage = (from, latitude, longitude)=> {
    return {
        from: from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {generateMessage, generateLocationMessage};