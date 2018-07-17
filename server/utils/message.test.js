var expect = require('expect');

var {generateMessage} = require('./message');


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