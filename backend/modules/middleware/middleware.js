const jwt = require('jsonwebtoken')

const validateParameter = (requiredField) => {
    return (req, res, next) => {
        var isValid = true
        requiredField.forEach(function(field){
            if(!req.body.hasOwnProperty(field)){
               isValid = false
            }
        })
        
        if(isValid)next()
        else res.json({
            "error": "invalid parameters"
        })
    }
    
}

const isLoggedIn = (req, res, next) => {
    var token = req.headers("Login-Token")
    jwt.verify(token, global.JWT_SECRET)
        .then((results) => {
            next()
        }).catch((err) => {
            res.status(401).json({
                "error": err,
            })
        })
}

module.exports = {
    validateParameter,
    isLoggedIn,
}
