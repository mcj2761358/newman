const consoleLogger = require('./consoleLogger')

var configChecker = {
    check: function(config) {
        const newman = config.newman
        if(!newman) {
            consoleLogger.error('config.newman 不存在')
            return false;
        }

        if(!newman.collection) {
            consoleLogger.error('config.newman.collection 不存在')
            return false;
        }

        if(!newman.environment) {
            consoleLogger.error('config.newman.environment 不存在')
            return false;
        }

        if(!newman.iterationData) {
            consoleLogger.error('config.newman.iterationData 不存在')
            return false;
        }

        if(!config.cookie) {
            consoleLogger.error('config.cookie 不存在')
            return false;
        }

        if(!config.domain) {
            consoleLogger.error('config.domain 不存在')
            return false;
        }

        return true;
    }

}

module.exports = configChecker