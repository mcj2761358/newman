const newman = require('newman');

const fileLogger = require('./util/fileLogger')
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

fileLogger.init(config.logOutPut)

// 配置开始时间
config.startTime = startTime

// 生成 newman 执行的 option
const newmanOption = newmanOptionGen.generate(config)
var index = 0;
/**
 * 开始执行 postman
 */
newman.run(newmanOption).on('start', function (err, args) { startHandler.handle(err, args, config); })
                        .on('beforeRequest', function (err, args) {
                            index++;
                            config.curIdx = index;
                            beforeRequestHandler.handle(err, args, config);
                        })
                        .on('request', function (err, args) {
                            try {
                                requestHandler.handle(err, args, config);
                            } catch (err) {
                                fileLogger.log('执行 [ ' + args.request.body.raw + " ] 报错: " + err);
                            }
                        })
                        .on('done', function (err, summary) { doneHandler.handle(err, summary, config); })
                        .on('exception', function(err, args) {
                            exceptionHandler.handle(err, args, config) }
                         );


