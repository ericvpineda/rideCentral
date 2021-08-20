// VARIABLES 
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const localUrl = 'mongodb://localhost:27017/rideCentral'
const tripRoute = require('./routes/trip');
const reviewRoute = require('./routes/review');
const userRoute = require('./routes/user')
const methodOverride = require('method-override');
const morgan = require('morgan');
const CustomError = require('./utils/CustomError');
const secret = process.env.SECRET || 'tempsecretpassword'
const expressFlash = require('connect-flash');
const session = require('express-session')
const passport = require('passport');
const passportStrategy = require('passport-local');
const User = require('./models/user');

// SET FUNCTIONS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))


// ENGINE FUNCTIONS 
app.engine('ejs', ejsMate)


// EXPRESS SESSION
const sessionOptions = {
    name : 'session',
    secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        // note: expires in 1 week 
        expires : Date.now() + 604800000,
        maxAge : 604800000, 
        httpOnly : true 
    }
}


// USE FUNCTIONS 
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(morgan("tiny"))
app.use(session(sessionOptions))
app.use(expressFlash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



// DATABASE 
mongoose.connect(localUrl, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false
}).catch(() => {return new CustomError("ERROR: UNABLE TO CONNECT TO MONGODB", 404)})

const db = mongoose.connection;
db.once('open', () => console.log('MONGODB CONNECTED'));
db.on('error', () => console.error.bind(console, "MONGODB CONNECTION ERROR"));

// FLASH 
app.use((req, res, next) => {
    res.locals.authorizeUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// ROUTES

app.use('/trips', tripRoute)
app.use('/trips/:id/reviews/', reviewRoute)
app.use('/', userRoute)

// HOME 
app.get('/', (req, res) => {
    res.render('home')
})


// ERROR PAGE HANDLER 

// NOTE: THROWS ERROR MIDDLEWARE
app.all('*', (req, res, next) => {
    next(new CustomError("Page is unknown!", 404))
})

app.use((err, req, res, next) => {
    const {msg = "Something went wrong!", code = 404} = err;
    res.status(code).render('error', {"error" : err});
})


// SERVER
app.listen(3000, () => {
    console.log('SERVER IS LISTENING TO PORT 3000')
})

