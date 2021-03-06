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
    var token = req.header("Login-Token")
    jwt.verify(token, global.JWT_SECRET,(err, results) => {
        if (err)
            return res.status(401).json({
                "error": err,
            })
            req.user = {
                "id": results.userid,
                "email": results.email
            }
            next()
        })
}

module.exports = {
    validateParameter,
    isLoggedIn,
}
