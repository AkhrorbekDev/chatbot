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
    id: number;
    created_at: string;
    content?: string | [];
    content_type: ContentTypes.OrderDetails;
    order: Order;
    actions?: Action[];
}

interface OrderViewMessageParams {
    user: User;
    id: number;
    created_at: string;
    content?: string | [];
    content_type: ContentTypes.OrdersView;
    orders: Order[];
    actions?: Action[];
}

interface ProductMessageParams {
    user: User;
    created_at: string;
    id: number;
    content?: string | [];
    content_type: ContentTypes.Product;
    product: Product;
    actions?: Action[];
}

interface SampleMessageParams {
    user: User;
    id: number;
    created_at: string;
    content: string | [];
    content_type: ContentTypes;
    actions?: Action[];
}

export const createOrderDetailsMessageDTO = (
    params: OrderDetailsMessageParams
): OrderDetailsMessage => ({
    user: params.user,
    id: params.id,
    created_at: params.created_at,
    content: params.content,
    content_type: params.content_type,
    order: params.order,
    actions: params.actions
});

export const createOrderViewMessageDTO = (
    params: OrderViewMessageParams
): OrderViewMessage => ({
    user: params.user,
    id: params.id,
    created_at: params.created_at,
    content: params.content,
    content_type: params.content_type,
    orders: params.orders,
    actions: params.actions
});

export const createProductMessageDTO = (
    params: ProductMessageParams
): ProductMessage => {
    return {
        id: params.id,
        user: params.user,
        created_at: params.created_at,
        content: params.content,
        content_type: params.content_type,
        product: params.product,
        actions: params.actions
    }
};

export const createSampleMessageDTO = (
    params: SampleMessageParams
): SampleMessage => ({
    user: params.user,
    id: params.id,
    created_at: params.created_at,
    content: params.content,
    content_type: params.content_type,
    actions: params.actions
});

export const createOrderDTO = (data: Order): Order => ({
    id: data.id,
    total_price: data.total_price,
    debt_price: data.debt_price,
    created_at: data.created_at,
    address: data.address,
    payed: data.payed,
    next_payment: data.next_payment,
    actions: data.actions,
})
