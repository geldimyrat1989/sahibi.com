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
//and set an absolute path for joining our pathes:
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




//almost forgot to listen to localhost:
app.listen(3000, () =>
{
    console.log('Listening on port 3000!!')
})