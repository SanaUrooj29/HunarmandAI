// Central mock data — replace with real API calls once backend is ready

export const SELLER = {
  id: 'seller-001',
  name: 'Fatima Aslam',
  phone: '+92 312 4567890',
  city: 'Lahore',
  categories: ['Embroidery', 'Crafts'],
  initials: 'FA',
  storeName: "Fatima's Crafts",
  storefrontSlug: 'fatima-aslam',
  rating: 4.8,
  reviewCount: 47,
  badges: ['Pricing Expert'],
  isVerified: true,
  wallet: {
    jazzcash: { last4: '7890', verified: true },
    easypaisa: null,
  },
}

export const EARNINGS = {
  thisMonth: 24850,
  lastMonth: 21050,
  growth: 18,
  pending: 4200,
  nextPayoutDate: 'Tue, 6 May',
  total: 107450,
  completedSales: 2,
  monthly: [
    { month: 'Jan', amount: 18200 },
    { month: 'Feb', amount: 21500 },
    { month: 'Mar', amount: 19800 },
    { month: 'Apr', amount: 21050 },
    { month: 'May', amount: 24850 },
  ],
}

export const ORDERS = [
  {
    id: 'OD-2841',
    product: 'Phulkari Dupatta',
    productId: '1',
    buyer: 'Ayesha Khan',
    buyerPhone: '+92 300 1234567',
    price: 3200,
    payout: 3040,
    status: 'preparing',
    date: 'Today',
    window: '10AM–2PM',
    address: 'House 12, Street 4, Model Town, Lahore',
  },
  {
    id: 'OD-2840',
    product: 'Mirror Cushion x2',
    productId: '2',
    buyer: 'Hassan Tariq',
    buyerPhone: '+92 333 9876543',
    price: 1800,
    payout: 1710,
    status: 'shipped',
    date: 'Yesterday',
    window: null,
    address: 'DHA Phase 5, Lahore',
  },
  {
    id: 'OD-2839',
    product: 'Block-Print Stole',
    productId: '3',
    buyer: 'Sumaira Rauf',
    buyerPhone: '+92 321 5554444',
    price: 2400,
    payout: 2280,
    status: 'shipped',
    date: 'May 3',
    window: null,
    address: 'Gulberg III, Lahore',
  },
  {
    id: 'OD-2837',
    product: 'Embroidered Shawl',
    productId: '5',
    buyer: 'Imran Shah',
    buyerPhone: '+92 300 7778888',
    price: 4500,
    payout: 4275,
    status: 'delivered',
    date: 'May 1',
    window: null,
    address: 'Johar Town, Lahore',
  },
  {
    id: 'OD-2836',
    product: 'Beaded Necklace',
    productId: '6',
    buyer: 'Nida Akhtar',
    buyerPhone: '+92 312 0001111',
    price: 1200,
    payout: 1140,
    status: 'delivered',
    date: 'Apr 28',
    window: null,
    address: 'Bahria Town, Lahore',
  },
  {
    id: 'OD-2835',
    product: 'Hand-stitched Tote',
    productId: '4',
    buyer: 'Zara Malik',
    buyerPhone: '+92 311 2223333',
    price: 950,
    payout: 902,
    status: 'pending',
    date: '2 min ago',
    window: null,
    address: 'Cantt, Lahore',
  },
]

export const PRODUCTS = [
  { id: '1', title: 'Phulkari Dupatta', titleUr: 'پھلکاری دوپٹہ', price: 3200, category: 'Embroidery', subCategory: 'Phulkari', status: 'live', qty: 5, color: '#E27D60' },
  { id: '2', title: 'Mirror Cushion x2', titleUr: 'آئینہ کشن', price: 1800, category: 'Crafts', subCategory: 'Cushions', status: 'live', qty: 3, color: '#1F7A8C' },
  { id: '3', title: 'Block-Print Stole', titleUr: 'بلاک پرنٹ دوشالہ', price: 2400, category: 'Embroidery', subCategory: 'Block Print', status: 'live', qty: 2, color: '#c47a5a' },
  { id: '4', title: 'Hand-stitched Tote', titleUr: 'ہاتھ سے سلا تھیلا', price: 950, category: 'Crafts', subCategory: 'Bags', status: 'draft', qty: 0, color: '#8a9e6c' },
  { id: '5', title: 'Embroidered Shawl', titleUr: 'کڑھائی والی شال', price: 4500, category: 'Embroidery', subCategory: 'Shawls', status: 'live', qty: 1, color: '#7a6591' },
  { id: '6', title: 'Beaded Necklace', titleUr: 'موتیوں کا ہار', price: 1200, category: 'Jewelry', subCategory: 'Necklaces', status: 'live', qty: 8, color: '#c9a96e' },
]

