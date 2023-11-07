const express = require('express');
const IsAuthenticated = require("../middlewares/isAuthenticated");
const OrderController = require("../controllers/orderController");

const isAuthenticated=new IsAuthenticated()
const orderController=new OrderController()

const router = express.Router();

router.use(isAuthenticated.protectService);

router.get(
  '/checkout-session/:cartId',
  isAuthenticated.allowedTo('user'),
  orderController.checkoutSession
  
);

router.route('/:cartId').post(isAuthenticated.allowedTo('user'), orderController.createCashOrder);
router.get(
  '/',
  isAuthenticated.allowedTo('user', 'admin', 'manager'),
  orderController.filterOrderForLoggedUser,
  orderController.findAllOrders
);
router.get('/:id', orderController.findSpecificOrder);

router.put(
  '/:id/pay',
  isAuthenticated.allowedTo('admin', 'manager'),
  orderController.updateOrderToPaid
);
router.put(
  '/:id/deliver',
  isAuthenticated.allowedTo('admin', 'manager'),
  orderController.updateOrderToDelivered
);

module.exports = router;
