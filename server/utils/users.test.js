const expect = require('expect');
const {Users} = require('./users');



describe('Users class', () => {
    var users;
    //beforeEach will get called before the test is initliazed
    beforeEach(() => {
        //before each test case, run this so that we add some bogus users 
        //so that the assertions can do their testing
        users = new Users();
        users.users = [{
            id: 123,
            name: 'Peyman',
            room: 'Office Fans'
        },
        {
            id: 222,
            name: 'John',
            room: 'Office Fans'
        },
        {
            id: 223,
            name: 'Pooopii',
            room: 'react course'
        }]
    })

    it('should add new users', () => {
        var users = new Users();//
        var user = {
            id: '1234',
            name: 'Peyman',
            room: 'Office Fans'
        }
        var response = users.addUser(user.id,user.name,user.room);

        expect(users.users).toEqual([user]);
    })

    it('should return names for Office Fance', () => {
        var userList = users.getUserList('Office Fans');

        expect(userList).toEqual(['Peyman','John']);

    })

    it('should return names for react course', () => {
        var userList = users.getUserList('react course');

        expect(userList).toEqual(['Pooopii']);

    })

    //should remove a user. should take a id and remove it
    it('should remove a user with valid id', () => {
        var userId = 222;
        var userReturned = users.removeUser(userId)

        expect(userReturned.id).toBe(userId);
        expect(users.users.length).toBe(2);//to be 2 instead of 3, since 3 is starting point and we removed one so 2.
    })

    //it should not remove a user. pass in an id that was not part of the ids from the seeds
    it('should not remove a user with invalid id', () => {
        var userId = 99;
        var userReturned = users.removeUser(userId)

        expect(userReturned).toBeUndefined();
        expect(users.users.length).toBe(3);//to be 2 instead of 3, since 3 is starting point and we removed one so 2.
    })


    //it should find user with the id passed in
    it('should return a user with valid id', () => {
        var userId = 222;
        var userReturned = users.getUser(userId)

        expect(userReturned.id).toBe(userId);
    })

    //it should not find a user if you passs in invalid id
    it('should return a user with invalid id', () => {
        var userId = 12345678;
        var userReturned = users.getUser(userId)

        expect(userReturned).toBeUndefined();
    })
})