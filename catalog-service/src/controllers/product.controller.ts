import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, SuccessResponse } from 'response';
import { ProductServiceFactory } from 'services';
import { HEADER } from 'utils/constant';

export class ProductController {
    private readonly productService: ProductServiceFactory;
    constructor() {
        this.productService = new ProductServiceFactory();
    }

    async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const shopId = req.headers[HEADER.CLIENT_ID];
            if (!shopId) {
                throw ErrorResponse.UNAUTHORIZED('Shop ID is required');
            }
            const productData = req.body;
            productData.productShop = shopId.toString();
            SuccessResponse.CREATED(await this.productService.createProduct(productData)).send(res);
        } catch (error) {
            next(error);
        }
    }
}
