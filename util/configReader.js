const fs = require('fs')
const DEFAULT_CONFIG_PATH = '/config/config.json'
var configReader = {
    read: function (configFilePath) {
        if (!configFilePath) {
            configFilePath = process.env.PWD + DEFAULT_CONFIG_PATH;
        }
        const configStr = fs.readFileSync(configFilePath, 'utf-8')
        const config = configStr ? JSON.parse(configStr) : {}
        handleCommand(config)
        return config;
    }

}

function handleCommand(config) {
    const command = process.argv.slice(2)
    console.info('handleCommand: ' + command)
    // 替换下文件路径
    if(command) {
        config.iterationData = command
    }
}

module.exports = configReader