const reviews = require("../models/review.js");
const listing = require("../models/listing.js");



module.exports.delete_review = async (req, res) => {
    let { id, rev_id } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { review: rev_id } })
    console.log(rev_id);
    await reviews.findByIdAndDelete(rev_id);
    req.flash("success", "review is deleted !");
    res.redirect(`/listing/${id}`);
}
module.exports.new_review_post = async (req, res) => {
    let { id } = req.params;
    let reviewlisting = await listing.findById(id);
    let newreview = new reviews(req.body.review)
    newreview.auther = req.user._id;
    reviewlisting.review.push(newreview);
    await newreview.save();
    await reviewlisting.save();
    req.flash("success", "New review is added!");
    res.redirect(`/listing/${id}`);
}
