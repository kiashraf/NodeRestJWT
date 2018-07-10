let jwt = require('jsonwebtoken');
let config = require('../config/config');



function VerifyToken(req, res, next) {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(201).json({ auth: false, msg: 'No Token provided, unable to verify' });
    }

    jwt.verify(token, config.secret, (err, decoded) => {

        if (err)
            return res.status(201).json({ auth: false, msg: 'Token Not Valid' });

        req.userId = decoded.id;
        next()

    });

}

function GenerateToken(user) {

    return jwt.sign({ id: user._id }, config.secret, { expiresIn: 3600 })

}


module.exports = { VerifyToken, GenerateToken };