import Stripe from "stripe";

require("dotenv").config();

const express = require("express");
const app = express();

// Middleware to parse JSON request body
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

app.get("/", (req: any, res: any) => res.send("Express on Vercel"));

app.post("/test-apple-pay", async (req: any, res: any) => {
  try {
    const data = req.body;

    if (!data.paymentMethodId) {
      return res.status(400).json({ error: "Missing paymentMethodId" });
    }

    console.log("Payload:", data);

    const payload: any = {
      email: "ruben.buell+11@hotmail.com",
      phone: 2391234567,
      description: "",
      name: "Ruben Buell",
      address: {
        line1: "Demo app for apple pay",
        line2: "Demo app for apple pay",
        city: "Demo app for apple pay",
        state: "Demo app for apple pay",
        country: "USA",
        postal_code: 98001,
      },
      payment_method: data.paymentMethodId,
    };

    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create(payload);
    console.log("Success: stripeCustomer created:", stripeCustomer);

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,
      currency: "usd",
      customer: stripeCustomer.id,
      payment_method: data.paymentMethodId,
      payment_method_types: ["card"],
      capture_method: "manual",
    });

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error in Apple Pay test:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.listen(3001, () => console.log("Server ready on port 3000."));

module.exports = app;
