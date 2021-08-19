const express = require('express');
const router = express();

// CONTROLLER   
const trip = require('../controllers/trip');

// ROUTES 

// INDEX & POST 
router.route('/')
    .get(trip.index) 
    .post(trip.createAction)

// CREATE
router.route('/new').get(trip.createForm)

// SHOW & PATCH
router.route('/:id')
    .get(trip.show)
    .patch(trip.editAction)

// EDIT 
router.route("/:id/edit").get(trip.editForm)


module.exports = router