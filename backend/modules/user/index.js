const userdm = require('./userdm')
const middleware = require('../middleware/middleware.js')

module.exports = function(app){

    app.post('/login', 
        middleware.validateParameter(["email", "password"]),
        userdm.login
    );
    
    app.post('/login_benchmark', 
        middleware.validateParameter(["email", "password"]),
        userdm.login_benchmark
    );
    
    app.post('/register', 
        middleware.validateParameter(["email", "password"]),
        userdm.register
    );
    
    app.post('/register_benchmark', 
        middleware.validateParameter(["email", "password"]),
        userdm.register_benchmark
    );
    
    app.get('/get_profile',
        middleware.isLoggedIn,
        userdm.getUserProfile
    );
    
    app.post('/get_sensitive_profile',
        middleware.isLoggedIn,
        userdm.getUserProfileSensitive
    );
    
    app.post('/update_non_sensitive',
        middleware.isLoggedIn,
        userdm.updateNonSenstitve,
    );
    
    app.post('/update_sensitive',
        middleware.isLoggedIn,
        userdm.updateSensitive,
    )
}