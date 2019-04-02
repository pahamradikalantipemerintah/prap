const MailDev = require('maildev');
const tmp = require('tmp');
const fs = require('fs');
const unzipper = require('unzipper');
const {once} = require('events');
const processTxt = require('./processor.js');

const filenamePrefix = new Buffer("IldoYXRzQXBwIENoYXQgd2l0aCI=", 'base64').toString('ascii');
const maildev = new MailDev();

maildev.listen();

maildev.on('new', email => {
    email.attachments.forEach(attachment => {
        if (attachment.fileName.startsWith(filenamePrefix))
            maildev.getEmailAttachment(email.id, attachment.fileName, (err, contentType, readStream) => {
                if (contentType === "application/zip") extract(readStream).then(processTxt);
                if (contentType === "text/plain") {
                    const tmpFile = tmp.fileSync();
                    readStream.pipe(fs.createWriteStream(tmpFile.name)).on('finish', () => {
                        processTxt(tmpFile.name)
                    })
                }
            })
    })
});

async function extract(readStream) {
    const tmpFile = tmp.fileSync();
    const unzip = readStream.pipe(unzipper.Parse()).on('entry', (entry) => {
        const type = entry.type;
        const fileName = entry.path;
        if (type === "File" && fileName.startsWith(filenamePrefix) && fileName.endsWith(".txt")) {
            return entry.pipe(fs.createWriteStream(tmpFile.name));
        } else {
            entry.autodrain()
        }
    });
    await once(unzip, 'finish');
    return tmpFile.name
}

processTxt('./data-sample/prap.txt');