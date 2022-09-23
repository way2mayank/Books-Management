const reviewModel = require("../model/reviewModel")
const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')
const mongoose = require("mongoose")

const createreview = async function (req, res) {

}

const updatereview = async function (req, res) {

}



const deletereview = async function (req, res) {
    try {


        let bookId = req.params.bookId
        let reviewId = req.params.reviewId


        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "please write bookId in correct way" })

        if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "please write reviewId in correct way" })

        let checkBook = await bookModel.findOne({ _id: bookId,   isDeleted:false })

        if (!checkBook)
            return res.status(404).send({ status: false, message: "No book found with this bookId" })

        if (checkBook.reviews <= 0)
            return res.status(400).send({ status: false, message: "No any reviews for this book" })

        let checkReview = await reviewModel.findOne({ _id: reviewId,  bookId:bookId  , isDeleted:false  })

        if (!checkReview)
            return res.status(400).send({ status: false, message: "No review match with this reviewId" })
            let deleteReview= await reviewModel.findOneAndUpdate({_id:reviewId},{$set:{isDeleted:true}},{new:true})

        let deleteBookReview = await bookModel.findByIdAndUpdate(
            { _id: bookId },
            { $inc: { reviews: -1 }},
            { new: true })

        return res.status(200).send({ status: false, message: "review has been deleted successfuly" })




    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createreview, updatereview, deletereview }