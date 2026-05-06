const mongose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');  

dotenv.config();

const PORT = process.env.PORT || 5000;

mongose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Database connection failed", err);
    });