const mongoose = require('mongoose');
const Order = require("../models/order");
const Product = require("../models/product");


// GET ALL ORDERS
exports.get_all_orders = (req, res, next) => {
    Order.find()
        .populate('product', 'name price')
        .select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:5000/orders/' + doc._id
                        }

                    }
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}



// POST A NEW ORDER
exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {

            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                })
            }

            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });

            return order.save()
        })
        .then(doc => {
            console.log(`Order saved with id"${doc._id}"`)
            res.status(201).json({
                message: "Order stored",
                createdOrder: {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/orders/' + doc._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}


// GET ORDER BY ID
exports.get_order_by_id = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product', 'name price')
        .select('_id product quantity') // select only these fields
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                })
            }

            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/orders'
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}



// DELETE ORDERS
exports.delete_order = (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId})
        .then(result => {
            res.status(200).json({
                message: "Orders deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:5000/orders',
                    body: {
                        productId: 'ID',
                        quantity: "Number"
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}