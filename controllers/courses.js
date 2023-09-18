const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get All Courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = Course.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            message: "courses fetched successfully",
            count: courses.length,
            data: courses
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await (await Course.findById(req.params.id)).populate(
        {
            path: 'bootcamp',
            select: 'name description'
        }
    );
    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        message: "course fetched successfully",
        data: course
    })
})

// @desc    Add course
// @route   POST /api/v1/bootcamp/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404));
    }
    if (!req.user) {
        return next(new ErrorResponse(`Not authorized to add a course`, 401));
    }
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401));
    }
    if (!(await isAdminOrOwner(bootcamp)))
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401));

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        message: "course added successfully",
        data: course
    })
})

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        message: "course updated successfully",
        data: course
    });
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    }
    await course.remove();
    res.status(200).json({
        success: true,
        message: "course deleted successfully",
        data: {}
    });
});
