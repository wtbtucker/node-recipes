// TODO
// form validation
// user login/authentication
// delete posts and edit posts if user is recipe creator
// print friendly formatting

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const recipeRoutes = require('./routes/recipeRoutes');
const User = require('./models/user');

// express app
const app = express();

// connect to mongodb then listen for requests
const dbURI = 'mongodb+srv://wtbtucker2:jw3kUw3cHbKkPsKP@cluster0.iplljni.mongodb.net/Recipes?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(3000))
    .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// routes
app.get('/', (req, res) => {
    res.redirect('/recipes');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/login', (req, res) => {
    res.render('login', {title: 'Login' });
});

app.post('/login', (req, res) => {
    const loginRequest = req.body;
    
    User.findOne({ username: loginRequest.username }, function(err, user) {
        if (err) throw err;
        user.comparePassword(loginRequest.password, function(err, isMatch) {
            if (err) throw err;
            console.log(user.createdAt);
            console.log(loginRequest.password, isMatch);
        });
    });
});

app.get('/register', (req, res) => {
    res.render('register', {title: 'Register'})
})

app.post('/register', (req,res) => {
    const registerRequest = req.body;

    // if (registerRequest['password'] == registerRequest['confirm']) {
    const user = new User({ username: registerRequest['username'], email: registerRequest['email'], password: registerRequest['password'] })

    user.save()
        .then(result => {
            res.redirect('/recipes');
        })
        .catch(err => {
            console.log(err);
            let errorCode = err.keyValue;
            let errorKey = Object.keys(errorCode)[0];
            switch (errorKey) {
                case 'email':
                    console.log(errorCode['email']);
                    res.render('404', {title: 'duplicate email'});
                    break;
                case 'username':
                    console.log(errorCode['username']);
                    res.render('404', {title: 'duplicate username'});
                    break;
                default:
                    res.render('404', { title: 'invalid entry'});
            }          
        });
    // } else {
    //     // enter user data for username and password and prompt to select a password that matches
    //     res.render()
    });

// recipe routes
app.use('/recipes', recipeRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
});