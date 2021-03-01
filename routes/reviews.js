const express = require('express');
//here to access params property we have to set mergeParams to true:
const router = express.Router({ mergeParams: true });
const Product = require('../models/products');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const { isReviewAuthor, validateReview, isLoggedIn } = require('../middleware');






//now we have set route to post our reviws:
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) =>
{
    // res.send('you made it!')
    const product = await Product.findById(req.params.id);
    const review = new Review(req.body.review);
    // //here we will push to existing array of reviews our new review:
    product.reviews.unshift(review);
    // //and save both review and product:
    await review.save();
    await product.save();
    req.flash('success', 'Created new review!')
    // //then redirecting to the show page:
    res.redirect(`/products/${ product._id }`);
}))

//now we are deleting our particular review:
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) =>
{
    const { id, reviewId } = req.params;
    //after getting ids we use mongoDB's $pull method and delete all the reviews with particular product:
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    //and then redirect to show page:
    res.redirect(`/products/${ id }`);
}))


//and after all we export router
module.exports = router;