const User = require('../models/user');

const user_login_get = (req, res) => {
    res.render('login', {title: 'Login' });
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
                    res.render('login', {title: 'Invalid Password'})
                }
            });
        } else {
            res.render('login', {title: 'Invalid Username'})
        }
    });
};

const user_logout = (req, res) => {
    // clear user from session object and save
    // ensures re-using session id will not have logged in user
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
    const user = new User({ username: registerRequest['username'], email: registerRequest['email'], password: registerRequest['password'] })
    user.save()
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            let errorCode = err.keyValue;
            let errorKey = Object.keys(errorCode)[0];
            // handle non-unique email and username errors
            switch (errorKey) {
                case 'email':
                    res.render('register', {title: 'Register', errorMessage: `${errorCode['email']} is already taken. Please enter a unique email`});
                    break;
                case 'username':
                    res.render('register', {title: 'Register', errorMessage: `${errorCode['username']} is already taken. Please enter a unique username`});
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