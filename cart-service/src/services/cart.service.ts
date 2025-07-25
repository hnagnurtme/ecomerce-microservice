import { AddProductToCartDto } from 'dtos/addProductToCart';
import { ICart } from 'models';
import { CartRepository } from 'repositories';
import { ErrorResponse } from 'response';
import { convertToObjectId, getInfoData, HttpService } from 'utils';
import logger from 'utils/logger';

export class CartService {
    private readonly cartRepository: CartRepository;
    private readonly productService: HttpService;
    constructor() {
        logger.info('CartService initialized');
        this.cartRepository = new CartRepository();
        this.productService = new HttpService(
            process.env.PRODUCT_SERVICE_URL || 'http://catalog-service:3003',
        );
    }
    async addProductToCart(addProductToCartDto: AddProductToCartDto): Promise<Partial<ICart>> {
        const { userId, shop_order_ids } = addProductToCartDto;

        const { productId, quantity, old_quantity } = shop_order_ids[0].item_products[0];

        const result = await this.productService.get<any>(`/api/v1/products/${productId}`);

        if (!result.success || !result.data) {
            logger.error('Product not found', { productId });
            throw ErrorResponse.NOTFOUND('Product not found');
        }
        // Check if already have cart
        const existingCart = await this.cartRepository.findCartByUserId(userId);
        if (!existingCart) {
            logger.info('No existing cart found, creating a new one', { userId });
            const cart = await this.cartRepository.createCart(userId, [
                {
                    productId: convertToObjectId(productId),
                    quantity,
                    price: 100,
                },
            ]);
            if (!cart) {
                throw ErrorResponse.INTERNAL('Failed to create cart');
            }
            return getInfoData({
                fields: ['userId', 'products', 'totalPrice', 'state'],
                object: cart,
            });
        }
        const existingProduct = existingCart.products.find(
            (p) => p.productId.toString() === productId.toString(),
        );
        if (!existingProduct) {
            logger.info('Product not found in existing cart, adding new product', {
                userId,
                productId,
                quantity,
            });
            const cart = await this.cartRepository.createCart(userId, [
                {
                    productId: convertToObjectId(productId),
                    quantity,
                    price: 100,
                },
            ]);
            if (!cart) {
                throw ErrorResponse.INTERNAL('Failed to add product to cart');
            }
            return getInfoData({
                fields: ['userId', 'products', 'totalPrice', 'state'],
                object: cart,
            });
        }

        const cart = await this.cartRepository.updateCartQuantity(userId, {
            productId: convertToObjectId(productId),
            quantity: quantity - old_quantity,
            price: 100,
        });

        if (!cart) {
            throw ErrorResponse.NOTFOUND('Cart not found or unable to update');
        }
        return getInfoData({
            fields: ['userId', 'products', 'totalPrice', 'state'],
            object: cart,
        });
    }
}
