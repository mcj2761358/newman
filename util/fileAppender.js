const fs = require('fs');


var fileAppender = {
    append: function(filepath, msg) {
        if (!filepath) {
            return
        }

        fs.appendFile(filepath, msg + '\n', function (error) {
            if (error) {
                console.error('写' + filepath + '出错: ' + error);
            }
        })
    }
}

module.exports = fileAppender