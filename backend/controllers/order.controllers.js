import { Order } from "../models/order.model.js";
import Stripe from "stripe";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const placeOrder = async (req, res) => {
    console.log('Placing order...', req.body);
    try {
        const {items, totalAmount, paymentMethod, shippingAddress} = req.body
        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            paymentMethod,
            shippingAddress
        })
        await User.findByIdAndUpdate(req.user._id, { cart: [] });

        res.status(200).json({
            order
        })
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
}

import "dotenv/config"; // Load environment variables

const placeOrderStripe = async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, shippingAddress } = req.body;

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            paymentMethod,
            shippingAddress
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                        name: "Order Payment",
                        },
                        unit_amount: totalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CORS_ORIGIN}/thankyou`,
            cancel_url: `${process.env.CORS_ORIGIN}/checkout`,
        });
        await User.findByIdAndUpdate(req.user._id, { cart: [] });
        res.status(200).json({ url: session.url, orderNumber: order.orderNumber, orderId: order._id });

    } catch (error) {
        console.error("Error placing Stripe order:", error);
        res.status(500).json({ error: "Failed to place Stripe order" });
    }
};

const userOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
        if (orders.length > 0) {
            res.json({
                orders
            })
        } else{
            res.json({
                msg: "No orders found"
            })
        }
    }
    catch (error) {
        console.log(error.msg)
    }
}

const orderDetails = async (req, res) => {
    try {
        const orderId = req.params.id
        const order = await Order.findOne({ _id: orderId, user: req.user._id })
        if (order) {
            res.json({
                order
            })
        } else{
            res.json({
                msg: "No order found"
            })
        }
    }
    catch (error) {
        console.log(error.msg)
    }
}

const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        if (orders.length > 0) {
            return res.json({ orders });
        } 
        return res.json({ msg: "No orders found" });

    } catch (error) {
        console.error(error.message);  
        res.status(500).json({ msg: "Server error" });
    }
};


const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findOneAndUpdate({ _id: orderId, user: req.user._id }, { status }, { new: true });
        if (order) {
            return res.status(200).json({ msg: "Order status updated", order });
        }
        return res.status(404).json({ msg: "No order found" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
};



export { placeOrder, placeOrderStripe,userOrders, orderDetails ,allOrders, updateStatus };