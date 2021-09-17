const fs = require('fs');

function truncateFile(filePath) {
    if(!filePath) {
        return;
    }
    fs.truncate(filePath, 0, function(){console.log(filePath + ' 已清空....')});

}

function createFileIfDontExist(filePath) {
    if(!filePath) {
        return;
    }
    fs.exists(filePath, (exist) => {
        if(!exist) {
            fs.writeFile(filePath, '', 'utf8', () => {
                console.info('文件 [ ' + filePath + ' ] 新建成功')
            })
        }
    })

}



var handler = {
    handle: function(err, args, config) {
        console.info("开始处理")
        if(err) {
            console.info('开始处理报错了: ' + err);
            return;
        }
       createFileIfDontExist(config.errorLogPath)
       createFileIfDontExist(config.outputPath)
       createFileIfDontExist(config.logOutPut)

        if(config.clearFile) {
           truncateFile(config.errorLogPath)
           truncateFile(config.outputPath)
           truncateFile(config.logOutPut)
        }

    }

}

module.exports = handler