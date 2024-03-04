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

const seedsDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {

        const random1000 = Math.floor(Math.random() * 1000);

        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: `${sample(images)}`,
            description: `
Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis quod ea eum cumque magnam deserunt, mollitia deleniti soluta aliquam numquam, quo dolor necessitatibus atque provident corrupti iusto dolorem quia! Laboriosam.`,
            price: random1000
        })
        await camp.save();
    }
}

seedsDb().then(() => {
    mongoose.connection.close();
})