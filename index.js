// VARIABLES 
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const localUrl = 'mongodb://localhost:27017/rideCentral'
const tripRoute = require('./routes/trip');
const methodOverride = require('method-override');
const morgan = require('morgan');
const CustomError = require('./utils/CustomError');

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


// ROUTES
app.use('/trips', tripRoute)

// DATABASE 
mongoose.connect(localUrl, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false
})

const db = mongoose.connection;
db.once('open', () => console.log('MONGODB CONNECTED'));
db.on('error', () => console.error.bind(console, "ERROR WITH MONGODB CONNECTION"));


// ROUTES 
// MIDDLEWARE
// app.use((req, res, next) => {
//     req.date = Date.now();
//     next();
// })

// app.use((req, res, next) => {
//     console.log(req.date)
//     next();
// })

// HOME 
app.get('/', (req, res) => {
    res.render('home')
})


app.listen(3000, () => {
    console.log('SERVER IS LISTENING TO PORT 3000')
})

