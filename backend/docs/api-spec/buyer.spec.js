module.exports = {
  moduleName: 'Buyer',
  baseUrl: '/api/buyer',
  description:
    'Endpoints require a Buyer session unless marked public. Marketplace browsing and category listing live under /api/marketplace and /api/categories respectively \u2014 see the Shared / Public collection.',
  folders: [
    {
      name: 'Authentication',
      endpoints: [
        {
          method: 'POST',
          path: '/auth/otp/request',
          auth: null,
          title: 'Request OTP',
          srs: 'UC-01, FR-1-01, FR-1-04',
          body: { phone: '+923009998888', preferredLanguage: 'en' },
          bodyFieldNotes: ['phone: required, Pakistani mobile format', 'preferredLanguage: optional, "ur" or "en"'],
        },
        {
          method: 'POST',
          path: '/auth/otp/verify',
          auth: null,
          title: 'Verify OTP and log in',
          srs: 'UC-01',
          body: { phone: '+923009998888', code: '123456' },
          successExample: {
            success: true,
            message: 'Login successful',
            data: { token: '<jwt>', isNewAccount: true, buyer: { id: '{{buyer_id}}', phone: '+923009998888', name: null, preferredLanguage: 'en', credibilityScore: 50 } },
          },
          postmanTest: 'saveToken',
        },
        { method: 'POST', path: '/auth/logout', auth: 'buyer', title: 'Logout (revokes current token)' },
      ],
    },
    {
      name: 'Profile & Addresses',
      endpoints: [
        { method: 'GET', path: '/profile', auth: 'buyer', title: 'Get my profile' },
        { method: 'PATCH', path: '/profile', auth: 'buyer', title: 'Update my profile', body: { name: 'Zainab Khan', preferredLanguage: 'ur' } },
        {
          method: 'POST',
          path: '/profile/addresses',
          auth: 'buyer',
          title: 'Add a saved address',
          body: { label: 'Home', addressLine: '456 Bazaar Road, Model Town', city: 'Lahore', isDefault: true },
          bodyFieldNotes: ['addressLine: required, 5\u2013300 chars', 'city: required', 'The first address saved is always auto-marked default'],
          successStatus: 201,
        },
        {
          method: 'PATCH',
          path: '/profile/addresses/:addressId',
          auth: 'buyer',
          title: 'Update a saved address',
          pathParams: [{ name: 'addressId', type: 'ObjectId' }],
          body: { addressLine: '789 Main Street', isDefault: true },
        },
        { method: 'DELETE', path: '/profile/addresses/:addressId', auth: 'buyer', title: 'Delete a saved address', pathParams: [{ name: 'addressId', type: 'ObjectId' }] },
      ],
    },
    {
      name: 'Cart',
      endpoints: [
        { method: 'GET', path: '/cart', auth: 'buyer', title: 'Get my cart' },
        {
          method: 'POST',
          path: '/cart/items',
          auth: 'buyer',
          title: 'Add item to cart',
          body: { productId: '{{product_id}}', quantity: 2 },
          bodyFieldNotes: ['productId: required, must be approved and in stock', 'quantity: optional, default 1'],
        },
        {
          method: 'PATCH',
          path: '/cart/items/:productId',
          auth: 'buyer',
          title: 'Update item quantity',
          pathParams: [{ name: 'productId', type: 'ObjectId' }],
          body: { quantity: 3 },
          description: 'Setting quantity to 0 removes the item.',
        },
        { method: 'DELETE', path: '/cart/items/:productId', auth: 'buyer', title: 'Remove item from cart', pathParams: [{ name: 'productId', type: 'ObjectId' }] },
        { method: 'DELETE', path: '/cart', auth: 'buyer', title: 'Clear entire cart' },
      ],
    },
    {
      name: 'Checkout',
      endpoints: [
        {
          method: 'POST',
          path: '/checkout/initiate',
          auth: 'buyer',
          title: 'Initiate checkout',
          srs: 'UC-05',
          description:
            'Re-validates stock, splits the cart by seller (one order-group per seller), and returns a signed gateway request. Does NOT create Order records yet \u2014 that only happens after a verified payment callback. Redirect the buyer\u2019s browser to gatewayRequest.baseUrl with gatewayRequest.fields.',
          body: { shippingAddress: { addressLine: '456 Bazaar Road', city: 'Lahore' }, paymentMethod: 'jazzcash' },
          bodyFieldNotes: [
            'Provide EITHER addressId (a saved address) OR shippingAddress {addressLine, city}',
            'paymentMethod: required, one of credit_card | jazzcash | easypaisa',
          ],
          successExample: {
            success: true,
            message: 'Checkout initiated',
            data: {
              checkoutToken: '<short-lived signed token>',
              totalAmount: 9000,
              removedItems: [],
              gatewayRequest: { gateway: 'jazzcash', baseUrl: 'https://sandbox.jazzcash.com.pk', fields: { pp_MerchantID: '...', pp_Amount: 900000, pp_BillReference: '<checkoutToken>', pp_SecureHash: '...' } },
            },
          },
        },
        {
          method: 'POST',
          path: '/checkout/callback/:method',
          auth: null,
          title: 'Payment gateway callback (server-to-server)',
          srs: 'UC-05, FR-4-02',
          pathParams: [{ name: 'method', type: 'string', enum: ['credit_card', 'jazzcash', 'easypaisa'] }],
          description:
            'Called BY THE PAYMENT GATEWAY, not the buyer\u2019s browser \u2014 authenticated via HMAC signature verification, not a buyer session. On a verified success, creates one Order per seller group, credits seller wallets (minus commission), clears the buyer\u2019s cart, and notifies everyone. Included here mainly for reference/simulation during integration testing.',
          body: { pp_MerchantID: '...', pp_Amount: 900000, pp_BillReference: '<checkoutToken>', pp_ResponseCode: '000', pp_TxnRefNo: 'TXN123', pp_SecureHash: '<computed HMAC>' },
        },
      ],
    },
    {
      name: 'Orders',
      endpoints: [
        {
          method: 'GET',
          path: '/orders',
          auth: 'buyer',
          title: 'List my orders',
          queryParams: [{ name: 'page', type: 'integer', required: false }, { name: 'limit', type: 'integer', required: false }, { name: 'status', type: 'string', required: false }],
        },
        { method: 'GET', path: '/orders/:orderId', auth: 'buyer', title: 'Get order detail / tracking', pathParams: [{ name: 'orderId', type: 'ObjectId' }] },
        {
          method: 'POST',
          path: '/orders/:orderId/cancel',
          auth: 'buyer',
          title: 'Cancel an order',
          srs: 'FR-3-05',
          pathParams: [{ name: 'orderId', type: 'ObjectId' }],
          description: 'Only allowed while the order is still "pending" (before the seller accepts it).',
          body: { reason: 'Changed my mind' },
          bodyFieldNotes: ['reason: optional, max 500 chars'],
        },
      ],
    },
    {
      name: 'Support Tickets',
      endpoints: [
        {
          method: 'POST',
          path: '/support-tickets',
          auth: 'buyer',
          title: 'Raise a support ticket',
          body: { relatedOrderId: '{{order_id}}', subject: 'Order never arrived', description: 'My order shows "delivered" but I never received it. The seller is not responding to messages.' },
          successStatus: 201,
        },
        { method: 'GET', path: '/support-tickets', auth: 'buyer', title: 'List my tickets' },
        { method: 'GET', path: '/support-tickets/:ticketId', auth: 'buyer', title: 'Get my ticket detail', pathParams: [{ name: 'ticketId', type: 'ObjectId' }] },
        {
          method: 'POST',
          path: '/support-tickets/:ticketId/respond',
          auth: 'buyer',
          title: 'Add a response to my ticket',
          pathParams: [{ name: 'ticketId', type: 'ObjectId' }],
          body: { message: 'Still no response from the seller.' },
        },
      ],
    },
  ],
};
