// const mongoose = require("mongoose");
// const cities = require("./cities");
// const { places, descriptors } = require("./seedHelper");
// const Meetup = require("../models/meetup");

// mongoose.connect("mongodb://localhost:27017/yelp-camp", {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true
// });

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Database connected");
// });
// const sample = (array) => array[Math.floor(Math.random() * array.length)];

// const seedDB = async () => {
//   await Meetup.deleteMany({});
//   for (let i = 0; i < 50; i++) {
//     const random1000 = Math.floor(Math.random() * 1000);
//     const meetup = new Meetup({
//       location: `${cities[random1000].city}, ${cities[random1000].state}`,
//       title: `${sample(descriptors)} ${sample(places)}`
//     });
//     await meetup.save();
//   }
// };

// seedDB().then(() => {
//   mongoose.connection.close();
// });
