// VARIABLES 
const Trip = require('../models/trip');
const CustomError = require('../utils/CustomError')

// FUNCTIONS 

// INDEX 
const index = async (req, res, next) => {
    const trips = await Trip.find({})
        .catch(() => {new CustomError("No products found!", 404)});
    res.render("trips/index", {trips})
}

// SHOW
const show = async (req, res, next) => {
    const {id} = req.params;
    const trip = await Trip.findById(id).populate('reviews')
        .catch(() => {throw new CustomError("Cannot find product!", 404)});
    if (trip === null) {
        req.flash('error', 'Cannot find specified trip!');
        res.redirect('/trips')
    }
    res.render("trips/show", {trip})
    // res.redirect('/trips');
}

// CREATE 
const createForm = async (req, res) => {
    res.render("trips/new")
}

const createAction = async (req, res) => {
    const newTrip = new Trip(req.body.trip);
    await newTrip.save();

    // res.send(req.body.trip)
    req.flash('success', 'Added your new trip!')
    res.redirect(`/trips`)
}

// EDIT
const editForm = async (req, res) => {
    const {id} = req.params;
    const trip = await Trip.findById(id);

    if (trip === null) {
        req.flash('error', 'Cannot find that trip!')
        res.redirect(`/trips`)
    } 
    res.render("trips/edit", {trip})
}

const editAction = async (req, res) => {

    const {id} = req.params;
    const trip = await Trip.findByIdAndUpdate(id, {... req.body.trip}, {runValidators : true, new : true})
    trip.save();

    req.flash('success', 'Updated your trip!')
    res.redirect(`${id}`)
}

// DELETE
const deleteAction = async (req, res) => {
    const {id} = req.params;
    await Trip.findByIdAndDelete(id);
    req.flash('success', 'Deleted your trip!')
    res.redirect('/trips')
}

module.exports = {index, show, createForm, createAction, editForm, editAction, deleteAction}