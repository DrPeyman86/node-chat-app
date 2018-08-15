class Rooms  {
    constructor () {
        this.rooms = []
    }

    addRooms(name) {
        this.rooms.push(name);
    }

    removeRooms(name) {
        this.rooms = this.rooms.filter((room) => room != name);
    }

    loadRooms() {
        return this.rooms;
    }

}

module.exports = {Rooms};