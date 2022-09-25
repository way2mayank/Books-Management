const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')
const moment = require('moment')
const mongoose = require("mongoose")
const {isValid,
	isIsbnValid,
	isValidTitle
} = require('../validation/validation')
const reviewModel = require('../model/reviewModel')

const createBook = async function(req, res) {
	try {
		let data = req.body
		if (Object.keys(data).length == 0) return res.status(400).send({
			status: false,
			message: "please provide data to create book"
		})
		let {title,excerpt,userId,ISBN,category,subcategory,releasedAt} = data

		if (!title) return res.status(400).send({
			status: false,
			message: "title is mendatory"
		})
		if (!isValid(title)) return res.status(400).send({
			status: false,
			message: "please write excerpt in correct way"
		})
		let isTitlePresent = await bookModel.findOne({title})
		if (isTitlePresent) return res.status(400).send({
			status: false,
			message: "Title is already present"
		})


		if (!excerpt) return res.status(400).send({
			status: false,
			message: "excerpt is mendatory"
		})
		if (!isValid(excerpt)) return res.status(400).send({
			status: false,
			message: "please write excerpt in correct way"
		})


		if (!userId) return res.status(400).send({
			status: false,
			message: "userId is mendatory"
		})
		if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({
			status: false,
			message: "invalid userId ..!!"
		})
		const findUser = await userModel.findById(userId)
		if (!findUser) return res.status(404).send({
			status: false,
			message: "user not found ..!!"
		})


		if (!ISBN) return res.status(400).send({
			status: false,
			message: "ISBN is mendatory"
		})
		if (!isValid(ISBN)) return res.status(400).send({
			status: false,
			message: "please write ISBN in correct way"
		})
		if (!isIsbnValid(ISBN)) return res.status(400).send({
			status: false,
			message: "ISBN should be 13 digits only"
		})
		let isISBNPresent = await bookModel.findOne({ISBN})
		if (isISBNPresent) return res.status(400).send({
			status: false,
			message: "ISBN is already present"
		})


		if (!category) return res.status(400).send({
			status: false,
			message: "category is mendatory"
		})
		if (!isValid(category)) return res.status(400).send({
			status: false,
			message: "please write category in correct way"
		})

		if (!subcategory) return res.status(400).send({
			status: false,
			message: "subcategory is mendatory"
		})
		if (!isValid(subcategory)) return res.status(400).send({
			status: false,
			message: "please write subcategory in correct way"
		})

		if (!releasedAt) return res.status(400).send({
			status: false,
			message: "releasedAt is mendatory"
		})
		isValidDate = moment(releasedAt, 'YYYY-MM-DD', true).isValid()
		if (!isValidDate) return res.status(400).send({
			status: false,
			message: "Date shoulb be on this format - YYYY-MM-DD"
		})

		const saveData = await bookModel.create(data)
		return res.status(201).send({
			status: true,
			message: "success",
			data: saveData
		})
	} catch (err) {
		return res.status(500).send({
			status: false,
			message: err.message
		})
	}
}



const getbooks = async function(req, res) {
	try {

		let data = req.query
		let {userId,category,subcategory} = data
		data.isDeleted = false

        let bookdata = await bookModel.find(data).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        if (bookdata.length == 0) return res.status(404).send({ status: false, message: "data not found" })
        bookdata = bookdata.sort(function (a, b) { return a.title.localeCompare(b.title) })
        return res.status(200).send({ status: true, message: "Books List", data: bookdata })

		let bookdata = await bookModel.find(data).select({_id: 1,title: 1,excerpt: 1,userId: 1,category: 1,releasedAt: 1,reviews: 1})
		if (bookdata.length == 0) return res.status(404).send({
			status: false,
			message: "data not found"
		})

		bookdata = bookdata.sort(function(a, b) {
			return a.title.localeCompare(b.title)
		})

		return res.status(200).send({
			status: true,
			message: "success",
			data: bookdata
		})

	} catch (err) {
		return res.status(500).send({
			status: false,
			message: err.message
		})
	}
}

