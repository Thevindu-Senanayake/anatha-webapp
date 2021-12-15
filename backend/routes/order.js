const express = require('express');
const router = express.Router();

const { newOrder, getSingleOrderDetails, myOrders } = require('../controllers/orderController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticatedUser, newOrder);

router.route('/order/:id').get(isAuthenticatedUser, getSingleOrderDetails);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

module.exports = router;