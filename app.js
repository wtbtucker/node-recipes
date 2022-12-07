// TODO
// form vaildation
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
    const userRequest = req.body;
    
    User.findOne({ username: userRequest.username }, function(err, user) {
        if (err) throw err;
        user.comparePassword(userRequest.password, function(err, isMatch) {
            if (err) throw err;
            console.log(user.createdAt);
            console.log(userRequest.password, isMatch);
        });
    });
});

// recipe routes
app.use('/recipes', recipeRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
});