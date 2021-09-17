var fileAppend = require('./fileAppender')
var logFile = 'output.log'

var fileLogger = {
    init: function(logPath) {
        if(logPath) {
            logFile = logPath;
        }
    },

    log: function(errMsg) {
        if(errMsg) {
            fileAppend.append(logFile, errMsg)
        }
    },
}
module.exports = fileLogger