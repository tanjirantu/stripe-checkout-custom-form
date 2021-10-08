const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')
const bodyParser = require('body-parser')

const stripe = require('stripe')('sk_test_51J6nFYHgGxrAF2GI68UuETzDy2BWkDU8FWiTV20PhACPjTL7lxLbn0gXuo8kLsFaHhbQdebmKkkfzx9rz9OWhK8D00z4mokbJL');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post("/create-payment-intent", async (req, res) => {
    // const { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 10 * 100,
        currency: "usd"
    });
    res.send({
        clientSecret: paymentIntent.client_secret
    });
});

app.listen(port, () => {
    console.log(`Server running at http://172.27.92.123:${port}`)
})