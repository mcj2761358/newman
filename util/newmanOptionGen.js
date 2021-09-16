const fs = require('fs')
const consoleLogger = require('./consoleLogger')

// 设置cookie
function getCookieHeader(config) {
    return {
        "key": "cookie",
        "value": config.cookie,
        "type": "text"
    }
}

function setCookie(collection, config) {
    const itemList = collection.item
    if(!itemList || itemList.length === 0) {
        return;
    }
    const cookieHeader = getCookieHeader(config)
    for(const index in itemList) {
        const item = itemList[index]
        if(!item.request.header) {
            item.request.header = []
        }
        const cookieIndex = item.request.header.findIndex( function(item){
            return item['key'].toLowerCase() === 'cookie'
        });
        if(cookieIndex >= 0) {
            console.info('cookie 已存在')
            item.request.header.splice(cookieIndex, 1, cookieHeader)
        } else {
            item.request.header.push(cookieHeader)
        }

    }
}

// 读取 postman collection 文件
function readCollection(config) {
    const str = fs.readFileSync(config.newman.collection);
    if(!str) {
        consoleLogger.error('生成 newman option 失败：未读取到 collection [ ' + config.newman.collection + ' ] 内容')
        return;
    }
    const collection= JSON.parse(str);
    console.info(collection)
    setCookie(collection, config)
    return collection
}

var optionGenerator = {
    generate: function(config) {

        const option = {
            'collection': readCollection(config),
            'environment': config.newman.environment,
            'iterationData': config.newman.iterationData,
            // 'iterationCount': config.newman.iterationCount
        }

        return option
    }

}

module.exports = optionGenerator