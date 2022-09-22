const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bookModel = require('../model/bookModel')

const authentication = async function(req, res, next) {

    try {
        let token = req.headers[`x-api-key`];

        if (!token)
            return res
                .status(404)
                .send({
                    status: false,
                    msg: "token must be present"
                });
                try{
        let decodedToken = jwt.verify(
            token,
            "secretkey"
        )
        req.token = decodedToken;
        next();
                }catch(err){
                    return res.status(401).send({
                        status: false,
                        msg: err.message
                    });
                }



    } catch (err) {
        return res.status(500).send({
            status: false,
            msg: err.message
        });
    }

}

const authorisation = async function(req, res, next) {

    try {
        let bookId = req.params.bookId;
        if (!bookId) {
            return res.status(400).send({
                status: false,
                msg: "provide bookId"
            });
        }

        if (bookId) {
            if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({
                status: false,
                message: "enter correct bookId"
            })
        }
        bookId.isDeleted = false
        let book = await bookModel.findOne({bookId});
        if (!book) {
            return res.status(404).send({
                status: false,
                msg: "book not found"
            });
        }
        if (book.userId != req.token.userId) {
            return res.status(403).send({
                status: false,
                msg: "Permission denied"
            });
        }
        next();
    } catch (err) {
        return res.status(500).send({
            status: false,
            msg: err.message
        });
    }
}


module.exports = {
    authentication,
    authorisation
}