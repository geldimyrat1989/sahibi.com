//here we also need mongoose to create fake data for our pages:
const mongoose = require('mongoose');
//requesting cities from cities & description, product, img url file:
const cities = require('./cities');
const { descriptors, prodcut } = require('./seedHelpers');
//and we need to require our model from:
const Product = require('../models/products');

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


const seedDB = async () =>
{
    //first we will delete everything inside local db:
    await Product.deleteMany({});
    //loop over our cities randomly and combine with our sample array:
    for (let i = 0; i < 5; i++)
    {
        const random5 = Math.floor(Math.random() * 4);
        //here we combining our randomly number and array details together:
        const prd = new Product({
            location: `${ cities[random5].city }, ${ cities[random5].state }`,
        })
        //then await everything and save our fake product data:
        await prd.save();
    }
}

//we have execute seedDB once whenever we make changes to seed some fake data:
seedDB().then(() =>
{
    //we close the connection after seeding some data:
    mongoose.connection.close();
})

