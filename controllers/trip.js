// VARIABLES 
const Trip = require('../models/trip');


// FUNCTIONS 

// INDEX 
const index = async (req, res) => {
    const trips = await Trip.find({});
    res.render("trips/index", {trips})
}

// SHOW
const show = async (req, res) => {

    const {id} = req.params;
    const trip = await Trip.findById(id);
    if (trip === null) {
        console.log('CANNOT FIND TRIP WITH THAT ID')
    } else {
        res.render("trips/show", {trip})
    }
}

// CREATE 
const createForm = async (req, res) => {
    res.render("trips/new")
}

const createAction = async (req, res) => {
    const newTrip = new Trip(req.body.trip);
    await newTrip.save();

    // res.send(req.body.trip)
    res.redirect(`trips/${newTrip._id}`)
}

// EDIT
const editForm = async (req, res) => {
    const {id} = req.params;
    const trip = await Trip.findById(id);

    if (trip === null) {
        console.log('CANNOT FIND TRIP WITH THAT ID')
    } else {
        res.render("trips/edit", {trip})
    }
}

const editAction = async (req, res) => {

    const {id} = req.params;
    const trip = await Trip.findByIdAndUpdate(id, {... req.body.trip}, {runValidators : true, new : true})
    trip.save();

    res.redirect(`${id}`)
}

module.exports = {index, show, createForm, createAction, editForm, editAction}