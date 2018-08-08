//we want to validate the user name and room number so that they are not entering just blank spaces
var isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
}


module.exports = {isRealString};