const mongoose = require('mongoose');
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
    img : {
        type : String
    },
    date : {
        type : String
    }
})

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;