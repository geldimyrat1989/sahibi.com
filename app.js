const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
//here I will require ejs-mate:
const ejsMate = require('ejs-mate');
//now after creating our own ExpressError class we need to import them:
const ExpressError = require('./utils/ExpressError');
//today we installed flash and requiring it:
const flash = require('connect-flash');
//and session:
const session = require('express-session');
//now that we installed we require our packages:
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



//now after breaking up our routes seperately we have to require them:
const productRoutes = require('./routes/products');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

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
//now here we have set static folder to join the path:
app.use(express.static(path.join(__dirname, 'public')))

//here we define object that will send a cookie to browser and will
//keep track how long will it stay in particular browser:
const sessionConfig = {
    secret: 'oursecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //we will keep it one week:
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())


//these are all built in methods of passport-local package:
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>
{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//we have to use our routes as a middleware:
app.use('/', userRoutes);
app.use('/products', productRoutes);
app.use('/products/:id/reviews', reviewRoutes);


//checking if we are connected to home page:
app.get('/', (req, res) =>
{
    res.render('home')
})


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