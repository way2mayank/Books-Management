const express = require('express')
const router = express.Router()
const {createuser,login} = require("../controller/userController")

router.post('/register',createuser)
router.post('/login',login)

module.exports = router