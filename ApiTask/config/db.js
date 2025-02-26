// Database Connection
const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.DB_URL)
    .then((data) => {
        console.log(`Database connection is done with host ${data.connection.host}`)
    })
    .catch((err) => {
        console.log(`Database connection failed due to ${err}`)
    })
}

module.exports = connectDB;