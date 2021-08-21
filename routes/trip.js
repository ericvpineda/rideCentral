const express = require('express');
const router = express();
const {catchAsyncError, validateTrip, authenLogin, authorizeRider} = require('../middleware/middleware')
const multer = require('multer')
const {store} = require('../cloudinary')

var upload = multer({ storage : store})

// CONTROLLER   
const trip = require('../controllers/trip');

// ROUTES 

// INDEX & POST 
router.route('/')
    .get(catchAsyncError(trip.index)) 
    .post(authenLogin, upload.array('image'), validateTrip, catchAsyncError(trip.createAction))

// CREATE
router.route('/new')
    .get(authenLogin, catchAsyncError(trip.createForm))

// SHOW & PATCH
router.route('/:id')
    .get(catchAsyncError(trip.show))
    .patch(authenLogin, authorizeRider, validateTrip, catchAsyncError(trip.editAction))
    .delete(authenLogin, authorizeRider, catchAsyncError(trip.deleteAction))

// EDIT 
router.route("/:id/edit").get(authorizeRider, trip.editForm)


module.exports = router