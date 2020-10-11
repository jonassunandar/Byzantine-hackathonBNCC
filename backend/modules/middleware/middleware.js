
const validateParameter = (requiredField) => {
    return async (req, res, next) => {
        var isValid = true
        await requiredField.forEach(function(field){
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

module.exports = {
    validateParameter
}