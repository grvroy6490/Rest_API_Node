const express = require('express');
const router = express.Router();
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.originalname}`;
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {   
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')
    {
        // accept a file
        cb(null, true)
    } else {
        // reject a file
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5,    
    },
    fileFilter: fileFilter
})

// GET ALL PRODUCTS ROUTE 
router.get('/', ProductsController.get_all_products)

// POST A NEW PRODUCT ROUTE 
router.post('/', checkAuth, upload.single('productImage'), ProductsController.create_product)

// GET PRODUCT BY ID ROUTE
router.get('/:productId', ProductsController.get_product_by_id)


// UPDATE A PRODUCT ROUTE
router.patch('/:productId', checkAuth, ProductsController.update_product)


// DETELE A PRODUCT ROUTE
router.delete('/:productId', checkAuth, ProductsController.delete_product)


module.exports = router








// OLD WAY ONLY TO STORE DATA 

// router.post('/', (req, res, next) => {
//     // const product = {
//     //     name: req.body.name,
//     //     price: req.body.price
//     // }
     
//     const product = new Product({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         price: req.body.price
//     });

//     product
//         .save()
//         .then(result => {
//             console.log(result)
//             res.status(201).json({
//                 message: "Created product successfully!",
//                 createProduct: {
//                     _id: result._id,
//                     name: result.name,
//                     price: result.price,
//                     request: {
//                         type: 'GET',
//                         url: 'http://localhost:5000/products/' +  result._id
//                     }
//                 }
//             })
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(500).json({ error: err })
//         })
// })