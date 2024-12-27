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
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Anatomy_of_a_Sunset-2.jpg/1920px-Anatomy_of_a_Sunset-2.jpg",
        set: v => v === "" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Anatomy_of_a_Sunset-2.jpg/1920px-Anatomy_of_a_Sunset-2.jpg" : v,
    },
    price: Number,
    location: String,
    country: String,
    review: [
        {
            type: schema.Types.ObjectId,
            ref: "review",
        }
    ]
});

//second method with post middlewere
// listning_schema.post("findOneAndDelete", async (listing) => {
//     if (listing)
//         await reviews.deleteMany({ _id: { $in: listing.review } });
// });


const listing = new mongooes.model("listing", listning_schema);

module.exports = listing;
