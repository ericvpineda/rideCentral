// VARIABLES
const Review = require('../models/review');
const Trip = require('../models/trip');

// FUNCTIONS 

// CREATE 
const createAction = async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    const newReview = await new Review(req.body.review);
    newReview.rider = req.user._id;
    const utcDate = new Date();
    newReview.date = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
        .toISOString().split("T")[0]

    trip.reviews.push(newReview);

    await trip.save();
    await newReview.save();
    // await newReview.save();

    res.redirect(`/rides/${trip._id}`);
}


// DELETE
const deleteAction = async (req, res) => {

    const {reviewId, id} = req.params;
    const trip = await Trip.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Trip.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});

    res.redirect(`/rides/${trip._id}`);
}


module.exports = {createAction, deleteAction}