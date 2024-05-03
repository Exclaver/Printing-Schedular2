const mongoose = require("mongoose");

// Replace 'your_database_url' with your actual MongoDB connection URL
const dbUrl = "mongodb+srv://fantasticfungi1:pnbKveZDkgwMfwLh@cluster0.c8kyqi2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//fantasticfungi1
//pnbKveZDkgwMfwLh


mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = mongoose;
