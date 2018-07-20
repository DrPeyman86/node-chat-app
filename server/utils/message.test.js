var expect = require('expect');

var {generateMessage} = require('./message');
var {generateLocationMessage} = require('./message');

describe('generageMessage', () => {
    it('should generage the correct message object', ()=> {
        var from = 'Pemol',
        text = 'From pemol test',
        message = generateMessage(from, text);//store the response that comes back from the generateMessage function()

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from: from,
            text: text
        })
    })
})

describe('generate Location Message', () => {
    it('should should generate correct location object', ()=> {
        var from = 'Pemol',
        latitude = 15,
        longitude = 19
        var url = 'https://www.google.com/maps?q=15,19'
        
        var message = generateLocationMessage(from, latitude, longitude);//store the response that comes back from the generateMessage function()

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from: from,
            url: url
        })
    })
})