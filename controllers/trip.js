// VARIABLES 
const Trip = require('../models/trip');
const CustomError = require('../utils/CustomError')
const {cloudinary} = require('../cloudinary')
const mbxGeo = require('@mapbox/mapbox-sdk/services/geocoding')
const geoCode = mbxGeo({accessToken : process.env.MAPBOX_TOKEN})


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
    const trip = await Trip.findById(id).populate({
        path : 'reviews',
        populate : {
            path : 'rider'
        }
    })
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

    const geoData = await geoCode.forwardGeocode({
        query : newTrip.location,
        limit : 1
    }).send()

    newTrip.geometry = geoData.body.features[0].geometry;

    newTrip.rider = req.user._id;
    newTrip.img = req.files.map(file => ({url : file.path, filename : file.filename}))
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
    const images = req.files.map( file => ({url : file.path, filename : file.filename}) )
    trip.img.push(...images)
    await trip.save();

    if (req.body.deletedImg) {
        for (let img of req.body.deletedImg) {
            await cloudinary.uploader.destroy(img)
                .catch(() => {console.log("Image does not exist!")})
        }
        await trip.updateOne({$pull : {img : { filename: { $in : req.body. deletedImg}}}})
    }

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