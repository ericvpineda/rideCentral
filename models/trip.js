const mongoose = require('mongoose');
const Review = require('../models/review')
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    location : {
        type : String, 
        required: true 
    },
    img : [{
        url : String,
        filename : String
    }],
    date : {
        type : String
    },
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }],
    rider : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})

// NOTE: REMOVE ALL REVIEW ASSO WITH TRIP
tripSchema.post('findOneAndDelete', async function(trip) {
    if (trip) {
        await Review.deleteMany({_id : {$in : trip.reviews}})
    }
})

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;