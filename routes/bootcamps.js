const express = require("express");
const router = express.Router();
const { getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const courseRouter = require('./courses');
// const reviewRouter = require('./reviews');
router
    .use('/:bootcampId/courses', courseRouter);
// .use('/:bootcampId/reviews', reviewRouter);

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

module.exports = router;