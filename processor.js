const Message = require('./message.js');
const persist = require('./persister.js');
const {createInterface} = require('readline');
const {createReadStream} = require('fs');
const {once} = require('events');

const regex1 = /^(\d\d?\/\d\d?\/\d\d, \d\d?:\d\d?) - .(.+).: (.+)$/;
const regex2 = /^(\d\d?\/\d\d?\/\d\d, \d\d?:\d\d?) - (.+)$/;
const regex3 = /^(\d\d?\/\d\d?\/\d\d, \d\d?:\d\d? [A|P]M) - \+(.+?): (.*)$/;
const regexes = [regex1, regex2, regex3];

module.exports = async function (filePath) {
    console.log("processing file: " + filePath);
    const txt = createInterface({
        input: createReadStream(filePath)
    });
    let messages = [];
    txt.on('line', function (line) {
        line=line.replace(/[\u202a-\u202c]/,"")
        let result;
        for (const regex of regexes) {
            result = regex.exec(line);
            if (result) {
                messages.push(new Message(result));
                break;
            }
        }
        if (!result)
            if (messages.length > 0)
                messages[messages.length - 1].append(line);
            else
                console.log('ignore line: ' + line)
    });
    await once(txt, 'close');
    await persist(messages)
};
