const fs = require('fs');

function truncateFile(filePath) {
    if(!filePath) {
        return;
    }
    fs.truncate(filePath, 0, function(){console.log(filePath + ' 已清空....')});

}

var handler = {
    handle: function(err, args, config) {
        console.info("开始处理")
        if(err) {
            console.info('开始处理报错了: ' + err);
            return;
        }
        truncateFile(config.errorLogPath)
        truncateFile(config.outputPath)

    }

}

module.exports = handler