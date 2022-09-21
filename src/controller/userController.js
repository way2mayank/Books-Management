const usermodel = require("../model/userModel")
const jwt = require("jsonwebtoken")
const { isValid, regname, phoneregex, emailregex, passregex, enumvalid } = require("../validation/validation")
const createuser = async function (req, res) {
    try {

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data to create user" })
        let { title, name, phone, email, password, address } = data

//-----------------------------------------TITLE VALIDATIONS--------------------------------------------------------
        if (!title) return res.status(400).send({ status: false, message: "title is mendatory" })
        if (!enumvalid(title)) return res.status(400).send({ status: false, message: `only possible value of title is ['Mr', 'Mrs', 'Miss']` })

//-----------------------------------------NAME VALIDATIONS---------------------------------------------------------

        if (!name) return res.status(400).send({ status: false, message: "name is mendatory" })
        if (!isValid(name)) return res.status(400).send({ status: false, message: "please write name in correct way" })
        if (!regname(name)) return res.status(400).send({ status: false, message: "pls write correct name only one space allowed in name" })
        data.name = name.trim()

//-----------------------------------------PHONE VALIDATIONS--------------------------------------------------------

        if (!phone) return res.status(400).send({ status: false, message: "phone no is mendatory" })
        if (!isValid(phone)) return res.status(400).send({ status: false, message: "please write phone no. in correct way give in string" })
        if (!phoneregex(phone)) return res.status(400).send({ status: false, message: "allow 10 digit start with[6-9]" })
        let uphone = await usermodel.findOne({ phone: phone })
        if (uphone) return res.status(400).send({ status: false, message: `this ${phone} no. already present` })

//-----------------------------------------EMAIL VALIDATIONS--------------------------------------------------------

        if (!email) return res.status(400).send({ status: false, message: "email is mendatory" })
        if (!isValid(email)) return res.status(400).send({ status: false, message: "please write email in correct way give in string" })
        if (!emailregex(email)) return res.status(400).send({ status: false, message: "email format is wrong" })
        let uemail = await usermodel.findOne({ email: email })
        if (uemail) return res.status(400).send({ status: false, message: `this emailid ${email} is already present` })
//-----------------------------------------PASSWORD VALIDATIONS-----------------------------------------------------

        if (!password) return res.status(400).send({ status: false, message: "password is mendatory" })
        if (!isValid(password)) return res.status(400).send({ status: false, message: "please write password in correct way give in string" })
        if (!passregex(password)) return res.status(400).send({ status: false, message: "password must have one capital,one small,one numeric and one special character #$^+=!*()@%& and length 8-15" })

//-----------------------------------------ADDRESS VALIDATIONS------------------------------------------------------

        if (address) {
            if (address.street && !isValid(address.street)) return res.status(400).send({ status: false, message: "enter street in string type" })
            if (address.city && !isValid(address.city)) return res.status(400).send({ status: false, message: "enter city in string type" })
            if (address.pincode && !isValid(address.pincode)) return res.status(400).send({ status: false, message: "enter pincode in string type" })
        }
//-----------------------------------------USER CREATION---------------------------------------------------------

        const user = await usermodel.create(data)
        return res.status(201).send({ status: true, message: 'success', data: { user } })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const login = async function (req, res) {
    try {

        // let { email, password } = req.body

        // if (!email) return res.status(400).send({ status: false, message: "please provide email" })

        // if (!password) return res.status(400).send({ status: false, message: "please provide password" })

        // let user = await usermodel.findOne({ email: email, password: password })
        // if (!user) return res.status(404).send({ status: false, message: "data not found,email or password is wrong" })

        const details = req.body;

    if(Object.keys(details).length < 1){
        return res.status(400).send({ status: false, message: "plz provide data in body ..!!" })   
    }

    const {email , password}=details;

    if(!isValid(email)){
        return res.status(400).send({ status: false, message: "email is required..!!" })
    }
    if(!emailregex(email)){
        return res.status(400).send({ status: false, message: "invalid email ...!!!" })
    }
    const user = await usermodel.findOne({email});
    if(!user){
        return res.status(404).send({ status: false, message: "user not found...!!!" })
    }

    if(!isValid(password)){
        return res.status(400).send({ status: false, message: "password is required..!!" })
    }
    if(!(password.length >= 8) && password.length <= 15){
        return res.status(400).send({ status: false, message: "The password length must in between 8 to 15 letters" })
    }
    if(user.password != password){
        return res.status(400).send({ status: false, message: "this password is not matching with your email id" })
    }

        let time = (Date.now() / 1000) + 60*60*24  

        let token = jwt.sign({
            userId: user._id.toString(),
            exp: time
        }, "secretkey")

        return res.status(200).send({ status: true, message: 'success', data: { token } })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}

module.exports = { createuser, login }
