const { productSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Product = require('./models/products');
const Review = require('./models/review');


//here we declared our function that will check if the user is
//logged in and export:
module.exports.isLoggedIn = (req, res, next) =>
{
    if (!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) =>
{
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have a permission!');
        return res.redirect(`/products/${ id }`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) =>
{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id))
    {
        req.flash('error', 'You do not have a permission!');
        return res.redirect(`/products/${ id }`);
    }
    next();
}


//here same as at the top validator we also have to validate review form for validity with joi package:
module.exports.validateReview = (req, res, next) =>
{
    //same procedure:
    const { error } = reviewSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else
    {
        next();
    }
}



//now here we define a function that will check for form validation:
//with help of npm joi package:
module.exports.validateProduct = (req, res, next) =>
{
    //here we destructuring error from req.body
    const { error } = productSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else
    {
        next();
    }
}
