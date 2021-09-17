var consoleLogger = require('../util/consoleLogger')
var handler = {
    handle: function(err, args, config) {
        const param = args.request.body.raw
        if(config.startShopId && param) {
            if(!param) {
                throw ('newmanBeforeRequestHandler: param is null')
            }
            const shopId = parseInt(param.substr(1, param.length - 1))

            if(config.startShopId > shopId) {
                consoleLogger.success('跳过执行: ' + shopId)
                throw ('newmanBeforeRequestHandler: 跳过执行' + shopId)
            }
        }

        var str = '开始校验第 [' + config.curIdx + '] 个门店: ' + param
        if (err) {
            consoleLogger.error(str  + " 报错, " + err)
        } else {
            consoleLogger.success(str)
        }
    }

}

module.exports = handler