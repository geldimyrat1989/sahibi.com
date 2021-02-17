//here we also need mongoose for creating a schema:
const mongoose = require('mongoose');
//here requiring Schema from mongoose object:
const Schema = mongoose.Schema;

//creating our Schema dynamically with new keyword:
const ProductSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    img: String
});

//exporting our schema this way mongoDb creates new schema:
module.exports = mongoose.model('Product', ProductSchema);
