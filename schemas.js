//we require joi apckage here and make our schema:
const Joi = require('joi');


//joi lets you describe your data using a simple, intuitive, and readable language.
//with joi package we can easily define our requirements:
//we make schema and export:
module.exports.productSchema = Joi.object({
    product: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});