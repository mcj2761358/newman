const DateUtil = require('../util/DateUtil')

function getTotalMinute(startTime, endTime) {
    const millis = endTime.getTime() - startTime.getTime()
    const seconds = millis / 1000
    return (seconds / 60).toFixed(0) + '分' + (seconds % 60).toFixed(0) + '秒'
}

var handler = {
    handle: function(err, summary, config) {
        if (err || summary.error) {
            console.error('collection run encountered an error: ' + err);
        }
        else {
            console.log('执行完成');
        }

        // 计算花费时间
        const endTime = new Date();
        const startTime = config.startTime;
        console.info('开始时间[' + DateUtil.format(startTime, 'yyyy-MM-dd hh:mm:ss') + '] ' +
            ' ----- 结束时间 [ ' + DateUtil.format(endTime, 'yyyy-MM-dd hh:mm:ss') + ' ]' +
            ' ----- 总共花费 [ ' + getTotalMinute(startTime, endTime) + ']')

    }

}

module.exports = handler