var mongoose = require('mongoose');

var UserClass = mongoose.Schema({
    username: String,
    password: String,
    citationlists: [mongoose.Schema.Types.ObjectId]
});

UserClass.methods.verifyPassword = function(pw) {
    return this.password == pw;
}

module.exports = mongoose.model("UserInfo", UserClass);

