//here we also need mongoose for creating a schema:
const mongoose = require('mongoose');
//here requiring Schema from mongoose object:
const Schema = mongoose.Schema;
//here now we have to import review schema:
const Review = require('./review');


//creating our Schema dynamically with new keyword:
const ProductSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    img: String,
    reviews: [
        {
            //here we have to reference to object id that is related to particular product:
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//after our delete request we will define a middlieware function that
//will listen to any findByIdAndDelete requests
//respond if particular product has any reviews and delete those accordingly
//with help of mongoose findOneAndDelete middleware method:
ProductSchema.post('findOneAndDelete', async function (doc)
{
    if (doc)
    {
        //we will find them all and delete:
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


//exporting our schema this way mongoDb creates new schema:
module.exports = mongoose.model('Product', ProductSchema);
