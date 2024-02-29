const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

app.use(cors({ origin: true }));

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Successfuly loaded!",
    });
});
app.post("/payment/create", async (req, res) => {
    const total = parseInt(req.query.total);
    if (total > 0) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "usd",
        });

        res.set("Access-Control-Allow-Origin", "*");

        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
        });
    } else {
        res.status(403).json({ message: "Total p ayment must be greater than zero" });
    }
});
app.listen(5000, (err) => {
    if (err) throw err
    console.log("Server running on http://localhost:5000")
})