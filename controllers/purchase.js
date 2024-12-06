const Razorpay = require("razorpay");
const Purchase = require("../models/orders");

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.body
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    return res
      .status(403)
      .json({ success: false, message: "something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    Order.findOne({ where: { orderId: order_id } })
      .then((order) => {
        Order.update({ paymentid: payment_id, status: "SUCCESSFUL" })
          .then(() => {
            req.user
              .update({ isPremiumUser: true })
              .then(() => {
                return res
                  .status(202)
                  .json({ success: true, message: "transaction successful" });
              })
              .catch((err) => {
                throw new Error(err);
              });
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {}
};
