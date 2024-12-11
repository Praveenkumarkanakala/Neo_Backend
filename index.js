const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
require('dotenv').config();
const web = require('./web');
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://0.0.0.0:27017/web",
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }).then(
      ()=>console.log('DataBase Connected Successfully')
  )
  
// Transaction schema
const transactionSchema = new mongoose.Schema({
  amount: Number,
  paymentStatus: String,
  transactionId: String,
  billingDetails: Object,
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);



// Stripe payment intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  const { amount, billingDetails } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in paise (smallest unit of INR)
      currency: 'usd',
      description: 'Payment for Service/Item',
      receipt_email: billingDetails.email,
      shipping: {
        name: billingDetails.name,
        address: billingDetails.address,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Payment intent creation failed');
  }
});

// Save transaction endpoint
app.post('/save-transaction', async (req, res) => {
  const { amount, paymentStatus, transactionId, billingDetails } = req.body;

  const transaction = new Transaction({
    amount,
    paymentStatus,
    transactionId,
    billingDetails,
  });

  try {
    await transaction.save();
    res.status(200).send('Transaction saved');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add data endpoint
app.post('/add-data', async (req, res) => {
  const information = new web(req.body);
  try {
    await information.save();
    res.status(201).json({
      status: 'Success',
      data: {
        information
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'Failed',
      message: err.message
    });
  }
});

// Get data endpoint
app.get('/get-data', async (req, res) => {
  try {
    const information = await web.find({});
    res.status(200).json({
      status: 'Success',
      data: {
        information
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'Failed',
      message: err.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
