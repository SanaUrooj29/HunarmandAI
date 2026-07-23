const { Buyer, Product, Order, WalletTransaction, PlatformSettings } = require('../../shared/models');
const cartService = require('./cartService');
const paymentService = require('../../shared/services/paymentService');
const { signCheckoutToken, verifyCheckoutToken } = require('../../shared/utils/checkoutToken.util');
const { generateOrderNumber } = require('../../shared/utils/orderNumber.util');
const { ApiError } = require('../../shared/utils/apiError.util');
const notificationService = require('../../shared/services/notificationService');
const credibilityScoreService = require('../../shared/services/credibilityScoreService');

async function getCommissionPercentage() {
  const settings = await PlatformSettings.findOne().lean();
  return settings?.platformCommissionPercentage || 0; // FR-4-03 — optional
}

/**
 * UC-05 Main Flow steps 1-4 + Exception E3 + Alt Flow A1.
 * Re-validates stock, splits the cart by seller, and returns a signed
 * gateway request. Does NOT touch Order/WalletTransaction yet — those are
 * only created once the payment callback is verified (finalizeCheckout).
 */
async function initiateCheckout(buyerId, { addressId, shippingAddress, paymentMethod }) {
  const cart = await cartService.getMyCart(buyerId);
  if (cart.items.length === 0) {
    throw ApiError.badRequest('Your cart is empty');
  }

  const buyer = await Buyer.findById(buyerId);
  let resolvedAddress = shippingAddress;
  if (!resolvedAddress && addressId) {
    const saved = buyer.addresses.id(addressId);
    if (!saved) throw ApiError.notFound('Saved address not found');
    resolvedAddress = { addressLine: saved.addressLine, city: saved.city };
  }
  if (!resolvedAddress) throw ApiError.badRequest('A shipping address is required');

  // UC-05 Exception E3 — re-check stock at checkout time, not just at add-to-cart time.
  const removedItems = [];
  const validItems = [];
  for (const item of cart.items) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findById(item.productId);
    if (!product || product.approvalStatus !== 'approved' || product.stockStatus === 'out_of_stock') {
      removedItems.push({ productId: item.productId, titleSnapshot: item.titleSnapshot });
    } else {
      validItems.push(item);
    }
  }
  if (validItems.length === 0) {
    throw ApiError.badRequest('All items in your cart are no longer available', {
      code: 'CART_ITEMS_UNAVAILABLE',
      details: removedItems,
    });
  }

  // UC-05 Alt Flow A1 — split into one order-group per seller.
  const groupsBySeller = new Map();
  validItems.forEach((item) => {
    const key = String(item.sellerId);
    if (!groupsBySeller.has(key)) groupsBySeller.set(key, []);
    groupsBySeller.get(key).push({
      productId: item.productId,
      titleSnapshot: item.titleSnapshot,
      priceSnapshot: item.priceSnapshot,
      quantity: item.quantity,
      subtotal: item.priceSnapshot * item.quantity,
    });
  });

  const sellerGroups = Array.from(groupsBySeller.entries()).map(([sellerId, items]) => ({
    sellerId,
    items,
    subtotal: items.reduce((sum, i) => sum + i.subtotal, 0),
  }));
  const totalAmount = sellerGroups.reduce((sum, g) => sum + g.subtotal, 0);
  const commissionPercentage = await getCommissionPercentage();

  const checkoutToken = signCheckoutToken({
    buyerId: String(buyerId),
    shippingAddress: resolvedAddress,
    paymentMethod,
    sellerGroups,
    totalAmount,
    commissionPercentage,
  });

  const gatewayRequest = paymentService.buildGatewayRequest(paymentMethod, {
    amount: totalAmount,
    checkoutToken,
    description: `HunarmandAI order — ${sellerGroups.length} seller(s)`,
  });

  return { checkoutToken, totalAmount, removedItems, gatewayRequest };
}

/**
 * UC-05 Main Flow steps 6-8 — invoked from the payment callback route
 * after paymentService.verifyCallback() has confirmed the signature.
 * Creates one Order per seller group, credits each seller's pending
 * wallet balance (minus commission), clears the cart, and notifies
 * everyone involved.
 */
async function finalizeCheckout({ checkoutToken, isSuccess, transactionId }) {
  const intent = verifyCheckoutToken(checkoutToken);

  await credibilityScoreService.recordPaymentOutcome(intent.buyerId, isSuccess);

  if (!isSuccess) {
    await notificationService.notify({
      recipientType: 'buyer',
      recipientId: intent.buyerId,
      type: 'payment_failed',
      title: 'Payment failed',
      body: 'Your payment could not be completed. Please try again.',
    });
    return { success: false, orders: [] };
  }

  const orders = [];
  for (const group of intent.sellerGroups) {
    const commissionAmount = (group.subtotal * (intent.commissionPercentage || 0)) / 100;
    const sellerCreditAmount = group.subtotal - commissionAmount;

    // eslint-disable-next-line no-await-in-loop
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      buyerId: intent.buyerId,
      sellerId: group.sellerId,
      items: group.items,
      productPrice: group.subtotal,
      deliveryCharges: 0,
      totalAmount: group.subtotal,
      shippingAddress: intent.shippingAddress,
      status: 'pending',
      payment: { method: intent.paymentMethod, status: 'paid', transactionId, paidAt: new Date() },
    });

    // eslint-disable-next-line no-await-in-loop
    await WalletTransaction.create({
      sellerId: group.sellerId,
      orderId: order._id,
      type: 'credit_sale',
      amount: sellerCreditAmount,
      status: 'pending', // moved to the seller's available balance on delivery (orderLifecycleService.onDelivered)
    });

    // eslint-disable-next-line no-await-in-loop
    await Product.updateMany(
      { _id: { $in: group.items.map((i) => i.productId) } },
      { $inc: { salesCount: 1 } }
    );

    // eslint-disable-next-line no-await-in-loop
    await notificationService.notify({
      recipientType: 'seller',
      recipientId: group.sellerId,
      type: 'new_order',
      title: `New order ${order.orderNumber}`,
      relatedEntity: { type: 'order', id: order._id },
    });

    orders.push(order);
  }

  await notificationService.notify({
    recipientType: 'buyer',
    recipientId: intent.buyerId,
    type: 'payment_success',
    title: 'Order confirmed',
    body: `Your order${orders.length > 1 ? 's have' : ' has'} been placed successfully.`,
  });

  await cartService.clearCart(intent.buyerId);

  return { success: true, orders };
}

module.exports = { initiateCheckout, finalizeCheckout };
