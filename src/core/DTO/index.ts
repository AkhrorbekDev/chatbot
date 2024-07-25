// Importing types
import type {
    User,
    ContentTypes,
    Action,
    Product,
    Order,
    OrderDetailsMessage,
    OrderViewMessage,
    ProductMessage,
    SampleMessage
} from '../../types';

// DTO Functions with single parameter object

interface OrderDetailsMessageParams {
    user: User;
    created_at: string;
    content: string | [];
    content_type: keyof ContentTypes;
    order: Order;
    actions: Action[];
}

interface OrderViewMessageParams {
    user: User;
    created_at: string;
    content: string | [];
    content_type: keyof ContentTypes;
    orders: Order[];
}

interface ProductMessageParams {
    user: User;
    created_at: string;
    content: string | [];
    content_type: keyof ContentTypes;
    product: Product;
    actions: Action[];
}

interface SampleMessageParams {
    user: User;
    created_at: string;
    content: string | [];
    content_type: keyof ContentTypes;
    actions: Action[];
}

export const createOrderDetailsMessageDTO = (
    params: OrderDetailsMessageParams
): OrderDetailsMessage => ({
    ...params.order,
    user: params.user,
    created_at: params.created_at,
    content: params.content,
    content_type: params.content_type,
    actions: params.actions
});

export const createOrderViewMessageDTO = (
    params: OrderViewMessageParams
): OrderViewMessage => ({
    user: params.user,
    created_at: params.created_at,
    content: params.content,
    content_type: params.content_type,
    orders: params.orders
});

export const createProductMessageDTO = (
    params: ProductMessageParams
): ProductMessage => ({
    user: params.user,
    created_at: params.created_at,
    content: params.content,
    content_type: params.content_type,
    product: params.product,
    actions: params.actions
});

export const createSampleMessageDTO = (
    params: SampleMessageParams
): SampleMessage => ({
    user: params.user,
    created_at: params.created_at,
    content: params.content,
    content_type: params.content_type,
    actions: params.actions
});
