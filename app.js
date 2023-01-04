// TODO
// form validation
// user login/authentication
// delete posts and edit posts if user is recipe creator
// print friendly formatting

// error message on login screen

// use context sent with response to determine if user is logged in
// if user is logged in display 'signed in as david' and logout button in nav
// if user is not logged in display login and register buttons in nav


const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    sessions = require('express-session'),
    MongoStore = require('connect-mongo'),
    recipeRoutes = require('./routes/recipeRoutes'),
    User = require('./models/user');

// express app
const app = express();

// connect to mongodb then listen for requests
const dbURI = 'mongodb+srv://wtbtucker2:jw3kUw3cHbKkPsKP@cluster0.iplljni.mongodb.net/Recipes?retryWrites=true&w=majority';
const clientP = mongoose.connect(dbURI, 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(m => m.connection.getClient())

app.listen(3000, () => {
    console.log('Recipes app listening at http://localhost:3000');
})

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
    store: MongoStore.create({
        clientPromise: clientP,
    }),
    cookie: { maxAge: oneDay },
    resave: false
}));

// middleware to check for user and set response variables to include user
const checkUser = (req, res, next) => {
    if (req.session.userid){
        console.log(req.session)
        res.locals.user = req.session.userid;
        next()
    } else {
        res.locals.user = null;
        next()
    }
}

const requireAuth = (req, res, next) => {
    if(req.session.userid) {
        next()
    } else {
        res.redirect('/login')
    }
}

// routes
app.get('*', checkUser);
app.get('/', requireAuth, (req, res) => {
    res.redirect('/recipes');
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
        if (user) {
            user.comparePassword(loginRequest.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch){

                    // regenerate session to guard against session fixation
                    req.session.regenerate((err) => {
                        if (err) next(err)
                    });

                    // store user information in session
                    req.session.userid = loginRequest.username;
                    console.log(req.session);

                    // explicitly save session to prevent redirect before save
                    req.session.save((err) => {
                        if(err) next(err)
                    });
                    res.redirect('/recipes');
                }else {
                    res.render('login', {title: 'Invalid Password'})
                }
            });
        } else {
            res.render('login', {title: 'Invalid Username'})
        }
    });
});

app.get('/logout', (req, res) => {
    
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
            res.redirect('/')
        });
    });
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
    });


// recipe routes
app.use('/recipes', requireAuth, recipeRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404', error: '404 Page not found' })
});