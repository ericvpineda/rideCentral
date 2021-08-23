const mongoose = require('mongoose');
const Review = require('../models/review')
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url : String,
    filename : String
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_100')
})

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
    img : [imageSchema],
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
    },
    geometry : {
        type : {
            type : String,
            enum : ["Point"],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    }
}, {toJSON : {virtuals : true}})

tripSchema.virtual('properties.popUp').get(function () {
    return `<strong><a href="/rides/${this._id}" style="color:black">${this.title}</a><strong>
    <p style="color:black">${this.description.substring(0,20)}...</p>`
})

// NOTE: REMOVE ALL REVIEW ASSO WITH TRIP
tripSchema.post('findOneAndDelete', async function(trip) {
    if (trip) {
        await Review.deleteMany({_id : {$in : trip.reviews}})
    }
})

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;