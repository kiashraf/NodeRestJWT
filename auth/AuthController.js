var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/config');

let VerifyToken = require('./VerifyToken');

router.post('/register', function (req, res, next) {

    if (req.body.email && req.body.password) {
        let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }, (err, user) => {

            if (err)
                return res.json('Unable to register new User!!')

            let token = VerifyToken.GenerateToken(user);
            res.status(200).send({ auth: true, token: token, user: user });

        })


    } else {
        return res.json('Unable to register new user!!');
    }
})


router.get('/myHome', VerifyToken.VerifyToken, (req, res, next) => {

    User.findById(req.userId, { password: 0 }, (err, model) => {
        if (err)
            return res.status(201).json('Unable to find the User');

        return res.status(200).json(model);

    })

})


router.post('/login', (req, res, next) => {

    let email = req.body.email;

    if (email && req.body.password) {

        User.findOne({ email: email }, (err, user) => {
            if (err)
                return res.send(201).json('Email is incorrect');
            let passwordMatch = bcrypt.compareSync(req.body.password, user.password);

            if (passwordMatch) {

                let token = VerifyToken.GenerateToken(user);

                res.status(200).json({ auth: true, user: user, token: token })

            }

        })


    }



})



module.exports = router;