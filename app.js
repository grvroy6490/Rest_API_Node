const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

// MONGODB CONNECTION STRING
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB connected successfully');
})
.catch(error => {
    console.error('MongoDB connection error:', error);
});



// Middleware to Log request on testing on dev mode
app.use(morgan('dev'))

// Make uploads folder available publically
app.use('/uploads', express.static('uploads'))
 // To parse the incoming
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// HANDLING CORS
app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:8000')
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );

        return res.status(200).json({});
    }   
    next();
})

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Send back a 404 if no other route matches
app.use((req, res, next) => { 
    const error = new Error('Not Found!');
    error.status = 404;
    next(error);
})


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;