const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')
const createBook = async function(req,res){

    try{
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data to create book" })
        let {title,excerpt,userId,ISBN,category,subcategory,releaseAt } = data

        if (!title) return res.status(400).send({ status: false, message: "title is mendatory" })
        if (!isvalid(title)) return res.status(400).send({ status: false, message: "please write title in correct way" })

        if (!excerpt) return res.status(400).send({ status: false, message: "excerpt is mendatory" })
        if (!isvalid(excerpt)) return res.status(400).send({ status: false, message: "please write excerpt in correct way" })

        
        if (!userId) return res.status(400).send({ status: false, message: "userId is mendatory" })
        if (!isvalid(userId)) return res.status(400).send({ status: false, message: "please write userId in correct way" })
        const findUser = await userModel.findById(userId)
        if(!findUser)return res.status(404).send({ status: false, message: "user not found ..!!" })


        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is mendatory" })
        if (!isvalid(ISBN)) return res.status(400).send({ status: false, message: "please write ISBN in correct way" })

        if (!category) return res.status(400).send({ status: false, message: "category is mendatory" })
        if (!isvalid(category)) return res.status(400).send({ status: false, message: "please write category in correct way" })
        
        if (!subcategory) return res.status(400).send({ status: false, message: "subcategory is mendatory" })
        if (!isvalid(subcategory)) return res.status(400).send({ status: false, message: "please write subcategory in correct way" })

        if (!releaseAt) return res.status(400).send({ status: false, message: "releaseAt is mendatory" })
        if (!isvalid(releaseAt)) return res.status(400).send({ status: false, message: "please write releaseAt in correct way" })
        
        const saveData = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "success" , data : saveData })
    }
    catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports ={createBook}