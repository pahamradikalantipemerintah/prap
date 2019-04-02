const loadJsonFile = require('load-json-file');
const writeJsonFile = require('write-json-file');
const jsons=loadJsonFile.sync("./data/sum.json");
for(const json of jsons){
    const filePath = './data/'+json;
    const msgArr=loadJsonFile.sync(filePath).filter(x=>!x.msg.startsWith('<span>'))
    const uniqueMsgArr={}
    for(const msgObj of msgArr){
        msgObj.msg=msgObj.msg.replace(/[\u202a-\u202c]/,"")
        uniqueMsgArr[JSON.stringify(msgObj)]=msgObj
    }
    writeJsonFile.sync(filePath,Object.values(uniqueMsgArr),{indent:null})
}