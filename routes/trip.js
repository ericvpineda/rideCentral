const express = require('express');
const router = express();
const {catchAsyncError, validateTrip, authenLogin, authorizeRider} = require('../middleware/middleware')

// CONTROLLER   
const trip = require('../controllers/trip');

// ROUTES 

// INDEX & POST 
router.route('/')
    .get(catchAsyncError(trip.index)) 
    .post(authenLogin, validateTrip, catchAsyncError(trip.createAction))

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