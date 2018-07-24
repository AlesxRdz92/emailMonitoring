//Testing purposes, this method will connect to Dash
var sendReq = (flag) => {
    if(flag)
        console.log('An incident is needed');
    else
        console.log('An incident is not needed');
}

module.exports = {
    sendReq
};