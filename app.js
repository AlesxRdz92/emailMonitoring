const ews = require('ews-javascript-api');
const conf = require('./conf');
const schedule = require('node-schedule');
const logging = require('./logging');
const fs = require('fs-extra');
var uniqueId = '';
const dash = require('./dash');
var files;
const extract = require('extract-zip');
var flag = false;
const exch = new ews.ExchangeService(ews.ExchangeVersion.Exchange2010_SP2);
exch.Credentials = new ews.ExchangeCredentials(conf.userName, conf.password);
exch.Url = new ews.Uri(conf.url);
//var mailbox = new ews.Mailbox('alejandro.gongora@wnco.com'); //It was possible to access to the shared mailbox provided by Omar
//let folderId = new ews.FolderId(ews.WellKnownFolderName.Inbox);
//console.log(folderId);
exch.SubscribeToStreamingNotifications([new ews.FolderId(ews.WellKnownFolderName.Inbox)], ews.EventType.NewMail, ews.EventType.FreeBusyChanged).then(streaming => {
    let connection = new ews.StreamingSubscriptionConnection(exch, 30);
    connection.AddSubscription(streaming);
    connection.OnNotificationEvent.push((o, a) => {
        logging.log(1, 'Notification recivied', JSON.stringify(a));
        uniqueId = a.Events[0].itemId.UniqueId;
        ews.EmailMessage.Bind(exch, new ews.ItemId(uniqueId)).then(message => {
            if (message.Subject.includes(conf.sub)) {
                logging.log(1, 'Email with the correct subject', uniqueId);
                flag = true;
                if (message.HasAttachments) {
                    logging.log(1, 'Email with attachments', uniqueId);
                    let attch = new ews.FileAttachment;
                    attch = message.Attachments.Items[0];
                    attch.Load().then(() => {
                        fs.writeFile(`${conf.folder}\\files\\${attch.Name}`, attch.Base64Content, { encoding: 'base64' }, err => {
                            if (err === 'undefined')
                                logging.log(3, 'Failed', err);
                            else {
                                logging.log(1, 'File Downloaded', 'Successful');
                                extract(`${conf.folder}\\files\\${attch.Name}`, { dir: `${conf.folder}\\FilesTemp` }, err => {
                                    files = fs.readdirSync(`${conf.folder}\\FilesTemp`).length;
                                    logging.log(1, 'Email attachments', files);
                                    fs.removeSync(`${conf.folder}\\FilesTemp`);
                                    fs.unlinkSync(`${conf.folder}\\files\\LogFiles.zip`);
                                    if (files >= 6)
                                        dash.sendReq(false);
                                    else
                                        dash.sendReq(true);
                                });
                            }
                        });
                    });
                } else {
                    logging.log(1, 'The email does not have attachments', uniqueId);
                    dash.sendReq(true);
                }
            }
        });
    });
    connection.Open();
    logging.log(1, 'Stream opened');
    connection.OnDisconnect.push((connection, e) => {
        if (e.Exception)
            throw new Error('The connection failed');
        else
            logging.log(1, 'Connection finished for the timeout. It is restarted');
        connection.Open();
    });
}).catch(e => {
    logging.log(3, 'Something failed', e);
});

schedule.scheduleJob('00 1 * * *', () => {
    if (flag)
        flag = false;
    else
        dash.sendReq(true);
});