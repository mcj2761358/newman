const tough = require('tough-cookie');

function set_cookie_cb(err, cookie) {
    if(err) {
        console.info(err);
    } else {
        console.info("set cookie");
    }
}

var cookieJarGen = {
    generate: function(config) {

        const cookiejar = new tough.CookieJar();
        cookiejar.rejectPublicSuffixes = false
        cookiejar.setCookie('JSESSIONID=ZTNjNjBhNmEtNzdkMy00MjlkLWE3MjItZjljNWRjMDYxM2Y4; Path=/launa; Domain=localhost; HttpOnly;',
            'http://localhost/',
            {},
            set_cookie_cb);

        return cookiejar
    }

}

module.exports = cookieJarGen