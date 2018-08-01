const encryption = require('./encryption');

module.exports = {
    userName: `${process.env.USERDOMAIN}\\${encryption.decrypt(process.env.LMS_USER)}`,
    password: (() => {
        return encryption.decrypt(process.env.PASS);
    })(),
    url: 'https://www4-pdc.swalife.com/Ews/Exchange.asmx',
    folder: `${process.env.ProgramData}\\LMSMonitoring`,
    sub: 'PROD Data Import Completed'
};