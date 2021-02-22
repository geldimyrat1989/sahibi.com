const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
//here we require our joi schema:
const { productSchema, reviewSchema } = require('./schemas.js');
const mongoose = require('mongoose');
// now here we importing the schema from:
const Product = require('./models/products');
//here I will require ejs-mate:
const ejsMate = require('ejs-mate');
//now after creating our own ExpressError class we need to import them:
const ExpressError = require('./utils/ExpressError');
//and our function for catching async errors:
const catchAsync = require('./utils/catchAsync');
//here we also need to import review schema:
const Review = require('./models/review');



//connecting to mongoDB locally:
mongoose.connect('mongodb://localhost:27017/sahibi', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

//We have a pending connection to the test database running on localhost.
//We now need to get notified if we
//connect successfully or if a connection error occurs:
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>
{
    console.log('Mongo Connected!!!')
});

//here we execute express and save it to a variable:
const app = express();

//here we have to set engine to ejs-mate as well:
app.engine('ejs', ejsMate);
//we also have to set view engine to ejs:
app.set('view engine', 'ejs');
//and set an absolute path for joining our views directory pathes:
app.set('views', path.join(__dirname, 'views'));

//we need to parse the data from the body with:
app.use(express.urlencoded({ extended: true }));
//and of course we need our method-override middleware for CRUD operations:
app.use(methodOverride('_method'));


//now here we define a function that will check for form validation:
//with help of npm joi package:
const validateProduct = (req, res, next) =>
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

//here same as at the top validator we also have to validate review form for validity with joi package:
const validateReview = (req, res, next) =>
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


//checking if we are connected to home page:
app.get('/', (req, res) =>
{
    res.render('home')
})

//now after imoring our catchAsync function we have to wrap all our async functions with it:
app.get('/products', catchAsync(async (req, res) =>
{
    //first find all products we have to await this:
    const products = await Product.find({});
    //render the index page and we pass over what we found from db:
    res.render('products/index', { products })
}));

//getting the page for creating new product:
app.get('/products/new', (req, res) =>
{
    //rendering the /new page:
    res.render('products/new');
});

app.post('/products', validateProduct, catchAsync(async (req, res) =>
{
    //getting the new product from req.body and saving it mongoDB:
    const product = new Product(req.body.product);
    await product.save();
    //after posting we will redirect to show page:
    res.redirect(`/products/${ product._id }`);
}));

//after creating new product we redirect to this page:
app.get('/products/:id', catchAsync(async (req, res) =>
{
    //finding by id of particular product in requesting in params object database:
    //after structuring reviews we have to populate the reviews object to render them:
    const product = await Product.findById(req.params.id).populate('reviews');
    console.log(product)
    //and then rendering the show page with id of particular product:
    res.render('products/show', { product });
}));


//now we heading to edit or update paricular product:
app.get('/products/:id/edit', catchAsync(async (req, res) =>
{
    //we will find by id as usually:
    const product = await Product.findById(req.params.id);
    //then render the edit form:
    res.render('products/edit', { product });
}));

app.put('/products/:id', validateProduct, catchAsync(async (req, res) =>
{
    //not forget to get id from req.params:
    const { id } = req.params;
    //here we are finding by id and replacing the existing with new version
    //with spread operator:
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    //after that ofcourse redirect to show page:
    res.redirect(`/products/${ product._id }`);
}));

//time to delete:((
app.delete('/products/:id', catchAsync(async (req, res) =>
{
    //get id first:
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    //then redirect to index page:
    res.redirect('/products');
}));

//now we have set route to post our reviws:
app.post('/products/:id/reviews', validateReview, catchAsync(async (req, res) =>
{
    // res.send('you made it!')
    const product = await Product.findById(req.params.id);
    const review = new Review(req.body.review);
    // //here we will push to existing array of reviews our new review:
    product.reviews.unshift(review);
    // //and save both review and product:
    await review.save();
    await product.save();
    // //then redirecting to the show page:
    res.redirect(`/products/${ product._id }`);
}))

//now we are deleting our particular review:
app.delete('/products/:id/reviews/:reviewId', catchAsync(async (req, res) =>
{
    const { id, reviewId } = req.params;
    //after getting ids we use mongoDB's $pull method and delete all the reviews with particular product:
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log(reviewId)
    //and then redirect to show page:
    res.redirect(`/products/${ id }`);
}))
// 

//for simplicity of unknown get requests we will send:
app.all('*', (req, res, next) =>
{
    //we will create with new keyword and pass message:
    next(new ExpressError('Page Not Found'))
});

//our middleware that will catch all async errors:
app.use((err, req, res, next) =>
{
    //here we destructuring statusCode and assigning a default value:
    const { statusCode = 500 } = err;
    //if error doesn't have message we set default:
    if (!err.message) err.message = 'Oh No, Error!!!'
    //then we render our error template:
    res.status(statusCode).render('error', { err });
})

//almost forgot to listen to localhost:
app.listen(3000, () =>
{
    console.log('Listening on port 3000!!')
})