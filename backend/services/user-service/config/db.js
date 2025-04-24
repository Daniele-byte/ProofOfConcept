//importo mongoose
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //Per DOCKER: mongoose.connect('mongodb://mongodb-order:27017/', {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Esci dall'app se non riesci a connetterti
  }
};

module.exports = connectDB;


