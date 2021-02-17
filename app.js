const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
// now here we importing the schema from:
const Product = require('./models/products');

//connecting to mongoDB locally:
mongoose.connect('mongodb://localhost:27017/sahibi', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true
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

//we also have to set view engine to ejs:
app.set('view engine', 'ejs');
//and set an absolute path for joining our views directory pathes:
app.set('views', path.join(__dirname, 'views'));

//we need to parse the data from the body with:
app.use(express.urlencoded({ extended: true }));
//and of course we need our method-override middleware for CRUD operations:
app.use(methodOverride('_method'));

//checking if we are connected to home page:
app.get('/', (req, res) =>
{
    res.render('home')
})

app.get('/products', async (req, res) =>
{
    //first find all products we have to await this:
    const products = await Product.find({});
    //render the index page and we pass over what we found from db:
    res.render('products/index', { products })
});

//getting the page for creating new product:
app.get('/products/new', (req, res) =>
{
    //rendering the /new page:
    res.render('products/new');
});

app.post('/products', async (req, res) =>
{
    //getting the new product from req.body and saving it mongoDB:
    const product = new Product(req.body.product);
    await product.save();
    //after posting we will redirect to show page:
    res.redirect(`/products/${ product._id }`);
});

//after creating new product we redirect to this page:
app.get('/products/:id', async (req, res) =>
{
    //finding by id of particular product in requesting in params object database:
    const product = await Product.findById(req.params.id);
    //and then rendering the show page with id of particular product:
    res.render('products/show', { product });
})


//now we heading to edit or update paricular product:
app.get('/products/:id/edit', async (req, res) =>
{
    //we will find by id as usually:
    const product = await Product.findById(req.params.id);
    //then render the edit form:
    res.render('products/edit', { product });
})

app.put('/products/:id', async (req, res) =>
{
    //not forget to get id from req.params:
    const { id } = req.params;
    //here we are finding by id and replacing the existing with new version
    //with spread operator:
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    //after that ofcourse redirect to show page:
    res.redirect(`/products/${ product._id }`);
})

//time to delete:((
app.delete('/products/:id', async (req, res) =>
{
    //get id first:
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    //then redirect to index page:
    res.redirect('/products');
})


//almost forgot to listen to localhost:
app.listen(3000, () =>
{
    console.log('Listening on port 3000!!')
})