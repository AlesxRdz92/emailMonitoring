const encryption = require('./encryption');
const expect = require('expect');
var value;

it('Should return an string', () => {
    value = encryption.encrypt("Alejandro")
    expect(value).toBeDefined;
});

it('Should return Alejandro', () => {
    let res = encryption.decrypt(value);
    expect(res).toBe('Alejandro');
});