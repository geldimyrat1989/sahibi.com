const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware');
const products = require('../controllers/products');



//now after imorting our catchAsync function we have to wrap all our async functions with it:
router.get('/', catchAsync(products.index));

//getting the page for creating new product:
router.get('/new', isLoggedIn, products.renderNewForm);



router.post('/', isLoggedIn, validateProduct, catchAsync(products.createProduct));


//after creating new product we redirect to this page:
router.get('/:id', catchAsync(products.showProduct));


//now we heading to edit or update paricular product:
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(products.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateProduct, catchAsync(products.updateProduct));


//time to delete:((
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(products.deleteProduct));

//now after step 4, we built our separete routes to make things more readible
//and every route has its own routes file so we can access them seperately.

module.exports = router