const getbooksbyid = async function(req, res) {
	try {
		let bookId = req.params.bookId

		if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({
			status: false,
			message: "Invilid bookId"
		})

		let book = await bookModel.findOne({
			_id: bookId,
			isDeleted: false,
		})

		if (!book) return res.status(404).send({
			status: false,
			message: "No Books Match With This BookId"
		})

        if (!book) return res.status(404).send({ status: false, message: "No Books Match With This BookId" })
        if(book.reviews === 0)book._doc["reviewsData"] = []

        book._doc['reviewsData'] = reviews
		return res.status(200).send({
			status: true,
			data: book
		})
	} catch (error) {
		return res.status(500).send({
			status: false,
			message: "success",
			meaasge: error.message
		})
	}
}

const updatebook = async function(req, res) {
	try {
		let bookId = req.params.bookId

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "pls provide data to update" })
        let { title, excerpt, releasedAt, ISBN } = data
        console.log(title);
        console.log(data);
        console.log(typeof title);
        console.log(excerpt);
        console.log(releasedAt);
        console.log(ISBN);
        console.log(Object.keys(data)[0]);

        let arr = ["title", "excerpt", "releasedAt", "ISBN"]
        let count = 0
        for(let i=0;i<Object.keys(data).length;i++){
            for(let j=0;j<arr.length;j++){
                if(Object.keys(data)[i]===arr[j])count++
            }
        }
        if(count !== Object.keys(data).length )return res.status(400).send({ status: false, message: "please write correct keys to update" })


		if ( typeof title !== "undefined") {
			if (!isValid(title)) return res.status(400).send({
				status: false,
				message: "please write title in correct way"
			})
			if (!isValidTitle(title)) return res.status(400).send({
				status: false,
				message: "pls write correct title only one space allowed in title"
			})
			let isTitlePresent = await bookModel.findOne({
				title
			})
			if (isTitlePresent) return res.status(400).send({
				status: false,
				message: "Title is already present"
			})
		}

		if (typeof excerpt !== "undefined") {
			if (!isValid(excerpt)) return res.status(400).send({
				status: false,
				message: "please write excerpt in correct way"
			})
		}
		if (typeof ISBN !== "undefined") {
			if (!isValid(ISBN)) return res.status(400).send({
				status: false,
				message: "please write ISBN in correct way"
			})
			if (!isIsbnValid(ISBN)) return res.status(400).send({
				status: false,
				message: "ISBN should be 13 digits only"
			})
			let isISBNPresent = await bookModel.findOne({
				ISBN
			})
			if (isISBNPresent) return res.status(400).send({
				status: false,
				message: "ISBN is already present"
			})
		}
		if (typeof releasedAt !== "undefined") {
			isValidDate = moment(releasedAt, 'YYYY-MM-DD', true).isValid()
			if (!isValidDate) return res.status(400).send({
				status: false,
				message: "please write correct Date, and format of date  - YYYY-MM-DD"
			})
		}


		let updateddata = await bookModel.findByIdAndUpdate({
			_id: bookId
		}, {
			$set: data
		}, {
			new: true
		})
		return res.status(200).send({
			status: true,
			message: "updated successfully",
			data: updateddata
		})
	} catch (error) {
		return res.status(500).send({
			status: false,
			meaasge: error.message
		})
	}
}

const deleteBooks = async function(req, res) {
	try {

		let bookId = req.params.bookId

	
		let check = await bookModel.findOne({
			_id: bookId,
			isDeleted: false
		})
		if (!check) return res.status(404).send({
			status: false,
			message: "Book not found"
		})

		let deletes = await bookModel.findOneAndUpdate({
			_id: bookId
		}, {
			$set: {
				isDeleted: true,
				deletedAt: Date.now()
			}
		}, {
			new: true
		})
		return res.status(200).send({
			status: true,
			message: "Book Deleted Successfully"
		})

	} catch (error) {
		return res.status(500).send({
			status: false,
			message: error.message
		})
	}

}

module.exports = {
	createBook,
	getbooks,
	getbooksbyid,
	updatebook,
	deleteBooks
}