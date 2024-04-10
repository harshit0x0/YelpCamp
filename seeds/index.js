const mongoose = require("mongoose")
const Campground = require("../models/campground");
const cities = require('./cities')
const { places, descriptors, images } = require("./seedHelpers");

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("database connected");
})

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
// const findCoordinates = async function (location) {
//     const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${location}&format=json&apiKey=b3a7ec2dbbe7452290afb58a482f3457`);
//     const data = await response.json();
//     const foundLat = (data.results[0].lat);
//     const foundLon = (data.results[0].lon);
//     return [foundLat, foundLon];
// }
function generateRandomCoordinates() {
    const latitude = (Math.random() * 180) - 90;
    const longitude = (Math.random() * 360) - 180;
    return { latitude, longitude };
}

const seedsDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {

        const random1000 = Math.floor(Math.random() * 1000);
        const location = `${cities[random1000].city}, ${cities[random1000].state}`;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: location,
            description: `
Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis quod ea eum cumque magnam deserunt, mollitia deleniti soluta aliquam numquam, quo dolor necessitatibus atque provident corrupti iusto dolorem quia! Laboriosam.`,
            price: random1000,
            author: '660c517462fc973fbd50c3fa',
            images: [
                {
                    url: 'https://res.cloudinary.com/dt1kuh1tm/image/upload/v1712603955/YelpCamp/vdwravvirijdk7f4zfs5.jpg',
                    filename: 'YelpCamp/vdwravvirijdk7f4zfs5',
                },
                {
                    url: 'https://res.cloudinary.com/dt1kuh1tm/image/upload/v1712469720/YelpCamp/y3hgufa5rxyzeljxclof.png',
                    filename: 'YelpCamp/y3hgufa5rxyzeljxclof',
                },
                {
                    url: 'https://res.cloudinary.com/dt1kuh1tm/image/upload/v1712469720/YelpCamp/k6b5obsjpui6ogooz45z.jpg',
                    filename: 'YelpCamp/k6b5obsjpui6ogooz45z',
                }
            ],
            lat: (cities[random1000].latitude),
            lon: (cities[random1000].longitude)
        })
        console.log(camp);
        await camp.save();
    }
}

seedsDb().then(() => {
    mongoose.connection.close();
})

// https://api.unsplash.com/search/photos/?client_id=vEzyGEP1J2Pz-dsCZEOLhb3F85rqEKZZFglurBGCOws?query=water