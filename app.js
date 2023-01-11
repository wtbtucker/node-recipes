const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    sessions = require('express-session'),
    MongoStore = require('connect-mongo'),
    recipeRoutes = require('./routes/recipeRoutes'),
    userRoutes = require('./routes/userRoutes'),
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

// middleware to check request for user and set response variables to include user
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

app.use(checkUser);

const requireAuth = (req, res, next) => {
    if(req.session.userid) {
        next()
    } else {
        res.redirect('/user/login')
    }
}

// routes
app.get('/', requireAuth, (req, res) => {
    res.redirect('/recipes');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// recipe routes
app.use('/recipes', requireAuth, recipeRoutes);

// user routes
app.use('/user', userRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404', error: '404 Page not found' })
});