const util = require('util');
const request = require('request');
const consoleLogger = require('../util/consoleLogger')
const fileAppender = require('../util/fileAppender')
const fileLogger = require('../util/fileLogger')

// 格式化输出
const urlFormat = '%s/system/setShopStorageProfile?shopId=%s&profileKey=%s&profileValue=%s';
const curlFormat = 'curl -H %s -X GET %s'


// 业务类型转换
const bizTyepMap = {
    '工单': 'RL_WOU',
    '车主': 'RL_CU',
    '配件': 'RL_SPU',
    '服务项': 'RL_SIU',
    'DATA': 'RL_SNU'
    ,
    '图片': 'RL_PNU',
    'Vin': 'RL_VNU'
}


function getBizType(str) {
    const match = str.match(/([ 工单 | 车主 | 配件 | 服务项 | DATA | 图片 | Vin ])/g);
    const key = match.join('');
    const bizType = bizTyepMap[key];
    return bizType
}


function handlerCheckFail(res, config) {
    const errorMsg = res.errorMsg;
    if(!errorMsg) {
        consoleLogger.error("errorMsg is null")
        return;
    }
    const checkFailMsgList = errorMsg.split('\n');
    const needFix = config.needFix
    for (const index in checkFailMsgList) {
        const checkFailMsg = checkFailMsgList[index]
        if (!checkFailMsg) {
            continue;
        }
        const formatMsg = formatCheckFailMsg(checkFailMsg);
        fileAppender.append(config.errorLogPath, formatMsg);
        // const output = getOutPut(formatMsg, config)
        // appendFile(config.outputPath, output);
        // 修复数据
        if(needFix) {
            fix(formatMsg, config)
        }

    }
}

/**
 * 去除校验错误信息中的字符串
 * @param checkFailMsg
 * @returns {*}
 */
function formatCheckFailMsg(checkFailMsg) {
    if (!checkFailMsg) {
        return null
    }
    return checkFailMsg.replace(/\s/g, '');
}


/**
 * 生成输出信息,
 * 例子：店铺[1000]服务项存储数据存在偏差,使用量[0]，实际[8],偏差[-8]
 * 会匹配其中的 match = [ 1000, 0, -8, 8 ]
 * 然后根据字符串模版生成最终的信息
 * https://www.sqzone.com/launa/system/setShopStorageProfile?shopId=1000&profileKey=RL_SIU&profileValue=8
 *
 *
 *
 * @param msg
 * @returns {*}
 */
function getOutPut(msg, config) {
    const match = msg.match(/(-?\d+)/g);
    const url = util.format(urlFormat, config.domain, match[0], getBizType(msg), match[2]);
    const cookieHeader = getCurlCookieHeader(config);
    return util.format(curlFormat, cookieHeader , url)
}

function fix(msg, config) {
    const match = msg.match(/(-?\d+)/g);
    const url = util.format(urlFormat, config.domain, match[0], getBizType(msg), match[2]);
    fileAppender.append(config.outputPath, url)
    const option = {
        'url': url,
        'method': 'GET',
        'headers': {'cookie': config.cookie}

    }
    request(option, function(error, response, body) {
        const statusCode = response && response.statusCode
        if(!statusCode || statusCode !== 200) {
            console.info('fix url [ ' + url + ' ] 执行失败 [ ' + (statusCode ? response.statusCode : response) + ' ]')
            return;
        }
        const contentType = response.headers['content-type']
        if(contentType.indexOf('json') < 0) {
            console.info('fix url [ ' + url + ' ] response header [ ' + contentType + ' ] 不是 json')
            return;
        }
        const result = JSON.parse(body);
        if(!result.success) {
            consoleLogger.error('fix url [ ' + url + ' ] 修复失败：' + result.errorMsg)
        } else {
            consoleLogger.success('修复成功')
        }
    })

}

function getCurlCookieHeader(config) {
    if(!config.cookie) {
        return ''
    }
    return '\"cookie: ' + config.cookie + '\"';
}

var handler = {
    handle: function (err, args, config) {
        if (err) {
            console.info(err);
            return;
        }
        var res = null;
        const resStr = args.response.stream.toString();
        try {
             res = JSON.parse(resStr);
        } catch(e) {
            consoleLogger.error("处理 response 返回结果失败：" + e + " ,返回结果：" + resStr);
            return
        }

        // 校验出错打印红色，校验成功打印绿色
        if(res.success === true) {
            consoleLogger.success('校验通过')
        } else {
            consoleLogger.error('校验失败')
            // 失败处理
            handlerCheckFail(res, config)
        }
    }

}

module.exports = handler