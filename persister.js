const loadJsonFile = require('load-json-file');
const writeJsonFile = require('write-json-file');
const _ = require('lodash');
const fs = require('fs');
const Message = require('./message.js');

module.exports = function (messages) {
    global.persisterIsRun = true;
    const sumJson = './data/sum.json';
    let sum = new Set(loadJsonFile.sync(sumJson));
    for (let [index, newJsonMsg] of Object.entries(_.groupBy(messages, 'index'))) {
        const jsonFile = `./data/${index}`;
        if (!fs.existsSync(jsonFile)) {
            writeJsonFile.sync(jsonFile, [])
        }
        let data = loadJsonFile.sync(jsonFile);
        const uniqueMsg = data.reduce((res, curr) => res.add(curr.msgHash), new Set());
        uniqueMsg.add(3598458527);
        for (const jsonMsg of newJsonMsg) {
            if (!uniqueMsg.has(jsonMsg.msgHash)) {
                uniqueMsg.add(jsonMsg.msgHash);
                data.push(jsonMsg.toJSON());
            }
        }
        data.sort((a, b) => a.id - b.id);
        writeJsonFile.sync(jsonFile, data, {indent: null});
        console.log('finish update json: ' + jsonFile);
        sum.add(index)
    }
    writeJsonFile.sync(sumJson, [...sum].sort(), {indent: null});
    global.persisterIsRun = false;
};