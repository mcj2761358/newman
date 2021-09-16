var consoleLogger = {
    success: function(msg) {
        console.info('\x1B[36m%s\x1B[0m', msg);
    },

    error: function(msg) {
        console.info('\x1B[31m%s\x1B[0m', msg);
    }
}
module.exports = consoleLogger