export const TRANSACTIONS = [
  { id: 'TX-001', product: 'Embroidered Shawl', buyer: 'Imran Shah', gross: 4500, commission: 225, net: 4275, date: 'Today', status: 'paid' },
  { id: 'TX-002', product: 'Phulkari Dupatta', buyer: 'Ayesha K.', gross: 3200, commission: 160, net: 3040, date: 'Yesterday', status: 'paid' },
  { id: 'TX-003', product: 'Mirror Cushion x2', buyer: 'Hassan T.', gross: 1800, commission: 90, net: 1710, date: 'May 3', status: 'pending' },
  { id: 'TX-004', product: 'Block-Print Stole', buyer: 'Sumaira R.', gross: 2400, commission: 120, net: 2280, date: 'May 2', status: 'pending' },
]

export const LESSONS = [
  { id: 'pricing-basics', title: 'Pricing Basics', sub: 'Set a price that works', done: true, badge: 'Pricing Expert', duration: '3 min', cards: 4 },
  { id: 'photo-tips', title: 'Photographing Products', sub: 'Light, angle, background', done: true, badge: null, duration: '2 min', cards: 3 },
  { id: 'writing-titles', title: 'Writing a Title That Sells', sub: 'Keywords buyers search for', done: false, badge: null, duration: '3 min', cards: 4, locked: false },
  { id: 'profit-margins', title: 'Calculating Profit Margins', sub: 'Materials + time = fair price', done: false, badge: null, duration: '2 min', cards: 3, locked: false, isNew: true },
  { id: 'whatsapp-marketing', title: 'WhatsApp for Marketing', sub: 'Share your storefront link', done: false, badge: null, duration: '4 min', cards: 5, locked: true },
  { id: 'customer-service', title: 'Handling Customer Questions', sub: 'Build trust, get 5 stars', done: false, badge: null, duration: '3 min', cards: 4, locked: true },
  { id: 'repeat-buyers', title: 'Building Repeat Buyers', sub: 'Follow-up, packaging, loyalty', done: false, badge: null, duration: '5 min', cards: 6, locked: true },
]

export const LESSON_CONTENT: Record<string, { cards: Array<{ title: string; body: string; tip?: string }> }> = {
  'profit-margins': {
    cards: [
      {
        title: 'What is a profit margin?',
        body: 'Profit margin is the money left over after you subtract your costs from your selling price. If you sell a dupatta for PKR 3,200 and it cost you PKR 2,000 to make, your profit is PKR 1,200.',
        tip: 'Always calculate before setting a price!',
      },
      {
        title: 'Count every cost',
        body: 'Your costs include: raw materials (thread, fabric), your time (hours × your hourly rate), packaging, and transport. Many sellers forget to count their own time — that is your most valuable cost.',
        tip: 'Write down every rupee you spend on a product.',
      },
      {
        title: 'The 3× rule',
        body: 'A simple starting point: charge at least 3 times your material cost. If thread + fabric = PKR 800, your minimum price should be PKR 2,400. This covers your time and leaves some profit.',
        tip: 'Premium handmade work can charge even more — buyers pay for quality!',
      },
    ],
  },
  'writing-titles': {
    cards: [
      {
        title: 'Put the most important word first',
        body: 'Buyers scan quickly. Start with the product type: "Phulkari Dupatta" not "Beautiful hand-made traditional…". The first two words decide if they keep reading.',
        tip: 'Think: what would a buyer type into search?',
      },
      {
        title: 'Add one specific detail',
        body: 'After the product name, add one thing that makes it special: the colour, size, material, or technique. "Phulkari Dupatta — Cream Cotton" beats "Phulkari Dupatta".',
        tip: 'Colour and material are what buyers filter by.',
      },
      {
        title: 'Keep it under 10 words',
        body: 'Long titles look cluttered on mobile screens where most buyers shop. Aim for 6–10 words. Let the description do the rest.',
        tip: 'Read your title aloud. Does it sound natural?',
      },
      {
        title: 'Use both English and Urdu',
        body: 'HunarmandAI shows both languages on your listing. Your Urdu title helps local buyers searching in Urdu, while English reaches NGO and urban buyers.',
      },
    ],
  },
}
