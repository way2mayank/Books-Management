const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')
const moment = require('moment')
const {isValid,isbnregex} = require('../validation/validation')


const createBook = async function(req,res){
    try{
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data to create book" })
        let {title,excerpt,userId,ISBN,category,subcategory,releasedAt } = data

        if (!title) return res.status(400).send({ status: false, message: "title is mendatory" })
        if (!isValid(title)) return res.status(400).send({ status: false, message: "please write title in correct way" })
        let isTitlePresent = await bookModel.findOne({title})
        if (isTitlePresent) return res.status(400).send({ status: false, message: "Title is already present" })


        if (!excerpt) return res.status(400).send({ status: false, message: "excerpt is mendatory" })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "please write excerpt in correct way" })


        if (!userId) return res.status(400).send({ status: false, message: "userId is mendatory" })
        if (!isValid(userId)) return res.status(400).send({ status: false, message: "please write userId in correct way" })
        const findUser = await userModel.findById(userId)
        if (!findUser) return res.status(404).send({ status: false, message: "user not found ..!!" })


        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is mendatory" })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "please write ISBN in correct way" })
        if (!isbnregex(ISBN)) return res.status(400).send({ status: false, message: "ISBN should be 13 digits only" })
        let isISBNPresent = await bookModel.findOne({ISBN})
        if (isISBNPresent) return res.status(400).send({ status: false, message: "ISBN is already present" })


        if (!category) return res.status(400).send({ status: false, message: "category is mendatory" })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "please write category in correct way" })

        if (!subcategory) return res.status(400).send({ status: false, message: "subcategory is mendatory" })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "please write subcategory in correct way" })

        if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt is mendatory" })
        if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: "please write releasedAt in correct way" })

        isValidDate = moment(releasedAt ,'YYYY-MM-DD',true).isValid()
        if (!isValidDate) return res.status(400).send({ status: false, message: "Date shoulb be on this format - YYYY-MM-DD" })
        
        const saveData = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "success", data: saveData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



const getbooks = async function (req, res) {
    try {

        let data = req.query
        let { userId, category, subcategory } = data
        data.isDeleted = false
        if (category === "") return res.status(400).send({ status: false, message: "please enter category value" })
        if (subcategory === "") return res.status(400).send({ status: false, message: "please enter subcategory value" })
        if (userId === "")return res.status(400).send({ status: false, message: "please enter userID value" })
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(data.userId)) return res.status(400).send({ status: false, message: "enter correct userid" })
        }

        let bookdata = await bookModel.find(data).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        if (bookdata.length == 0) return res.status(404).send({ status: false, message: "data not found" })
        bookdata = bookdata.sort(function (a, b) { return a.title.localeCompare(b.title) })
        return res.status(200).send({ status: true, message: "success", data: bookdata })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getbooksbyid= async function(req,res){
    try {
       let bookId= req.params.bookId
   
       if(!bookId) return res.status(400).send({status:false,message:"Please Use BookId To Fetch Detail"})
   
       if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "Invilid bookId" })
   
       let book= await bookModel.findOne({_id:bookId, isDeleted:false, })
   
       if(!book) return res.status(404).send({status:false, message:"No Books Match With This BookId"})
   
       res.status(200).send({status:true, data:book})
   } 
   catch (error) {
       res.status(500).send({status:false, meaasge:error.message})
   }
   }

module.exports = { createBook, getbooks ,getbooksbyid}


