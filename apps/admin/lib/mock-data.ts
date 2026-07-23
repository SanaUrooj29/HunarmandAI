import type {
  User, Product, Order, NGOPartner, Lesson, Integration,
  DashboardStats, TopCategory, AnalyticsStats, WellnessSentiment,
  PayoutRecord, ModerationQueueItem
} from '../types';

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardStats: DashboardStats = {
  active_sellers: 1247,
  active_sellers_change: 18,
  gmv_this_month_pkr: 4820000,
  gmv_change: 24,
  orders_this_month: 3418,
  orders_change: 12,
  ai_listings: 892,
  ai_listings_change: 31,
};

export const topCategories: TopCategory[] = [
  { name: 'Embroidery', percentage: 38, color: '#E27D60' },
  { name: 'Crafts', percentage: 24, color: '#1F7A8C' },
  { name: 'Food', percentage: 18, color: '#B5945E' },
  { name: 'Tailoring', percentage: 12, color: '#4CAF7D' },
  { name: 'Pottery', percentage: 8, color: '#F0B429' },
];

export const marketplaceActivity = {
  '7d': [
    { day: 'Mon', orders: 58, listings: 32 },
    { day: 'Tue', orders: 72, listings: 41 },
    { day: 'Wed', orders: 65, listings: 38 },
    { day: 'Thu', orders: 89, listings: 52 },
    { day: 'Fri', orders: 94, listings: 47 },
    { day: 'Sat', orders: 110, listings: 61 },
    { day: 'Sun', orders: 103, listings: 55 },
  ],
  '30d': Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    orders: 40 + Math.floor(Math.sin(i * 0.4) * 20 + Math.random() * 30 + i * 2.5),
    listings: 25 + Math.floor(Math.sin(i * 0.35) * 12 + Math.random() * 18 + i * 1.5),
  })),
  '90d': Array.from({ length: 90 }, (_, i) => ({
    day: `${i + 1}`,
    orders: 30 + Math.floor(Math.sin(i * 0.15) * 25 + Math.random() * 40 + i * 1.2),
    listings: 18 + Math.floor(Math.sin(i * 0.12) * 15 + Math.random() * 22 + i * 0.8),
  })),
  '1y': Array.from({ length: 12 }, (_, i) => ({
    day: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    orders: 800 + Math.floor(Math.sin(i * 0.5) * 300 + i * 120),
    listings: 500 + Math.floor(Math.sin(i * 0.4) * 180 + i * 70),
  })),
};

