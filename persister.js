const loadJsonFile = require('load-json-file');
const writeJsonFile = require('write-json-file');
const _ = require('lodash');
const fs = require('fs');
const Message = require('./message.js');

module.exports=async function (messages) {
    const sumJson = './data/sum.json';
    let sum = new Set(loadJsonFile.sync(sumJson));
    for (let [index, msgList] of Object.entries(_.groupBy(messages, 'index'))) {
        const jsonFile = `./data/${index}`;
        if (!fs.existsSync(jsonFile)) {
            writeJsonFile.sync(jsonFile, [])
        }
        let data = loadJsonFile.sync(jsonFile);
        const uniqueMsg = data.reduce((res, curr) => res.add(curr.msg), new Set());
        for (const msg of msgList) {
            if (!uniqueMsg.has(msg)) {
                uniqueMsg.add(msg);
                try {
                    data.push(msg.toJSON());
                } catch (e) {
                    console.log(e)
                }
            }
        }
        data.sort((a, b) => a.id - b.id);
        writeJsonFile.sync(jsonFile, data, {indent: null});
        console.log('finish update json: ' + jsonFile);
        sum.add(index)
    }
    writeJsonFile.sync(sumJson, [...sum].sort().reverse(), {indent: null})
}