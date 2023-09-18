const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'], // This is a validator
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String, // This is a validator
    description: {
        type: String,
        required: [true, 'Please add a description'], // This is a validator
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    website: {
        type: String,
        match: [ // This is a validator
            /^((http|https):\/\/)?(www.)?(\w+)(\.\w+)(\/\w+)?$/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [ // This is a validator
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please use a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address'], // This is a validator
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'], // This is a validator
        },
        coordinates: {
            type: [Number],
            index: '2dsphere' // This is a validator
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        // Array of strings
        type: [String],
        required: true,
        enum: [ // This is a validator
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: { // This is a validator
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10'],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: { // This is a validator
        type: Boolean,
        default: false
    },
    jobAssistance: { // This is a validator
        type: Boolean,
        default: false
    },
    jobGuarantee: { // This is a validator
        type: Boolean,
        default: false
    },
    acceptGi: { // This is a validator
        type: Boolean,
        default: false
    },
    createdAt: { // This is a validator
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true // This is a validator
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create bootcamp slug from the name
BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    });
    next();
});
// Geocoder & create location field
BootcampSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
    // Do not save address in DB
    this.address = undefined;
    next();
});

// Cascade delete course
BootcampSchema.pre('remove', async function (next) {
    console.log(`Courses being removed from bootcamp ${this._id}`);
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
})

// Reverse populate with virtuals
BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false // This is a validator
})

module.exports = mongoose.model('Bootcamp', BootcampSchema);