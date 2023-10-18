const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment-intent", async (req, res) => {
  const paymentIntent = stripe.paymentIntents.create({
    source: req.body.tokenId,
    amount: req.body.amount,
    currency: "sgd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  console.log(paymentIntent);

  return res.status(200).json({ clientSecret: paymentIntent.client_secret });
});

module.exports = router;
