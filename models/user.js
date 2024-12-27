const { types } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passport = require("passport-local-mongoose");


const user_schema = new schema({
    email: {
        type: String,
        require: true,
    }
});

user_schema.plugin(passport);

module.exports = mongoose.model("user", user_schema);