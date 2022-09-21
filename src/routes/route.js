const express = require('express')
const router = express.Router()
const {createuser,login} = require("../controller/userController")
const {authentication,authorisation} = require("../middleware/auth")

router.post('/register',createuser)
router.post('/login',login)
router.post('/')

module.exports = router