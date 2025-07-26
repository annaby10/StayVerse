const Joi = require('joi'); 
                                                                               

//Joi Schema For Listing Validation
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required()
  }).required()
});





