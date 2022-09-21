const express = require('express')
const router = express.Router()
const {createuser,login} = require("../controller/userController")
const {authentication,authorisation} = require("../middleware/auth")
const {createBook,getbooks,getbooksbyid} = require('../controller/bookController')

router.post('/register',createuser)
router.post('/login',login)
router.post('/books',createBook)
router.get('/books',getbooks)
router.get('/books/:bookId',getbooksbyid)

module.exports = router