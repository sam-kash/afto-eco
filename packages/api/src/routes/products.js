const express = require('express');
const ProductController = require('../controllers/productController');

const router = express.Router();

router.get('/', ProductController.getAll);
router.get('/categories', ProductController.getCategories);
router.get('/:id', ProductController.getById);

module.exports = router;