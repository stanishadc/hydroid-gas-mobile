class Auth {
    constructor() {
        this.Uauthenticated = false
    }
    ulogin(cb) {
        this.Uauthenticated = true
        cb()
    }
    uulogin(cb) {
        this.Uauthenticated = true
    }
    ulogout(cb) {        
        localStorage.removeItem("userId");
        localStorage.removeItem("userToken");
        localStorage.removeItem("tokenexpiration");
        localStorage.removeItem("roleName");
        localStorage.removeItem("name");
        this.Uauthenticated = false;
        cb()
    }
    isUAuthenticated() {
        return this.Uauthenticated;
    }
}
export default new Auth()