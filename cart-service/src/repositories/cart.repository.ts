import { Cart, ICart } from 'models';
import { Types } from 'mongoose';

export class CartRepository {
    async findCartByUserId(userId: string): Promise<ICart | null> {
        return Cart.findOne({ userId, state: 'active' }).lean();
    }

    async createCart(
        userId: string,
        products: { productId: Types.ObjectId; quantity: number; price: number }[],
    ): Promise<ICart | null> {
        const cart = new Cart({
            userId,
            state: 'active',
            products,
            totalPrice: products.reduce((total, p) => total + p.price * p.quantity, 0),
        });

        return await cart.save();
    }

    async updateCartQuantity(
        userId: string,
        product: { productId: Types.ObjectId; quantity: number; price: number },
    ): Promise<ICart | null> {
        const cart = await Cart.findOneAndUpdate(
            {
                userId,
                'state': 'active',
                'products.productId': product.productId,
            },
            {
                $inc: { 'products.$.quantity': product.quantity },
                $set: { updatedAt: new Date() },
            },
            { new: true },
        );

        if (cart) {
            cart.totalPrice = cart.products.reduce((total, p) => total + p.price * p.quantity, 0);
            await cart.save();
        }

        return cart;
    }

    async addProductToCart(
        userId: string,
        product: { productId: Types.ObjectId; quantity: number; price: number },
    ): Promise<ICart | null> {
        const cart = await Cart.findOneAndUpdate(
            { userId, state: 'active' },
            {
                $push: { products: product },
                $set: { updatedAt: new Date() },
            },
            { upsert: true, new: true },
        );

        if (cart) {
            cart.totalPrice = cart.products.reduce((total, p) => total + p.price * p.quantity, 0);
            await cart.save();
        }

        return cart;
    }
}
