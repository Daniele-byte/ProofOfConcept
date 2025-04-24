const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.PAYMENT_SERVICE_MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connesso');
    } catch (error) {
        console.error('Errore di connessione a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
