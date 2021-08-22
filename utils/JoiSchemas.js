// VARIABLES 
const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const ext = (joi) => ({
    type : 'string',
    base: joi.string(),
    messages : {
        'string.escapeHtml' : '{{#label}} must not have Html!'
    },
    rules : {
        escapeHtml : {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags : [],
                    allowedAttributes : []
                })

                if (clean !== value) {
                    return helpers.error('string.escapeHtml', {value})
                }
                return clean; 
            }
        }
    }
})

const Joi = baseJoi.extend(ext);

// VALIDATOR
const tripSchema = new Joi.object({
    trip : Joi.object({
        title : Joi.string().required().escapeHtml(),
        description : Joi.string().required().escapeHtml(),
        // img : Joi.string().required(),
        location : Joi.string().required().escapeHtml(),
        date : Joi.string().required().escapeHtml()
    }).required()
})

const reviewSchema = new Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body : Joi.string().required().escapeHtml()
    }).required()
})

module.exports = {tripSchema, reviewSchema}