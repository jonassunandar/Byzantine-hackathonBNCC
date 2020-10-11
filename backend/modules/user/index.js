const userdm = require('./userdm')
const middleware = require('../middleware/middleware.js')

module.exports = function(app){

    app.post('/login', 
        middleware.validateParameter(["email", "password"]),
        userdm.login
    );
    
    app.post('/register', 
        middleware.validateParameter(["email", "password"]),
        userdm.register
    );
    
    app.get('/get_profile/:userid',
        middleware.isLoggedIn,
        userdm.getUserProfile
    );
    
    app.post('/update_non_sensitive',
        middleware.isLoggedIn,
        userdm.updateNonSenstitve,
    );
    
    app.post('/update_sensitive',
        middleware.isLoggedIn,
        userdm.updateNonSenstitve,
    )
}