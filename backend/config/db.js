const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://ankush:ankush2003@cluster0-shard-00-00.wyh2n.mongodb.net:27017,cluster0-shard-00-01.wyh2n.mongodb.net:27017,cluster0-shard-00-02.wyh2n.mongodb.net:27017/?ssl=true&replicaSet=atlas-5mpjiw-shard-0&authSource=admin&retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
