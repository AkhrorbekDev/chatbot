export type User = {
    id: string;
    name: string;
    last_sean: string;
    avatar: string;
}

export enum ContentTypes {
    Text = 'text',
    Product = 'product',
    Image = 'image',
    OrdersView = 'orders_view',
    OrderDetails = 'order_details',
    ProductFeatures = 'product_features',
    Checkout = 'checkout',
}

export type Message = {
    user: User;
    id: number;
    created_at: string;
    content?: string | [];
    owner?: boolean;
    content_type: ContentTypes;
}

export type Action = {
    type: 'add_to_cart' | 'order_details_view' | 'get_product_features' | 'begin_checkout' | 'pay_now';
    text: string;
    icon?: string;
    alias: string;
    payload?: any;
}

export type InstallmentPlan = {
    id: string;
    marga: number;
    max_period: number;
    min_period: number;
    first_fee: number;
}

export type ProductFeature = {
    name: string;
    value: string;
}

export type Product = {
    name: string;
    id: string;
    price: number;
    image: string;
    description: string;
    discount?: number;
    stock?: number;
    features?: ProductFeature[];
    plan?: InstallmentPlan;
}

export type Order = {
    id: string;
    products?: Array<Product & { quantity: number }>;
    total_price: number;
    debt_price: number;
    created_at: string;
    address: string;
    payed: number
    next_payment: string;
}

export type OrderDetailsMessage = Message & {
    content_type: ContentTypes.OrderDetails;
    order: Order;
    actions?: Action[];
}

export type OrderViewMessage = Message & {
    content_type: ContentTypes.OrdersView;
    orders: Order[];
    actions?: Action[];
}

export type ProductMessage = Message & {
    content_type: ContentTypes.Product;
    product: Product;
    actions?: Action[];
}

export type SampleMessage = Message & {
    actions?: Action[];
}

export type AnyMessage = Message | OrderDetailsMessage | OrderViewMessage | ProductMessage | SampleMessage;
