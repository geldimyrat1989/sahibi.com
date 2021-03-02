const express = require('express');
//here to access params property we have to set mergeParams to true:
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isReviewAuthor, validateReview, isLoggedIn } = require('../middleware');
const reviews = require('../controllers/reviews');

//now we have set route to post our reviws:
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//now we are deleting our particular review:
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


//and after all we export router
module.exports = router;