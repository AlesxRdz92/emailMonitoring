const encryption = require('./encryption');

module.exports = {
    userName: `LUV\\lmssupport`,
    password: (() => {
        return encryption.decrypt(process.env.PASS);
    })(),
    url: 'https://www4-pdc.swalife.com/Ews/Exchange.asmx',
    programData: process.env.ProgramData
}