const newman = require('newman');

const startHandler = require('./handler/newmanStartHandler')
const beforeRequestHandler = require('./handler/newmanBeforeRequestHandler')
const requestHandler = require('./handler/newmanRequestHandler')
const doneHandler = require('./handler/newmanDoneHandler')
const exceptionHandler = require('./handler/newmanExceptionHandler')

const configReader = require('./util/configReader')
const configChecker = require('./util/configChecker')
const newmanOptionGen = require('./util/newmanOptionGen')


// 读取配置文件
const startTime = new Date()
const config = configReader.read()
console.info(config)
if(!configChecker.check(config)) {
    return
}
// 配置开始时间
config.startTime = startTime
// 生成 newman 执行的 option
const newmanOption = newmanOptionGen.generate(config)

/**
 * 开始执行 postman
 */
newman.run(newmanOption).on('start', function (err, args) { startHandler.handle(err, args, config); })
                        .on('beforeRequest', function (err, args) { beforeRequestHandler.handle(err, args, config); })
                        .on('request', function (err, args) {requestHandler.handle(err, args, config); })
                        .on('done', function (err, summary) { doneHandler.handle(err, summary, config); })
                        .on('exception', function(err, args) { exceptionHandler.handle(err, args, config) });


