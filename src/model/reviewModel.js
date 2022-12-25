const { default: mongoose } = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId


const reviewschema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: 'book',
        required: true
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest'
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        // min:1,max:5
    },
    review: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

module.exports = mongoose.model('review', reviewschema)