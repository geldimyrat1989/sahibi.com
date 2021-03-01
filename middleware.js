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