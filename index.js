if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

// VARIABLES 
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
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
const Trip = require('./models/trip')
const sanitizeMongo = require('express-mongo-sanitize')
const helmet = require('helmet');
const {scriptSrcUrls, styleSrcUrls, connectSrcUrls, fontSrcUrls} = require('./utils/allowedScripts');
const targetUrl = process.env.ATLAS_URL || 'mongodb://localhost:27017/rideCentral'
const MongoStore = require('connect-mongo');
const port = process.env.PORT || 3000


const store = MongoStore.create({
    mongoUrl : targetUrl,
    crypto : {
        secret
    },
    touchAfter : 86400
})

// EXPRESS SESSION
const sessionOptions = {
    store, 
    name : 'session',
    secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        // note: expires in 1 week 
        expires : Date.now() + 604800000,
        maxAge : 604800000, 
        httpOnly : true,
        secure : true
    }
}

// SET FUNCTIONS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))


// ENGINE FUNCTIONS 
app.engine('ejs', ejsMate)


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
app.use(sanitizeMongo({replaceWith : "_"}))
app.use(helmet({contentSecurityPolicy : false}))

passport.use(new passportStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(helmet.contentSecurityPolicy({
    directives : {
        defaultSrc : [],
        connectSrc : ["'self'", ...connectSrcUrls],
        scriptSrc : ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc : ["'unsafe-inline'", "'self'", ...styleSrcUrls],
        workerSrc : ["'self'", "blob:"],
        objectSrc : [],
        imgSrc : [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/ridecentral/", 
            "https://images.unsplash.com/",
            "https://source.unsplash.com/"
        ],
        fontSrc : ["'self'", ...fontSrcUrls]
    }
}))


// DATABASE 
mongoose.connect(targetUrl, {
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
app.use('/rides', tripRoute)
app.use('/rides/:id/reviews/', reviewRoute)
app.use('/', userRoute)

// HOME 
app.get('/', async (req, res) => {
    const trips = await Trip.find({})
        .catch(() => {new CustomError("No products found!", 404)});
    res.render('home', {trips})
})


// ERROR PAGE HANDLER 

// NOTE: THROWS ERROR MIDDLEWARE
app.all('*', (req, res, next) => {
    next(new CustomError("Page is unknown!", 404))
})

app.use((err, req, res, next) => {
    const {msg = "Something went wrong!", code = 404} = err;
    res.status(code).render('error', {"error" : msg});
})


// SERVER
app.listen(port, () => {
    console.log(`SERVER IS LISTENING TO PORT ${port}`)
})

