const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) =>
{
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) =>
{
    //here we have to handle the error if the user is already exsisting in our database:
    try
    {
        //here we getting params from  the req.body and destructure:
        const { email, username, password } = req.body;
        //then create new user according to our schema:
        const user = new User({ email, username });
        //then register a paricular user:
        const registeredUser = await User.register(user, password);
        //here we have to make sure that user is logged in :
        req.login(registeredUser, err =>
        {
            if (err) return next(err);
            //if successfully flash a message:
            req.flash('success', 'Welcome to sahibi.com');
            res.redirect('/products')
        })
    } catch (e)
    {
        //if there is an error we catch it and respond with flash and error.message:
        req.flash('error', e.message);
        res.redirect('register');
    }
}))

//getting login form:
router.get('/login', (req, res) =>
{
    res.render('users/login');
})

//posting login:
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) =>
{
    req.flash('success', 'Welcome Back!');
    //here we remembering the url wherever user is redirected from to login form, after loging in user will be redicted to 
    //the same url as before:
    const redirectUrl = req.session.returnTo || '/products';
    //after its done we will delete that url from session memory:
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) =>
{
    //to logout we use built in method of passport package:
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/products');
})

module.exports = router;