const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')
const moment = require('moment')
const {isvalid,isbnregex} = require('../validation/validation')
const createBook = async function(req,res){

    try{
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data to create book" })
        let {title,excerpt,userId,ISBN,category,subcategory,releasedAt } = data

        if (!title) return res.status(400).send({ status: false, message: "title is mendatory" })
        if (!isvalid(title)) return res.status(400).send({ status: false, message: "please write title in correct way" })
        let isTitlePresent = await bookModel.findOne({title})
        if (isTitlePresent) return res.status(400).send({ status: false, message: "Title is already present" })


        if (!excerpt) return res.status(400).send({ status: false, message: "excerpt is mendatory" })
        if (!isvalid(excerpt)) return res.status(400).send({ status: false, message: "please write excerpt in correct way" })

        
        if (!userId) return res.status(400).send({ status: false, message: "userId is mendatory" })
        if (!isvalid(userId)) return res.status(400).send({ status: false, message: "please write userId in correct way" })
        const findUser = await userModel.findById(userId)
        if(!findUser)return res.status(404).send({ status: false, message: "user not found ..!!" })


        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is mendatory" })
        if (!isvalid(ISBN)) return res.status(400).send({ status: false, message: "please write ISBN in correct way" })
        if (!isbnregex(ISBN)) return res.status(400).send({ status: false, message: "ISBN should be 13 digits only" })
        let isISBNPresent = await bookModel.findOne({ISBN})
        if (isISBNPresent) return res.status(400).send({ status: false, message: "ISBN is already present" })


        if (!category) return res.status(400).send({ status: false, message: "category is mendatory" })
        if (!isvalid(category)) return res.status(400).send({ status: false, message: "please write category in correct way" })
        
        if (!subcategory) return res.status(400).send({ status: false, message: "subcategory is mendatory" })
        if (!isvalid(subcategory)) return res.status(400).send({ status: false, message: "please write subcategory in correct way" })

        if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt is mendatory" })
        if (!isvalid(releasedAt)) return res.status(400).send({ status: false, message: "please write releasedAt in correct way" })

        isValidDate = moment(releasedAt ,'YYYY-MM-DD',true).isValid()
        if (!isValidDate) return res.status(400).send({ status: false, message: "Date shoulb be on this format - YYYY-MM-DD" })
        
        const saveData = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "success" , data : saveData })
    }
    catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports ={createBook}