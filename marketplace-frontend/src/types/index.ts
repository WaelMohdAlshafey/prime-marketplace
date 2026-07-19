export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;          // Sales price (customer visible)
    costPrice: number;      // Internal cost (hidden from customers)
    stockQuantity: number;
    vendorId: number;
    imageUrl?: string;
    isActive: boolean;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

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

export interface OrderItem {
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
}

export interface Order {
    id: number;
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

export interface AuthResponse {
    userId: number;
    username: string;
    email: string;
    token: string;
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
// STORE SETTINGS (from database)
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