export const needsAttention = [
  { id: '1', type: 'moderation', count: 12, label: 'listings flagged for review', detail: 'Auto-detected by content filter', color: '#C47A1F' },
  { id: '2', type: 'courier', count: 3, label: 'courier bookings failed', detail: 'Leopards API · retry attempts exhausted', color: '#C0392B' },
  { id: '3', type: 'verification', count: 8, label: 'new sellers awaiting verification', detail: 'JazzCash micro-transfer pending', color: '#1F7A8C' },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const sellers: User[] = [
  { id: 'u1', name: 'Fatima Aslam', phone: '+92···3000', role: 'seller', preferred_language: 'ur', city: 'Lahore', categories: ['embroidery'], status: 'verified', listings_count: 14, gmv_pkr: 248500, rating: 4.8, joined_at: 'Mar 12', wallet_verified: true, removal_count: 0 },
  { id: 'u2', name: 'Khadija Bibi', phone: '+92···3001', role: 'seller', preferred_language: 'ur', city: 'Hyderabad', categories: ['crafts'], status: 'verified', listings_count: 7, gmv_pkr: 145200, rating: 5.0, joined_at: 'Mar 18', wallet_verified: true, removal_count: 0 },
  { id: 'u3', name: 'Naheed Khan', phone: '+92···3002', role: 'seller', preferred_language: 'ur', city: 'Multan', categories: ['tailoring'], status: 'verified', listings_count: 12, gmv_pkr: 198400, rating: 4.7, joined_at: 'Mar 22', wallet_verified: true, removal_count: 0 },
  { id: 'u4', name: 'Rabia Zaman', phone: '+92···3003', role: 'seller', preferred_language: 'ur', city: 'Karachi', categories: ['food', 'crafts'], status: 'review', listings_count: 8, gmv_pkr: 89300, rating: 4.6, joined_at: 'Apr 02', wallet_verified: false, removal_count: 0 },
  { id: 'u5', name: 'Saima Bibi', phone: '+92···3004', role: 'seller', preferred_language: 'ur', city: 'Lahore', categories: ['embroidery'], status: 'verified', listings_count: 6, gmv_pkr: 67800, rating: 4.5, joined_at: 'Apr 08', wallet_verified: true, removal_count: 0 },
  { id: 'u6', name: 'Nida Akhtar', phone: '+92···3005', role: 'seller', preferred_language: 'ur', city: 'Faisalabad', categories: ['beauty'], status: 'pending', listings_count: 4, gmv_pkr: 34200, rating: 4.9, joined_at: 'Apr 18', wallet_verified: false, removal_count: 0 },
  { id: 'u7', name: 'Mehnaz Bibi', phone: '+92···3006', role: 'seller', preferred_language: 'ur', city: 'Multan', categories: ['pottery'], status: 'verified', listings_count: 9, gmv_pkr: 112400, rating: 4.4, joined_at: 'Apr 22', wallet_verified: true, removal_count: 0 },
];

export const buyers: User[] = [
  { id: 'b1', name: 'Ayesha K.', phone: '+92···4001', role: 'buyer', preferred_language: 'en', city: 'Karachi', status: 'verified', joined_at: 'Feb 10' },
  { id: 'b2', name: 'Hassan T.', phone: '+92···4002', role: 'buyer', preferred_language: 'en', city: 'Lahore', status: 'verified', joined_at: 'Feb 22' },
  { id: 'b3', name: 'Sumaira R.', phone: '+92···4003', role: 'buyer', preferred_language: 'ur', city: 'Islamabad', status: 'verified', joined_at: 'Mar 05' },
  { id: 'b4', name: 'Imran S.', phone: '+92···4004', role: 'buyer', preferred_language: 'en', city: 'Karachi', status: 'verified', joined_at: 'Mar 18' },
  { id: 'b5', name: 'Nida A.', phone: '+92···4005', role: 'buyer', preferred_language: 'ur', city: 'Multan', status: 'pending', joined_at: 'Apr 01' },
  { id: 'b6', name: 'Mehnaz B.', phone: '+92···4006', role: 'buyer', preferred_language: 'ur', city: 'Lahore', status: 'verified', joined_at: 'Apr 15' },
];

// ─── Moderation ───────────────────────────────────────────────────────────────
export const flaggedListings: Product[] = [
  {
    id: 'p1', listing_id: 'LST-8841', seller_id: 'u4', seller_name: 'Rabia Zaman', seller_city: 'Karachi',
    title_en: 'Hand-Poured Resin Earrings with Gold Glitter', title_ur: 'گلٹر رِیزن بالیاں',
    description_en: 'Each pair of earrings is hand-poured with eco-resin and gold leaf flakes. Lightweight, hypoallergenic posts. Available in 4 colors.',
    description_ur: 'ہر جوڑی ایکو-ریزن اور گولڈ لیف سے بنائی گئی ہے۔',
    category: 'crafts', category_path: 'Crafts → Jewelry → Earrings',
    price_pkr: 1200, price_suggested_min: 950, price_suggested_max: 1500,
    status: 'flagged', images: [], flag_source: 'auto', flag_reason: 'missing_safety_info',
    submitted_at: '8m ago', ai_confidence: 92,
  },
  {
    id: 'p2', listing_id: 'LST-8834', seller_id: 'u2', seller_name: 'Khadija', seller_city: 'Hyderabad',
    title_en: 'Sindhi Ralli Quilt', title_ur: 'سندھی رلی',
    description_en: 'Traditional hand-stitched Sindhi ralli quilt, queen size.', description_ur: 'روایتی ہاتھ سے بنی سندھی رلی۔',
    category: 'crafts', price_pkr: 4500,
    status: 'flagged', images: [], flag_source: 'auto', flag_reason: 'ai_confidence_low',
    submitted_at: '32m ago', ai_confidence: 58,
  },
  {
    id: 'p3', listing_id: 'LST-8820', seller_id: 'u5', seller_name: 'Saima', seller_city: 'Lahore',
    title_en: 'Achaar Pickle Jar 500g', title_ur: 'اچار 500 گرام',
    description_en: 'Home-made mixed achaar. Tangy and spicy.', description_ur: 'گھر کا بنا ہوا مکس اچار۔',
    category: 'food', price_pkr: 350,
    status: 'flagged', images: [], flag_source: 'reported', flag_reason: 'buyer_reported',
    submitted_at: '1h ago',
  },
  {
    id: 'p4', listing_id: 'LST-8811', seller_id: 'u7', seller_name: 'Mehnaz', seller_city: 'Multan',
    title_en: 'Hand-Stamped Tiles', title_ur: 'ہاتھ سے مہر لگی ٹائلیں',
    description_en: 'Decorative ceramic tiles with hand-stamped Sindhi patterns.', description_ur: 'ہاتھ سے مہر لگی سیرامک ٹائلیں۔',
    category: 'pottery', price_pkr: 800,
    status: 'flagged', images: [], flag_source: 'auto', flag_reason: 'image_quality',
    submitted_at: '3h ago',
  },
  {
    id: 'p5', listing_id: 'LST-8798', seller_id: 'u5', seller_name: 'Sumaira', seller_city: 'Lahore',
    title_en: 'Beaded Clutch Bag', title_ur: 'موتیوں کا کلچ',
    description_en: 'Hand-beaded clutch bag, bridal style.', description_ur: 'ہاتھ سے موتی لگا کلچ۔',
    category: 'crafts', price_pkr: 2200,
    status: 'flagged', images: [], flag_source: 'auto', flag_reason: 'duplicate_listing',
    submitted_at: '5h ago',
  },
  {
    id: 'p6', listing_id: 'LST-8780', seller_id: 'u6', seller_name: 'Nida', seller_city: 'Faisalabad',
    title_en: 'Henna Cones (set of 5)', title_ur: 'مہندی کونز',
    description_en: 'Natural brown henna cones, set of 5.', description_ur: 'قدرتی بھوری مہندی کونز۔',
    category: 'beauty', price_pkr: 250,
    status: 'flagged', images: [], flag_source: 'reported', flag_reason: 'buyer_reported',
    submitted_at: '8h ago',
  },
];

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders: Order[] = [
  { id: 'o1', order_number: 'OD-2841', buyer_id: 'b1', buyer_name: 'Ayesha K.', seller_id: 'u1', seller_name: "Fatima's Crafts", product_id: 'p1', items_count: 1, amount_pkr: 3200, commission_pkr: 160, payment_method: 'jazzcash', courier: 'TCS', status: 'pickup_scheduled', created_at: '2h ago' },
  { id: 'o2', order_number: 'OD-2840', buyer_id: 'b2', buyer_name: 'Hassan T.', seller_id: 'u1', seller_name: "Fatima's Crafts", product_id: 'p2', items_count: 2, amount_pkr: 1800, commission_pkr: 90, payment_method: 'easypaisa', courier: 'Leopards', status: 'in_transit', created_at: '4h ago' },
  { id: 'o3', order_number: 'OD-2839', buyer_id: 'b3', buyer_name: 'Sumaira R.', seller_id: 'u3', seller_name: 'Naheed Studio', product_id: 'p3', items_count: 1, amount_pkr: 4800, commission_pkr: 240, payment_method: 'jazzcash', courier: 'TCS', status: 'in_transit', created_at: '6h ago' },
  { id: 'o4', order_number: 'OD-2838', buyer_id: 'b4', buyer_name: 'Imran S.', seller_id: 'u2', seller_name: 'Khadija Quilts', product_id: 'p4', items_count: 1, amount_pkr: 6800, commission_pkr: 340, payment_method: 'cod', courier: 'Leopards', status: 'pickup_scheduled', created_at: '8h ago' },
  { id: 'o5', order_number: 'OD-2837', buyer_id: 'b5', buyer_name: 'Nida A.', seller_id: 'u5', seller_name: 'Saima Threads', product_id: 'p5', items_count: 3, amount_pkr: 4500, commission_pkr: 225, payment_method: 'jazzcash', courier: 'TCS', status: 'delivered', created_at: '1d ago', delivered_at: '6h ago' },
  { id: 'o6', order_number: 'OD-2836', buyer_id: 'b6', buyer_name: 'Mehnaz B.', seller_id: 'u4', seller_name: 'Rabia Crafts', product_id: 'p6', items_count: 2, amount_pkr: 2800, commission_pkr: 140, payment_method: 'easypaisa', courier: 'Leopards', status: 'placed', created_at: '1d ago' },
];

export const orderStats = {
  confirmed: { count: 284, change: 8 },
  in_transit: { count: 612, change: 14 },
  delivered: { count: 2389, change: 22 },
  issues: { count: 33, change: -12 },
};

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsStats: AnalyticsStats = {
  ai_listing_success_pct: 94.2,
  ai_success_change: 3,
  avg_generation_time_s: 6.4,
  gen_time_change: -12,
  wellness_checkins: 412,
  wellness_change: 18,
  lessons_completed: 1284,
  lessons_change: 26,
};

export const aiGenerationLatency = [
  { day: 'Mon', time: 8 },
  { day: 'Tue', time: 10 },
  { day: 'Wed', time: 7 },
  { day: 'Thu', time: 10 },
  { day: 'Fri', time: 9 },
  { day: 'Sat', time: 11 },
  { day: 'Sun', time: 9 },
];

export const wellnessSentiment: WellnessSentiment = {
  khush: 38,
  theek: 34,
  pareshan: 14,
  udaas: 9,
  thaki: 5,
  positive_pct: 72,
};

export const topSellers = [
  { id: 'u1', name: "Fatima's Crafts", initials: 'FA', rank: 1, gmv_pkr: 248500, orders: 84 },
  { id: 'u2', name: 'Khadija Quilts', initials: 'KH', rank: 2, gmv_pkr: 198000, orders: 31 },
  { id: 'u3', name: 'Naheed Studio', initials: 'NA', rank: 3, gmv_pkr: 145200, orders: 56 },
  { id: 'u4', name: 'Rabia Crafts', initials: 'RZ', rank: 4, gmv_pkr: 112400, orders: 67 },
];

// ─── NGO Partners ─────────────────────────────────────────────────────────────
export const ngoPartners: NGOPartner[] = [
  { id: 'n1', name: 'Kashf Foundation', hq_city: 'Lahore', cities_count: 8, status: 'active', sellers_count: 124, orders_count: 482 },
  { id: 'n2', name: 'Akhuwat', hq_city: 'Islamabad', cities_count: 12, status: 'active', sellers_count: 87, orders_count: 318 },
  { id: 'n3', name: 'Aurat Foundation', hq_city: 'Karachi', cities_count: 5, status: 'active', sellers_count: 56, orders_count: 201 },
  { id: 'n4', name: 'Taskeen', hq_city: 'Nationwide', cities_count: 0, status: 'wellness', sellers_count: 0, orders_count: 0, description: 'Crisis routing partner', is_crisis_partner: true },
  { id: 'n5', name: 'SBP Banking the Unbanked', hq_city: 'Financial inclusion', cities_count: 0, status: 'active', sellers_count: 28, orders_count: 96 },
  { id: 'n6', name: 'Behbud Association', hq_city: 'Islamabad', cities_count: 3, status: 'onboarding', sellers_count: 17, orders_count: 54 },
];

// ─── Learning content ─────────────────────────────────────────────────────────
export const lessons: Lesson[] = [
  { id: 'pricing-basics', number: 1, title: 'Pricing Basics', trigger: 'First product published', cards_count: 3, completions: 312, avg_time_minutes: '2:14', badge_name: 'Pricing Expert', status: 'live' },
  { id: 'photo-products', number: 2, title: 'Photographing Products', trigger: 'After 3 listings', cards_count: 3, completions: 198, avg_time_minutes: '3:02', badge_name: 'Sharp Eye', status: 'live' },
  { id: 'writing-titles', number: 3, title: 'Writing Titles That Sell', trigger: 'Manual', cards_count: 2, completions: 142, avg_time_minutes: '1:48', badge_name: 'Wordsmith', status: 'live' },
  { id: 'profit-margins', number: 4, title: 'Calculating Profit Margins', trigger: 'Underpricing ×3', cards_count: 3, completions: 84, avg_time_minutes: '3:24', badge_name: 'Number Sense', status: 'live' },
  { id: 'handling-returns', number: 5, title: 'Handling Returns', trigger: 'First return request', cards_count: 2, completions: 31, avg_time_minutes: '2:18', badge_name: 'Trust Builder', status: 'live' },
  { id: 'promoting-whatsapp', number: 6, title: 'Promoting on WhatsApp', trigger: 'Manual', cards_count: 3, completions: 47, avg_time_minutes: '2:50', badge_name: 'Reach Out', status: 'live' },
  { id: 'tax-basics', number: 7, title: 'Tax Basics for Sellers', trigger: 'GMV > PKR 100k', cards_count: 3, completions: 0, avg_time_minutes: '—', badge_name: 'Tax Smart', status: 'draft' },
];

// ─── Integrations ──────────────────────────────────────────────────────────────
export const integrations: Integration[] = [
  { id: 'jazzcash', name: 'JazzCash', description: 'Connected · merchant ID JC-PK-2841', status: 'healthy', color: '#C0392B', initials: 'JC' },
  { id: 'easypaisa', name: 'EasyPaisa', description: 'Connected · merchant ID EP-3192', status: 'healthy', color: '#27AE60', initials: 'EP' },
  { id: 'tcs', name: 'TCS Courier', description: 'Connected · 247 pickups today', status: 'healthy', color: '#F39C12', initials: 'TC' },
  { id: 'leopards', name: 'Leopards', description: 'API errors detected · 2 retries', status: 'issues', color: '#E74C3C', initials: 'LE' },
  { id: 'anthropic', name: 'Anthropic Claude', description: 'claude-sonnet-4-6 · 892 calls today', status: 'healthy', color: '#E27D60', initials: 'AI' },
  { id: 'supabase', name: 'Supabase', description: 'Connected · postgres-15', status: 'healthy', color: '#3ECF8E', initials: 'SB' },
];

// ─── Payouts ──────────────────────────────────────────────────────────────────
export const payouts: PayoutRecord[] = [
  { id: 'py1', seller_id: 'u1', seller_name: 'Fatima Aslam', order_id: 'OD-2837', gross_pkr: 4500, commission_pkr: 225, net_pkr: 4275, payment_method: 'jazzcash', status: 'paid', due_at: '2d ago', paid_at: '1d ago' },
  { id: 'py2', seller_id: 'u3', seller_name: 'Naheed Khan', order_id: 'OD-2831', gross_pkr: 3200, commission_pkr: 160, net_pkr: 3040, payment_method: 'easypaisa', status: 'pending', due_at: 'Tomorrow' },
  { id: 'py3', seller_id: 'u2', seller_name: 'Khadija Bibi', order_id: 'OD-2829', gross_pkr: 6800, commission_pkr: 340, net_pkr: 6460, payment_method: 'jazzcash', status: 'processing', due_at: 'Today' },
  { id: 'py4', seller_id: 'u7', seller_name: 'Mehnaz Bibi', order_id: 'OD-2820', gross_pkr: 1200, commission_pkr: 60, net_pkr: 1140, payment_method: 'jazzcash', status: 'failed', due_at: '3d ago' },
  { id: 'py5', seller_id: 'u4', seller_name: 'Rabia Zaman', order_id: 'OD-2816', gross_pkr: 2800, commission_pkr: 140, net_pkr: 2660, payment_method: 'easypaisa', status: 'pending', due_at: 'Tomorrow' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function formatPKR(amount: number): string {
  if (amount >= 1000000) return `Rs ${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `PKR ${amount.toLocaleString()}`;
  return `PKR ${amount}`;
}

export function getAvatarColor(name: string): string {
  const colors = [
    '#E27D60', '#1F7A8C', '#8E6FAF', '#4CAF7D', '#F0B429',
    '#E74C3C', '#3498DB', '#9B59B6', '#16A085', '#D35400',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export function getInitials(name: string): string {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}
