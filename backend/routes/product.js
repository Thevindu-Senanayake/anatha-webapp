const express = require('express');
const { routes } = require('../app');
const router = express.Router();

const {
	getProducts,
	newProduct,
	getSingleProduct,
	updateProduct,
	deleteProduct

} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/products').get(getProducts);
router.route('/product/:productId').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthenticatedUser, newProduct, authorizeRoles('admin'));
router.route('/admin/product/:productId')
	.put(isAuthenticatedUser, updateProduct, authorizeRoles('admin'))
	.delete(isAuthenticatedUser, deleteProduct, authorizeRoles('admin'));

module.exports = router;