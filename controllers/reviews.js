const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = Review.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            message: "reviews fetched successfully",
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await (await Review.findById(req.params.id)).populate(
        {
            path: 'bootcamp',
            select: 'name description'
        }
    );
    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        message: "review fetched successfully",
        data: review
    })
})

// @desc    Add review
// @route   POST /api/v1/bootcamp/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404));
    }
    if (!req.user) {
        return next(new ErrorResponse(`Not authorized to add a review`, 401));
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a review to bootcamp ${bootcamp._id}`, 401));
    }
    if (!(await isAdminOrOwner(bootcamp))) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a review to bootcamp ${bootcamp._id}`, 401));
    }
    const review = await Review.create(req.body);
    res.status(201).json({
        success: true,
        message: "review created successfully",
        data: review
    })
})

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );
    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }
    if (!req.user) {
        return next(new ErrorResponse(`Not authorized to update a review`, 401));
    }
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update review ${review._id}`, 401));
    }
    if (!(await isAdminOrOwner(review))) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update review ${review._id}`, 401));
    }
    res.status(200).json({
        success: true,
        message: "review updated successfully",
        data: review
    });
})

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }
    if (!req.user) {
        return next(new ErrorResponse(`Not authorized to delete a review`, 401));
    }
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete review ${review._id}`, 401));
    }
    if (!(await isAdminOrOwner(review))) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete review ${review._id}`, 401));
    }
    await review.remove();
    res.status(200).json({
        success: true,
        message: "review deleted successfully",
        data: review
    })
})
