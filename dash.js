//Testing purposes, this method will connect to Dash
const logging = require('./logging');
var sendReq = (flag) => {
    if(flag)
        logging.log(1, 'An incident is needed');
    else
        logging.log(1, 'Everything was fine');
}

module.exports = {
    sendReq
};