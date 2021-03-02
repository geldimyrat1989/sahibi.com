const Product = require('../models/products');

module.exports.index = async (req, res) =>
{
    //first find all products we have to await this:
    const products = await Product.find({});
    //render the index page and we pass over what we found from db:
    res.render('products/index', { products })
}

module.exports.renderNewForm = (req, res) =>
{
    //rendering the /new page:
    res.render('products/new');
}

module.exports.createProduct = async (req, res) =>
{
    //getting the new product from req.body and saving it mongoDB:
    const product = new Product(req.body.product);
    product.author = req.user._id
    await product.save();
    //after saving successfully we will flash a message:
    req.flash('success', 'Successfully made a new product!')
    //after posting we will redirect to show page:
    res.redirect(`/products/${ product._id }`);
}


module.exports.showProduct = async (req, res) =>
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
}

module.exports.renderEditForm = async (req, res) =>
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
}


module.exports.updateProduct = async (req, res) =>
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
}

module.exports.deleteProduct = async (req, res) =>
{
    //get id first:
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    //after everything done flash a message:
    req.flash('success', 'Successfully deleted product!');
    //then redirect to index page:
    res.redirect('/products');
}

