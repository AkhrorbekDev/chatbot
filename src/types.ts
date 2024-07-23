

export type User = {
    id: string;
    name: string;
    last_sean: string;
    avatar: string;

}

export type ContentTypes = [
    'text',
    'product',
    'image',
    'order_details',
    'product_features',
    'checkout',
]

export type Message = {
    user: User;
    created_at: string;
    content: string;
    content_type: keyof ContentTypes;
}

export type Action = {
    type: 'add_to_cart' | 'order_details_view' | 'get_product_features' | 'begin_checkout';
    payload: any;
    text: string;
    alias: string;
}

export type InstallmentPlan = {
    id: string;
    marga: number;
    max_period: number;
    min_period: number;
    first_fee: number;
}

export type Product = {
    name: string;
    id: string;
    price: number;
    image: string;
    description: string;
    discount: number;
    stock: number;
    plan: InstallmentPlan;
}
