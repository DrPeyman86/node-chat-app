[{
    id: '/#12312asdf',
    name: 'Peyman',
    room: 'The office room'
}]

//4 methods needed to add a user to a particular room,
//send message only to the people inside of a room,
//remove user when they logout and remove them from client display
//and get whoever is in that room to only emit to them only
//addUser(id, name, room)
//removeUser(id) remove user by socket.id
//getUser(id)//return the object above
//getUserList(room name)//will figure out which names are inside that room and return to the client


//the below is essentially what we are going to do for adduser
// var users = [];
// var addUser = (id, name, room) => {
//     users.push();
// }
// module.exports = {addUser}
//but we will use new ES6 classes 
//ES6 classes 

class Users {
    constructor () {
        //every time a new Users class is initialized, start with empty array
        this.users = [];//set users property to empty array
    }
    //need 3 pieces of info to add user to correct room
    addUser(id, name, room) {
        var user = {id, name, room};//ES6 format - create an object for each user being initialized
        this.users.push(user);//push to the array defined in constructor
        return user;//return the user
    }

    removeUser(id) {
        //var userRemove = this.users.filter((user)=> user.id === id)[0]//this is the same return as the getUser() method)
        //or you could do this instead
        var userRemover = this.getUser(id);

        if(userRemover) {
            this.users = this.users.filter((user)=> user.id !== id)//this will create new users of users that their ids are not euqal to what was passed in
        }

        return userRemover;//return the user even if it was undefined
        
        //return the user that was removed
    }

    getUser(id) {
        //find a user by id
        // var userInSearch = this.users.filter((user) => {
        //     return user.id === id;
        // })
        // var namesArray = userInSearch.map((user) => {
        //     return user.name;//we only want to return the names of people that are in the room
        // }) 

        // return namesArray;
        var userInSearch = this.users.filter((user)=> {
            return user.id === id//return the user that matches the id passed to this mehod
        })
        return userInSearch[0]//should only return one user, but in case always return first one in array
    }
    //get the users that are in particular room
    getUserList(roomName) {
        //return an array that will include the names of people that are in room
        var usersInRoom = this.users.filter((user)=> {
            //user is all the people that are currently in that this.users array above
            //now return true or falls whether every one of those users in this.users array have a 
            //room matching to the argument to this function
            return user.room === roomName//will return true or false if the roomName providd in arguments equals to room name in the users array
            //if false the user will not be added to the list above
        })
        //next step is to convert the array of objects and convert it to an 
        //array of strings 
        var namesArray = usersInRoom.map((user) => {
            return user.name;//we only want to return the names of people that are in the room
        }) 

        return namesArray//return the array that are in that particular room
    }
}

module.exports = {Users};

// class Person {
// //a class has a special constructor function specific to the class that fires automatically
// //and lets you initialize the instance of your class
//     constructor (name, age) {
//         //this is the constructor function that gets called by default. it gets called by the arguments that were the instance is being called
//         //console.log(name,age)
//         //we want to set the name and age property of the instnace of this person, not all persons
//         //this refers to the instance as opposted to the class
//         this.name = name;//this.name refers to the instance of Person where it was initialized 
//         this.age = age;

//     }
//     //add methods to this class so that they can be called directly
//     getUserDescription () {
//         return `${this.name} is ${this.age} year(s) old`
//     }
// }

// var me = new Person('Peyman',32);//have a new instance of that class
// //console.log('this.name', me.name)
// //console.log('this.age', me.age)

// var description = me.getUserDescription();
// console.log(description);