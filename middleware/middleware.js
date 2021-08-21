// VARIABLES 
const {tripSchema, reviewSchema} = require('../utils/JoiSchemas');
const {CustomError} = require('../utils/CustomError')
const Trip = require('../models/trip')

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
        return res.redirect('/login');
    }
    next()
}

const authorizeRider = async (req, res, next) => {
    
    const {id} = req.params;
    const trip = await Trip.findById(id);
    
    if (trip && !trip.rider.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access this!');
        return res.redirect(`/trips/${trip._id}`);
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



module.exports = {catchAsyncError, validateTrip, authenLogin, validateReview, authorizeRider}