const express = require('express');
const router = express.Router({mergeParams : true});
const {catchAsyncError, validateReview} = require('../middleware/middleware')

// CONTROLLER   
const review = require('../controllers/review');

// ROUTES 

// POST 
router.post('/', validateReview, catchAsyncError(review.createAction))

// DELETE
router.delete('/:reviewId', catchAsyncError(review.deleteAction))

module.exports = router;