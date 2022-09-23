const reviewModel = require("../model/reviewModel")
const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')
const mongoose = require("mongoose")
const moment = require("moment")

const { isValid, regname } = require("../validation/validation")

const createreview = async function (req, res) {
    try {
        let data = req.body
        let id = req.params.bookId
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ status: false, message: "enter correct bookid in params" })
        let bookdata = await bookModel.findOne({ _id:id, isDeleted: false })
        if (!bookdata) return res.status(404).send({ status: false, message: "book with this id is not present" })

        let {bookId,reviewedBy,reviewedAt,rating,review} = data

        if (!bookId) { data.bookId = id }
        if(id !== bookId)return res.status(400).send({ status: false, message: "bookid from params and body are different" })
        // if(!reviewedBy){data.reviewedBy = 'Guest'}

        // if (!mongoose.Types.ObjectId.isValid(data.bookId)) return res.status(400).send({ status: false, message: "enter correct userid" })
console.log(typeof rating);
//------------------------------------------reviewedby validation---------------------------------------------------

if(reviewedBy){
    if(!isValid(reviewedBy))return res.status(400).send({status:false,message:"please write in a correct format"})
    if(!regname(reviewedBy))return res.status(400).send({status:false,message:"in name only one space allowed"})
}

//------------------------------------------REVIEWDAT VALIDATION----------------------------------------------------

if(!reviewedAt) return res.status(400).send({status:false,message:"reviewedAt is mandatory"})
    isValidDate = moment(reviewedAt, 'YYYY-MM-DD', true).isValid()
    if (!isValidDate) return res.status(400).send({ status: false, message: "Date shoulb be on this format - YYYY-MM-DD" })

// ---------------------------------------------RATING VALIDATION---------------------------------------------------

if(!rating) return res.status(400).send({status:false,message:"rating is mandatory"})
if(typeof rating !== "number") return res.status(400).send({status:false,message:"rating must be a number"})
if(!/^[1-5]{1}$/.test(rating))return res.status(400).send({status:false,message:"rating must be a integer between 1 to 5"})

// ---------------------------------REVIEW VALIDATION-------------------------------------------------------------

if(!isValid(review))return res.status(400).send({status:false,message:"please write review in a correct format "})

        let createreview = await reviewModel.create(data)
        let reviewdata = await reviewModel.find({bookId})
        let updatebook = await bookModel.findOneAndUpdate(
            {_id:id},
            {$inc:{reviews:1},$set:{reviewedAt:Date.now()}},
            {new:true}
        )
        updatebook._doc['reviewsdata'] = reviewdata
        return res.status(201).send({ status: true, message: 'success', data: updatebook })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updatereview = async function (req, res) {


}

const deletereview = async function (req, res) {


}

module.exports = { createreview, updatereview, deletereview }