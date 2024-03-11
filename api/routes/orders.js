const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')


const OrdersController = require ('../controllers/orders')

// GET ALL ORDERS ROUTE
router.get('/', checkAuth, OrdersController.get_all_orders)

// POST A NEW ORDER ROUTE
router.post('/', checkAuth, OrdersController.create_order)


// GET ORDER BY ID ROUTE
router.get('/:orderId', checkAuth, OrdersController.get_order_by_id)

// // UPDATE ORDERS ROUTE
// router.patch('/:orderId', checkAuth, (req, res, next) => {
//     res.status(200).json({
//         message: "Orders updated",
//         oerderId: req.params.orderId
//     })
// })

// DELETE ORDERS ROUTE
router.delete('/:orderId', checkAuth, OrdersController.delete_order)

module.exports = router