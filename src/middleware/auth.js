const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bookModel = require('../model/bookModel')

const authentication = async function (req, res, next) {

    try {
        let token = req.headers[`x-api-key`];

        if (!token) return res.status(400).send({
            status: false,
            message: "token must be present"
        });

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "secretkey")
        } catch (err) {
            return res.status(401).send({
                status: false,
                message: err.message
            });
        }
        req.token = decodedToken;
        next();
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        });
    }

}

const authorisation = async function (req, res, next) {

    try {
        let bookId = req.params.bookId;
        if (!bookId) {
            return res.status(400).send({
                status: false,
                message: "provide bookId"
            });
        }
        if (bookId) {
            if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({
                status: false,
                message: "Invalid bookId"
            })
        }
        let book = await bookModel.findOne({
            _id: bookId,
            isDeleted: false
        });
        if (!book) {
            return res.status(404).send({
                status: false,
                message: "book not found"
            })
        }
        if (book.userId != req.token.userId) {
            return res.status(403).send({
                status: false,
                message: "Permission denied"
            })
        }
        next();
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

const authorisation2 = async function (req, res, next) {
    try {
        let userId = req.body.userId
        if (!userId) return res.status(400).send({
            status: false,
            message: "userId is mendatory"
        })
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({
            status: false,
            message: "please write valid userId"
        })

        if (req.token.userId !== userId) return res.status(403).send({
            status: false,
            message: "unauthorized or permission denied"
        })
        next()
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}
module.exports = {
    authentication,
    authorisation,
    authorisation2
}