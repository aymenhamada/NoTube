const mongoose = require("mongoose");
mongoose.Promise =  global.Promise;


const userSchema = new mongoose.Schema({
    email:{
        type: String
    },
    password:{
        type: String,
    }
})

module.exports = mongoose.model("User", userSchema);