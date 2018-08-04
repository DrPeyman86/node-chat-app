const moment = require('moment');

var date = new Date();
var months = ['Jan','Feb']
console.log(date.getMonth());

var dateMoment = moment();//creates a new moment object of current time
dateMoment.add(1, 'year')
dateMoment.subtract(9, 'months')

console.log(dateMoment.format('MMM/DD/YYYY'));
console.log(dateMoment.format('MMM DD YYYY'));
console.log(dateMoment.format('MMM'));

console.log(dateMoment.format('MMM Do YYYY'))
console.log(dateMoment.format('MMM Do, YYYY'))//comma just gets passed through if you want to separate things out

console.log('time', dateMoment.format('hh:mm:SS A'))

var newdate = new Date().getTime()
console.log(newdate)
var someTimestamp = moment().valueOf();//this is same as new Date().getTime() but using moment js library
console.log('valueof',someTimestamp);

var createdAt = 12345
var dateCreatedFrom = moment(createdAt)//when a value is passeed through in moment, it will use that as the time it users, otherwise it would use current time
console.log(dateCreatedFrom.format('hh:mm:ss A'))