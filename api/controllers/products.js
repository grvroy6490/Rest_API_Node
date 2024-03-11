const mongoose = require('mongoose');
const Order = require("../models/order");
const Product = require("../models/product");


// GET ALL PRODUCTS
exports.get_all_products = (req, res, next) => {
    Product
        .find()
        .select('name price _id productImage') // fetch specific fields
        .exec()
        .then(docs => {
            const response = { //  create a new object to hold our data with custom data
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:5000/products/' +  doc._id
                        }
                    }
                })
            }
            if (docs.length >= 0) {
                res.status(200).json(response)
            } else {
                res.status(404).json({
                    "message": "No entries found!"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
}


// POST A NEW PRODUCT
exports.create_product = (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path.replace(/\\/g, '/')
    });

    product
        .save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: "Created product successfully!",
                createProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/products/' +  result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
}


// GET PRODUCT BY ID
exports.get_product_by_id = (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select(('_id name price productImage'))
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/products/' +  doc._id
                    }
                })
            } else {
                res.status(200).json({ message: "No valid entry found for provided ID" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

    // if (id === 'special') {
    //     res.status(200).json({
    //         message: "You discovered special ID",
    //         id: id
    //     })
    // } else {
    //     res.status(200).json({
    //         message: "You passed and ID"
    //     })
    // }
}


// UPDATE A PRODUCT
exports.update_product = (req, res, next) => {
    const id = req.params.productId
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product
        .updateOne({ _id: id }, updateOps)
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product updated!",
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/products/' +  id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

}



// DETELE A PRODUCT
exports.delete_product = (req, res, next) => {
    const id = req.params.productId
    Product
        .deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted!",
                request: {
                    type: 'POST',
                    url: 'http://loalhost:5000/products',
                    body: {name: 'String', price: 'Number'}
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })

}