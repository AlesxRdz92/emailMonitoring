const fs = require('fs');
const conf = require('./conf');

var levels = {
    0: 'NOTSET',
    1: 'INFO',
    2: 'WARNING',
    3: 'ERROR',
    4: 'CRITICAL'
};

var log = (status = 0, head, info = '') => {
    fs.appendFile(`${conf.folder}\\log.log`, `${new Date} ${levels[status]} ${head} ${info}\n`, err => {
        console.log(err);
    });
}

module.exports = {
    log
}