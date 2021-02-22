//we require joi apckage here and make our schema:
const Joi = require('joi');
const { number } = require('joi');

//joi lets you describe your data using a simple, intuitive, and readable language.
//with joi package we can easily define our requirements:
//we make schema and export:
module.exports.productSchema = Joi.object({
    product: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        img: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

//here we also define schema for our reviews form for validating our form:
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})
