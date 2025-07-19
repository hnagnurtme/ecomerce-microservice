import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, SuccessResponse } from 'response';
import { CartService } from 'services';
import logger from 'utils/logger';

export class CartController {
    private readonly cartService: CartService;
    constructor() {
        this.cartService = new CartService();
        logger.info('CartController initialized');
    }

    async addProductToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        const data = req.body;
        if (
            !data.userId ||
            !data.shop_order_ids ||
            !data.shop_order_ids[0] ||
            !data.shop_order_ids[0].item_products ||
            !data.shop_order_ids[0].item_products[0]
        ) {
            throw ErrorResponse.BADREQUEST('Missing required fields');
        }
        SuccessResponse.CREATED(await this.cartService.addProductToCart(data)).send(res);
    }
}
