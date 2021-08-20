// VARIABLES 
const {tripSchema, reviewSchema} = require('../utils/JoiSchemas');
const {CustomError} = require('../utils/CustomError')

// NOTE: CATCH ERRORS WITH DB
const catchAsyncError = (fn) => {

    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e))
    } 
}

// NOTE: VALIDATE REQ FROM CREATE / EDIT ROUTE 
const validateTrip = (req, res, next) => {

    const {notValid} = tripSchema.validate(req.body);
    if (notValid) {
        const errorMessage = error.details.map(el => el.message).join(',');
        throw new CustomError(errorMessage, 405);
    } else {
        next()
    }
}

const authenLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.prevPage = req.originalUrl;
        req.flash('error', 'Please sign in!');
        res.redirect('/login');
    }
    next()
}

const validateReview = (req, res, next) => {
    
    const {notValid} = reviewSchema.validate(req.body);
    if (notValid) {
        const errorMessage = error.details.map(el => el.message).join(',');
        throw new CustomError(errorMessage, 405);
    } else {
        next()
    }
}



module.exports = {catchAsyncError, validateTrip, authenLogin, validateReview}