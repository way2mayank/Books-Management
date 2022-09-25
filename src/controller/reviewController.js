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
            {$inc:{reviews:1}},
            {new:true}
        )
        updatebook._doc['reviewsdata'] = reviewdata
        return res.status(201).send({ status: true, message: 'success', data: updatebook })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const updatereview  = async function(req,res){
    try{
        const bookId = req.params.bookId
            if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "enter correct bookid" })
        
        const rId = req.params.reviewId
            if (!mongoose.Types.ObjectId.isValid(rId)) return res.status(400).send({ status: false, message: "enter correct reviewid" })

            const book = await bookModel.findOne({_id:bookId , isDeleted:false})
            if (!book) return res.status(404).send({ status: false, message: "book not found" })          
            
          const reviewId = await reviewModel.findOne({_id:rId ,bookId : bookId, isDeleted:false})
          if (!reviewId) return res.status(404).send({ status: false, message: "review not found" })
        
        const data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data to update reveiw" })
    
        const {reviewedBy,rating,review} =data
    
        if (reviewedBy) {
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "please write name in correct way" })
            if (!regname(reviewedBy)) return res.status(400).send({ status: false, message: "pls write correct name only one space allowed in title" })
        }
if(rating){
if(typeof rating !== "number") return res.status(400).send({status:false,message:"rating must be a number"})
if(!/^[1-5]{1}$/.test(rating))return res.status(400).send({status:false,message:"rating must be a integer between 1 to 5"})
}
        // if ((typeof rating != "Number")) {
        //     if (!isValid(rating)) return res.status(400).send({ status: false, message: "please write rating in correct way" })
        //     if(rating < 1 || rating >5){
        //         return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })
        //     } 
        // }
        if (review){
            if (!isValid(review)) return res.status(400).send({ status: false, message: "please write review in correct way" })
        }
    
        const u_review = await reviewModel.findOneAndUpdate({_id : reviewId},{$set :data },{new:true})
        const reviews = await reviewModel.find({bookId})
        console.log(book)
        book._doc['reviewsData']=reviews
    
        return res.status(200).send({ status: true, message: "updated successfully", data: book})
    }catch(error){
        return res.status(500).send({ status: false, meaasge: error.message })
    }
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