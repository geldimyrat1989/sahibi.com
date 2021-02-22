//in this model we also need mongoose for creating schema:
const mongoose = require('mongoose');
//and from mongoose we need schema property:
const Schema = mongoose.Schema;

//here we defining schema for our reviews:
const reviewSchema = new Schema({
    body: String,
    rating: Number
});

//and export it to use:
module.exports = mongoose.model('Review', reviewSchema);

