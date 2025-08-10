const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async (req, res) => {
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));
}
module.exports = connectDB;