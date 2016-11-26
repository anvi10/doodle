var mongoose = require('mongoose');

var UserClass = mongoose.Schema({
    username: String,
    password: String
});

UserClass.methods.verifyPassword = function(pw) {
    return this.password == pw;
}

module.exports = mongoose.model("UserInfo", UserClass);