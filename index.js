const express = require('express');
const app = express();
const mongoose = require('mongoose'); // Kommunicerar med mongodb
const dotenv = require('dotenv'); // Gör att vi kan läsa .env filers innehåll.
const pages = require('./routes/pages');
dotenv.config(); // Skapar en instans av dotenv.

// connect to DB
mongoose.connect(process.env.DB_CONNECT, {useUnifiedTopology: true, useNewUrlParser: true}, () => {
    console.log('Connected to database!');
});

const authRoute = require('./routes/auth');
const secureRoute = require('./routes/secure');

// Middlewares
app.use(express.json()); // Möjliggör så vi kan använda json
app.use(express.static('public'));


// Route Middleware
app.use('/api/user', authRoute); // Detta för att logga in och sign up för user.
app.use('/api/secure', secureRoute); // Använder säkring av sidan.
app.use('/', pages);

app.listen(3000, () => {
    console.log('Server running');
});
