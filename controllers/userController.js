const User = require('../models/user');

const user_login_get = (req, res) => {
    res.render('login', {title: 'Login', errorMessage: '' });
};

const user_login_post = (req, res) => {
    const loginRequest = req.body;
    
    User.findOne({ username: loginRequest.username }, function(err, user) {
        if (err) throw err;
        if (user) {
            user.comparePassword(loginRequest.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch){
                    
                    // store user information in session
                    req.session.userid = loginRequest.username;
                    console.log(req.session);

                    res.redirect('../');
                }else {
                    res.render('login', {title: 'Login', errorMessage: 'Invalid Password' })
                }
            });
        } else {
            res.render('login', {title: 'Login', errorMessage: 'Invalid Username' })
        }
    });
};

// clear user from session object and save
// ensures re-using session id will not have logged in user
const user_logout = (req, res) => {
    req.session.user = null;
    req.session.save((err) => {
        if (err) {
            next(err)
        }
        req.session.regenerate((err) => {
            if (err) {
                next(err)
            }
            res.redirect('../')
        });
    });
};

const user_register_get = (req, res) => {
    res.render('register', {title: 'Register', errorMessage: ''})
};

const user_register_post = (req, res) => {
    const registerRequest = req.body;
    // Catch password not matching confirm password
    if (registerRequest['password'] !== registerRequest['confirm']){
         return res.render('register', {title: 'Register', errorMessage: `Passwords do not match`});
    }
    const user = new User({ username: registerRequest['username'], email: registerRequest['email'], password: registerRequest['password'] })
    user.save()
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            // Catch password not matching confirm password
            if (registerRequest['password'] !== registerRequest['confirm']){
                res.render('register', {title: 'Register', errorMessage: `Passwords do not match`});
            }

            switch (err.name){
                // Use error message to differentiate which form field was invalid
                // format 'User validation failed: {field}: is invalid'
                case 'ValidationError':
                    let message = err.message;
                    let error_field = message.split(": ")[1];
                    switch (error_field){
                        case 'email':
                            res.render('register', {title: 'Register', errorMessage: `Invalid email`});
                            break;
                        case 'username':
                            res.render('register', {title: 'Register', errorMessage: `Invalid username`});
                            break;
                        default:
                            res.render('register', {title: 'Register', errorMessage: `Invalid entry. Unknown field`});
                    }
                    break;

                // Attempting to use a non-unique email or username will throw a MongoError
                // Use keyValue to determine the field that caused the error
                case 'MongoError':
                    let errorCode = err.keyValue;
                    let errorKey = Object.keys(errorCode)[0];
                    switch (errorKey) {
                        case 'email':
                            res.render('register', {title: 'Register', errorMessage: `${errorCode['email']} is already taken. Please enter a unique email`});
                            break;
                        case 'username':
                            res.render('register', {title: 'Register', errorMessage: `${errorCode['username']} is already taken. Please enter a unique username`});
                            break;
                    }
                    break;
                default:
                    res.render('404', { title: 'invalid entry', error: 'Invalid entry'});    
                }           
        });
};

module.exports = {
    user_login_get,
    user_login_post,
    user_logout,
    user_register_get,
    user_register_post
}