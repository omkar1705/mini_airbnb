
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const rating_schema = new schema({
    comment: String,
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model("review", rating_schema);