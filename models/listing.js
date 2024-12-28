const mongooes = require("mongoose");
const reviews = require("./review");
const { ref } = require("joi");
const { type } = require("../schema");
const schema = mongooes.Schema;


const listning_schema = new schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    review: [
        {
            type: schema.Types.ObjectId,
            ref: "review",
        }
    ],

    owner:
    {
        type: schema.Types.ObjectId,
        ref: "user"
    }
});

//second method with post middlewere
// listning_schema.post("findOneAndDelete", async (listing) => {
//     if (listing)
//         await reviews.deleteMany({ _id: { $in: listing.review } });
// });


const listing = new mongooes.model("listing", listning_schema);

module.exports = listing;
