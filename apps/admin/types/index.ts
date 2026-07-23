// ─── Domain types matching SRS Data Dictionary ────────────────────────────────

export type UserRole = 'seller' | 'buyer' | 'admin' | 'ngo_partner';
export type Language = 'ur' | 'en';
export type UserStatus = 'verified' | 'pending' | 'review' | 'blocked';
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'removed' | 'flagged';
export type OrderStatus = 'placed' | 'pickup_scheduled' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'cod';
export type ProductCategory = 'embroidery' | 'crafts' | 'food' | 'tailoring' | 'pottery' | 'beauty' | 'homedecor' | 'agri';
export type FlagSource = 'auto' | 'reported';
export type FlagReason = 'missing_safety_info' | 'ai_confidence_low' | 'image_quality' | 'duplicate_listing' | 'buyer_reported';
export type NGOStatus = 'active' | 'wellness' | 'onboarding' | 'inactive';
export type LessonStatus = 'live' | 'draft' | 'archived';
export type IntegrationStatus = 'healthy' | 'issues' | 'disconnected';
export type WellnessEmotion = 'khush' | 'theek' | 'udaas' | 'pareshan' | 'thaki';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  preferred_language: Language;
  city: string;
  categories?: ProductCategory[];
  status: UserStatus;
  gmv_pkr?: number;
  listings_count?: number;
  rating?: number;
  joined_at: string;
  wallet_verified?: boolean;
  removal_count?: number;
}

export interface Product {
  id: string;
  listing_id: string; // e.g. LST-8841
  seller_id: string;
  seller_name: string;
  seller_city: string;
  title_en: string;
  title_ur: string;
  description_en: string;
  description_ur: string;
  category: ProductCategory;
  category_path?: string; // e.g. "Crafts → Jewelry → Earrings"
  price_pkr: number;
  price_suggested_min?: number;
  price_suggested_max?: number;
  status: ProductStatus;
  images: string[];
  flag_source?: FlagSource;
  flag_reason?: FlagReason;
  submitted_at: string;
  ai_confidence?: number;
}

export interface Order {
  id: string;
  order_number: string; // e.g. OD-2841
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  product_id: string;
  items_count: number;
  amount_pkr: number;
  commission_pkr: number;
  payment_method: PaymentMethod;
  courier: 'TCS' | 'Leopards';
  status: OrderStatus;
  courier_booking_id?: string;
  pickup_window?: string;
  created_at: string;
  delivered_at?: string;
}

export interface NGOPartner {
  id: string;
  name: string;
  hq_city: string;
  cities_count: number;
  status: NGOStatus;
  sellers_count: number;
  orders_count: number;
  description?: string;
  is_crisis_partner?: boolean;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  trigger: string;
  cards_count: number;
  completions: number;
  avg_time_minutes: string;
  badge_name: string;
  status: LessonStatus;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  color: string;
  initials: string;
}

export interface DashboardStats {
  active_sellers: number;
  active_sellers_change: number;
  gmv_this_month_pkr: number;
  gmv_change: number;
  orders_this_month: number;
  orders_change: number;
  ai_listings: number;
  ai_listings_change: number;
}

export interface TopCategory {
  name: string;
  percentage: number;
  color: string;
}

export interface ModerationQueueItem {
  listing_id: string;
  product: Product;
  queue_position: number;
  age_minutes: number;
}

export interface AnalyticsStats {
  ai_listing_success_pct: number;
  ai_success_change: number;
  avg_generation_time_s: number;
  gen_time_change: number;
  wellness_checkins: number;
  wellness_change: number;
  lessons_completed: number;
  lessons_change: number;
}

export interface WellnessSentiment {
  khush: number;
  theek: number;
  pareshan: number;
  udaas: number;
  thaki: number;
  positive_pct: number;
}

export interface PayoutRecord {
  id: string;
  seller_id: string;
  seller_name: string;
  order_id: string;
  gross_pkr: number;
  commission_pkr: number;
  net_pkr: number;
  payment_method: PaymentMethod;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  due_at: string;
  paid_at?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: 'super_admin' | 'moderator' | 'support';
  initials: string;
}
