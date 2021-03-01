const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/products');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware');



//now after imorting our catchAsync function we have to wrap all our async functions with it:
router.get('/', catchAsync(async (req, res) =>
{
    //first find all products we have to await this:
    const products = await Product.find({});
    //render the index page and we pass over what we found from db:
    res.render('products/index', { products })
}));

//getting the page for creating new product:
router.get('/new', isLoggedIn, (req, res) =>
{
    //rendering the /new page:
    res.render('products/new');
});



router.post('/', isLoggedIn, validateProduct, catchAsync(async (req, res) =>
{
    //getting the new product from req.body and saving it mongoDB:
    const product = new Product(req.body.product);
    await product.save();
    //after saving successfully we will flash a message:
    req.flash('success', 'Successfully made a new product!')
    //after posting we will redirect to show page:
    res.redirect(`/products/${ product._id }`);
}));


//after creating new product we redirect to this page:
router.get('/:id', catchAsync(async (req, res) =>
{
    //finding by id of particular product in requesting in params object database:
    //after structuring reviews we have to populate the reviews object to render them:
    //now here we destructuring and populating the author of particular review:
    const product = await Product.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!product)
    {
        //if we can't find product we will flash error mmessage and
        //redirect to index page:
        req.flash('error', 'Cannot find that product!');
        return res.redirect('/products');
    }
    //if found product we will render that product:
    //and then rendering the show page with id of particular product:
    res.render('products/show', { product });
}));


//now we heading to edit or update paricular product:
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) =>
{
    //we will find by id as usually:
    const product = await Product.findById(req.params.id);
    if (!product)
    {
        //if we can't find product we will flash error mmessage and
        //redirect to index page:
        req.flash('error', 'Cannot find that product!');
        return res.redirect('/products');
    }
    //if found product render the form:
    //then render the edit form:
    res.render('products/edit', { product });
}));

router.put('/:id', isLoggedIn, isAuthor, validateProduct, catchAsync(async (req, res) =>
{
    //not forget to get id from req.params:
    const { id } = req.params;
    //here we are finding by id and replacing the existing with new version
    //with spread operator:
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    //after that ofcourse redirect to show page:
    //after everything done flash a message:
    req.flash('success', 'Successfully updated product!');
    res.redirect(`/products/${ product._id }`);
}));


//time to delete:((
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) =>
{
    //get id first:
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    //after everything done flash a message:
    req.flash('success', 'Successfully deleted product!');
    //then redirect to index page:
    res.redirect('/products');
}));

//now after step 4, we built our separete routes to make things more readible
//and every route has its own routes file so we can access them seperately.

module.exports = router

