// VARIABLES 
const Joi = require('joi');

// VALIDATOR
const tripSchema = new Joi.object({
    trip : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        img : Joi.string().required(),
        location : Joi.string().required(),
        date : Joi.string().required() 
    }).required()
})

const reviewSchema = new Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body : Joi.string().required()
    }).required()
})

module.exports = {tripSchema, reviewSchema}