const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);
const connection = mongoose.connection;

connection.on("connected", function() {
    console.log("MongoDB connection successful.");
});

connection.on("error", function() {
    console.log("MongoDB connection failed.");
});

module.exports = connection;