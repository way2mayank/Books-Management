const express = require('express')
const router = express.Router()
const { createuser,login } = require("../controller/userController")
const { authentication,authorisation,authorisation2 } = require("../middleware/auth")
const { createBook,getbooks,getbooksbyid,updatebook,deleteBooks } = require('../controller/bookController')
const { createreview,updatereview,deletereview } = require("../controller/reviewController")



//=====================================USER API=========================================
router.post('/register',createuser)
router.post('/login',login)

//=====================================BOOK API=========================================
router.post('/books',authentication,authorisation2,createBook)
router.get('/books',authentication,getbooks)
router.get('/books/:bookId',authentication,getbooksbyid)
router.put('/books/:bookId',authentication, authorisation,updatebook)
router.delete('/books/:bookId',authentication, authorisation,deleteBooks)

//=====================================REVIEW API=========================================
router.post('/books/:bookId/review',createreview)
router.put('/books/:bookId/review/:reviewId',updatereview)
router.delete('/books/:bookId/review/:reviewId',deletereview)




router.post("/write-file-aws", )



module.exports = router