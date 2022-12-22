// TODO
// form validation
// user login/authentication
// delete posts and edit posts if user is recipe creator
// print friendly formatting

const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    sessions = require('express-session'),
    cookieParser = require('cookie-parser'),
    recipeRoutes = require('./routes/recipeRoutes'),
    User = require('./models/user');

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
const oneDay = 1000*60*60*24 // One day in milliseconds
app.use(sessions({
    secret: "thisismysecretkey123456789",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(cookieParser());

// a variable to save a session
let session;

// routes
app.get('/', (req, res) => {
    session=req.session;
    if(session.userid){
        console.log(req.session)
        res.redirect('/recipes');
    }else {
        res.redirect('/login');
    }
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// Load login form
app.get('/login', (req, res) => {
    res.render('login', {title: 'Login' });
});

// Verify user credentials and create session
app.post('/login', (req, res) => {
    const loginRequest = req.body;
    
    User.findOne({ username: loginRequest.username }, function(err, user) {
        if (err) throw err;
        user.comparePassword(loginRequest.password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch){
                session = req.session;
                session.userid = loginRequest.username;
                console.log(req.session);
                res.redirect('/recipes');
            }else {
                res.redirect('/404', {title: 'Error', error: 'Invalid username or password'})
            }
        });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
});

// Load registration form
app.get('/register', (req, res) => {
    res.render('register', {title: 'Register', errorMessage: ''})
})

// Register a new user
app.post('/register', (req,res) => {
    const registerRequest = req.body;
    const user = new User({ username: registerRequest['username'], email: registerRequest['email'], password: registerRequest['password'] })
    user.save()
        .then(result => {
            res.redirect('/recipes');
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
    });


// recipe routes
app.use('/recipes', recipeRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404', error: '404 Page not found' })
});