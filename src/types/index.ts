export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  details: string[];
  careInstructions?: string[];
  price: number; // in NGN (Nigerian Naira)
  compareAtPrice?: number; // original price for sales
  category: string;
  collection?: string;
  images: string[];
  featuredImage: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  variants?: ProductVariant[];
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  itemCount?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'verified' | 'failed' | 'refunded';

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string; // Nigerian State (e.g. Lagos, Abuja FCT, Rivers)
  postalCode?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. MV-2409-1082
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'paystack' | 'bank_transfer' | 'test_mode';
  paystackReference?: string;
  paystackPaidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  announcementText: string;
  announcementEnabled: boolean;
  brandSlogan: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsApp: string;
  contactAddress: string;
  deliveryFees: {
    state: string;
    fee: number;
  }[];
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number; // 0 means no free shipping
  instagramHandle: string;
  twitterHandle: string;
  tiktokHandle: string;
  paystackPublicKey: string;
  isPaystackLive: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
}
