// ============================================================
// PRODUCT TYPES
// ============================================================
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    costPrice?: number;
    stockQuantity: number;
    imageUrl?: string;
    vendorName?: string;
    rating?: number;
    reviews?: number;
    discount?: number;
    isActive: boolean;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

// ============================================================
// CART TYPES
// ============================================================
export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}

export interface Cart {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
}

// ============================================================
// ORDER TYPES
// ============================================================
export interface OrderItem {
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}

export interface Order {
    id: number;
    userId: number;
    orderDate: string;
    totalAmount: number;
    status: string;
    shippingAddress: string;
    paymentMethod: string;
    items: OrderItem[];
    paymentTransactionId?: string;
    cardLastFour?: string;
    phoneNumber?: string;
    payPalEmail?: string;
    deliveryInstructions?: string;
    isPaymentConfirmed: boolean;
    paymentConfirmedAt?: string;
}

// ============================================================
// AUTHENTICATION TYPES
// ============================================================
export interface AuthResponse {
    userId: number;
    username: string;
    email: string;
    token: string;
    role: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

// ============================================================
// STORE SETTINGS TYPES
// ============================================================
export interface Owner {
    name: string;
}

export interface StoreSettings {
    id: number;
    storeName: string;
    address: string;
    location: string;
    owners: Owner[];
    mobileNumbers: string[];
    emails: string[];
    landline: string;
    whatsapp: string;
}

// ============================================================
// VENDOR TYPES
// ============================================================
export interface Vendor {
    id: number;
    username: string;
    email: string;
    role: string;
    logo?: string;
    rating?: number;
    followers?: number;
    productsCount?: number;
    isVerified?: boolean;
}

// ============================================================
// CATEGORY TYPES
// ============================================================
export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    count: number;
}

// ============================================================
// WISHLIST / FAVORITES
// ============================================================
export interface WishlistItem {
    id: number;
    productId: number;
    userId: number;
    product: Product;
    addedAt: string;
}

// ============================================================
// REVIEW / RATING TYPES
// ============================================================
export interface Review {
    id: number;
    productId: number;
    userId: number;
    username: string;
    rating: number;
    comment: string;
    createdAt: string;
}

// ============================================================
// PAYMENT TYPES
// ============================================================
export interface PaymentIntent {
    id: string;
    clientSecret: string;
    amount: number;
    currency: string;
    status: string;
}

// ============================================================
// CHAT TYPES
// ============================================================
export interface UserDto {
    id: number;
    username: string;
    role: string;
}

export interface ConversationDto {
    id: number;
    otherUserId: number;
    otherUserName: string;
    otherUserRole: string;
    lastMessageAt?: string;
    lastMessageContent?: string;
}

export interface MessageDto {
    id: number;
    senderId: number;
    senderName: string;
    content: string;
    sentAt: string;
    isRead: boolean;
}

// ============================================================
// SUGGESTION TYPES
// ============================================================
export interface ProductSuggestionCreateDto {
    name: string;
    description?: string;
    category?: string;
    vendorId?: number;
    suggestedPrice?: number;
    estimatedCostPrice?: number;
    suggestedStockQuantity?: number;
    notes?: string;
}

export interface ProductSuggestionResponseDto {
    id: number;
    name: string;
    description?: string;
    category?: string;
    vendorId?: number;
    vendorName?: string;
    suggestedPrice?: number;
    estimatedCostPrice?: number;
    suggestedStockQuantity?: number;
    imageData?: string;
    notes?: string;
    status: string;
    adminNote?: string;
    createdAt: string;
    reviewedAt?: string;
    suggestedByUsername: string;
    reviewedByUsername?: string;
}

// ============================================================
// STORE TYPES (NEW)
// ============================================================
export interface StoreResponseDto {
    id: number;
    name: string;
    logoUrl?: string;
    description?: string;
    vendorId: number;
    vendorUsername: string;
    isActive: boolean;
    createdAt: string;
    productCount: number;
}

export interface StoreCreateDto {
    name: string;
    logoUrl?: string;
    description?: string;
    vendorId: number;
}

export interface StoreUpdateDto {
    name: string;
    logoUrl?: string;
    description?: string;
    isActive: boolean;
}