const simpleGit = require('simple-git');

module.exports = function () {
    if (global.mailIsRun || global.processorIsRun || global.persisterIsRun)
        return;
    let commitId = new Date().getTime();
    simpleGit().add('./*').commit(commitId)
        .push('origin', 'master', () => console.log('last upload check: ' + commitId));
};
