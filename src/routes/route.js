const express = require('express')
const router = express.Router()
const {createuser,login} = require("../controller/userController")
const {authentication,authorisation} = require("../middleware/auth")
const {createBook,getbooks,getbooksbyid,updatebook} = require('../controller/bookController')

router.post('/register',createuser)
router.post('/login',login)
router.post('/books',authentication, authorisation ,createBook)
router.get('/books',authentication,getbooks)
router.get('/books/:bookId',getbooksbyid)
router.put('/books/:bookId',updatebook)
module.exports = router