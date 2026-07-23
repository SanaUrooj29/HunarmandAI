/**
 * Structured API spec — single source of truth for both the Markdown
 * documentation and the Postman collections (generated from this file so
 * the two can never drift apart). Endpoint list, methods, paths, auth
 * requirements, and body fields are all verified directly against the
 * route/validator files, not reconstructed from memory.
 */

module.exports = {
  moduleName: 'Shared / Public',
  baseUrl: '/api',
  description:
    'Endpoints not owned by a single panel: the category tree, marketplace browsing, and product reviews. Browsing and category listing are fully public (no auth); review submission requires a buyer session.',
  folders: [
    {
      name: 'Categories',
      endpoints: [
        {
          method: 'GET',
          path: '/categories',
          auth: null,
          title: 'List all active categories',
          srs: 'FR-6-03',
          description:
            'Returns the full active category tree (top-level categories with their subcategories nested inside). Used by sellers to pick a category and by buyers to filter the marketplace.',
          successExample: {
            success: true,
            message: 'Categories fetched',
            data: [
              {
                _id: '665f1a2b3c4d5e6f7a8b9c0d',
                name: 'Clothing',
                parentCategory: null,
                sortOrder: 9,
                status: 'active',
                subcategories: [
                  { _id: '665f1a2b3c4d5e6f7a8b9c0e', name: 'Shawls', parentCategory: '665f1a2b3c4d5e6f7a8b9c0d' },
                  { _id: '665f1a2b3c4d5e6f7a8b9c0f', name: 'Kurtas', parentCategory: '665f1a2b3c4d5e6f7a8b9c0d' },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      name: 'Marketplace (Browse)',
      endpoints: [
        {
          method: 'GET',
          path: '/marketplace',
          auth: null,
          title: 'Search / filter products',
          srs: 'FR-6-01, FR-6-02',
          description: 'Full-text search plus filters. Only approved, non-deleted listings are ever returned.',
          queryParams: [
            { name: 'q', type: 'string', required: false, description: 'Full-text search across title/description/tags' },
            { name: 'categoryId', type: 'ObjectId', required: false },
            { name: 'minPrice', type: 'number', required: false },
            { name: 'maxPrice', type: 'number', required: false },
            { name: 'city', type: 'string', required: false, description: 'Matches the seller\u2019s city' },
            { name: 'minRating', type: 'number', required: false, description: '0\u20135' },
            { name: 'stockStatus', type: 'string', required: false, enum: ['in_stock', 'out_of_stock'] },
            { name: 'page', type: 'integer', required: false, default: 1 },
            { name: 'limit', type: 'integer', required: false, default: 20 },
          ],
        },
        { method: 'GET', path: '/marketplace/featured', auth: null, title: 'Featured products feed', queryParams: [{ name: 'limit', type: 'integer', required: false }] },
        { method: 'GET', path: '/marketplace/latest', auth: null, title: 'Latest products feed', queryParams: [{ name: 'limit', type: 'integer', required: false }] },
        { method: 'GET', path: '/marketplace/popular', auth: null, title: 'Popular products feed (by salesCount)', queryParams: [{ name: 'limit', type: 'integer', required: false }] },
        { method: 'GET', path: '/marketplace/recommended', auth: null, title: 'Recommended products feed (highest-rated proxy)', queryParams: [{ name: 'limit', type: 'integer', required: false }] },
        {
          method: 'GET',
          path: '/marketplace/sellers/:sellerId',
          auth: null,
          title: 'Seller storefront',
          pathParams: [{ name: 'sellerId', type: 'ObjectId' }],
          description: 'Public seller profile plus their approved product listings.',
        },
        {
          method: 'GET',
          path: '/marketplace/:productId',
          auth: null,
          title: 'Product detail',
          pathParams: [{ name: 'productId', type: 'ObjectId' }],
          description: 'Increments the product\u2019s viewCount as a side effect.',
        },
      ],
    },
    {
      name: 'Reviews',
      endpoints: [
        {
          method: 'GET',
          path: '/reviews/product/:productId',
          auth: null,
          title: 'List visible reviews for a product',
          pathParams: [{ name: 'productId', type: 'ObjectId' }],
        },
        {
          method: 'POST',
          path: '/reviews',
          auth: 'buyer',
          title: 'Submit a review',
          srs: 'FR-6-04',
          description: 'Only allowed if the buyer has a delivered order containing this product.',
          body: { productId: '{{product_id}}', orderId: '{{order_id}}', rating: 5, comment: 'Beautiful craftsmanship, exactly as pictured!' },
          bodyFieldNotes: ['productId: required, ObjectId', 'orderId: required, ObjectId \u2014 must be a delivered order', 'rating: required, integer 1\u20135', 'comment: optional, max 1000 chars'],
          successStatus: 201,
        },
        {
          method: 'PATCH',
          path: '/reviews/:reviewId',
          auth: 'buyer',
          title: 'Edit a review (within 48h edit window)',
          pathParams: [{ name: 'reviewId', type: 'ObjectId' }],
          body: { rating: 4, comment: 'Updated my rating after using it for a week.' },
          bodyFieldNotes: ['rating: optional, integer 1\u20135', 'comment: optional, max 1000 chars'],
        },
        {
          method: 'POST',
          path: '/reviews/:reviewId/report',
          auth: 'buyer',
          title: 'Report a review as fake/abusive',
          pathParams: [{ name: 'reviewId', type: 'ObjectId' }],
          body: { reason: 'This review appears to be fake \u2014 the reviewer never purchased this item.' },
          bodyFieldNotes: ['reason: required, max 500 chars'],
          successStatus: 201,
          description: 'Files a Report for admin review \u2014 does not hide the review itself (that requires admin action, see Admin \u2192 Reports).',
        },
      ],
    },
  ],
};
