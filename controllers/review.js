// VARIABLES
const Review = require('../models/review');
const Trip = require('../models/trip');

// FUNCTIONS 

// CREATE 
const createAction = async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    const newReview = await new Review(req.body.review);
    trip.reviews.push(newReview);

    await trip.save();
    await newReview.save();
    // await newReview.save();

    res.redirect(`/trips/${trip._id}`);
}


// DELETE
const deleteAction = async (req, res) => {

    const {reviewId, id} = req.params;
    const trip = await Trip.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Trip.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});

    res.redirect(`/trips/${trip._id}`);
}


module.exports = {createAction, deleteAction}