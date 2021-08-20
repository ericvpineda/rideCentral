// note: used to seed database 

const Trip = require('../models/trip');
const Review = require('../models/review');
const mongoose = require('mongoose');
const localUrl = "mongodb://localhost:27017/rideCentral"
const cities = require('./us_cities');
const name = require('./ride_names');

mongoose.connect(localUrl, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false
})

const seedDb = async () => {
    await Trip.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 3; i++) {
        var r1 = Math.floor(Math.random() * 15) + 1;
        var r2 = Math.floor(Math.random() * 15) + 1;
        var r3 = Math.floor(Math.random() * 500) + 1;

        var mon = Math.floor(Math.random() * 11) + 1;
        var day = Math.floor(Math.random() * 30) + 1;
        var year = Math.floor(Math.random() * 11) + 2010;
        var place = `${name.first[r1]} ${name.last[r2]}`;
        
        if (mon < 10) {
            mon = `0${mon}`
        }

        if (day < 10) {
            day = `0${day}`
        }
        
        const trip = new Trip({
            title : place,
            description : `${place} is so much fun! orem ipsum dolor sit amet consectetur adipisicing elit. Quasi non perspiciatis, illum`,
            location : `${cities[r3].longitude} ${cities[r3].latitude}`,
            img : "https://source.unsplash.com/collection/429524/1600x900",
            date : `${year}-${mon}-${day}`,
        })

        trip.save()
    }
}

seedDb().then(() => {console.log('DB SEED COMPLETED')})