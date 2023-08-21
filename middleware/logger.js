const logger = function (req, res, next) {
    console.log('logging')
    next()
}

module.exports = logger;