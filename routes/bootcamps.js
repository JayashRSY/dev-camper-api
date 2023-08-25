const express = require("express");
const router = express.Router();
const { getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius } = require('../controllers/bootcamps');

// Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');
router
    .use('/:bootcampId/courses', courseRouter)
    .use('/:bootcampId/reviews', reviewRouter);

router.route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

module.exports = router;