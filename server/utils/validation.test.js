const expect = require('expect');
const {isRealString} = require('./validation');

//import isRealString

//isRealString
//should reject non-string values
//should reject string with only spaces
//should allow strings with non space characters

describe('isRealString', () => {
    it('should reject non-string values', ()=> {
        //var name = 'Pemol',
        //room = '  ',

        //var url = `http://localhost:3000/chat.html?name=${name}&room=${room}`
        var res = isRealString(98)
        expect(res).toBe(false)
    })

    it('should reject string with only spaces', ()=> {
        var res = isRealString('   ');
        expect(res).toBe(false);
    })

    it('should allow strings with non space characters', ()=> {
        var res = isRealString('de');
        expect(res).toBe(true);
    })
})

