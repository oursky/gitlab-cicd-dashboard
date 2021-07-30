exports.getCookie = function getTokenCookie(req){
        let cookie = decodeURIComponent(req.headers.cookie);
        if(cookie === ""){
            return 0
        }
        else{
            const token = cookie.split('=')
            return token[1]
        }
    }