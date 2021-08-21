const express = require('express');
const router = express.Router({mergeParams : true});
const {catchAsyncError, validateReview, authenLogin} = require('../middleware/middleware')

// CONTROLLER   
const review = require('../controllers/review');

// ROUTES 

// POST 
router.post('/', authenLogin,validateReview, catchAsyncError(review.createAction))

// DELETE
router.delete('/:reviewId', authenLogin, catchAsyncError(review.deleteAction))

module.exports = router;