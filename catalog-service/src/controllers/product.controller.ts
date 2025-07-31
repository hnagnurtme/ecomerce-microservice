import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, SuccessResponse } from 'response';
import { ProductServiceFactory } from 'services';
import { HEADER } from 'utils/constant';
import logger from 'utils/logger';

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
            logger.error('Error creating product', error);
            next(error);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            if (!productId) {
                throw ErrorResponse.BADREQUEST('Product ID is required');
            }
            const product = await this.productService.getProductById(productId);
            if (!product) {
                throw ErrorResponse.NOTFOUND('Product not found');
            }
            SuccessResponse.OK(product).send(res);
        } catch (error) {
            logger.error('Error fetching product by ID', error);
            next(error);
        }
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query;
            const { page, limit } = query;

            const limitStr =
                typeof limit === 'string' ? limit : Array.isArray(limit) ? limit[0] : undefined;
            const pageStr =
                typeof page === 'string' ? page : Array.isArray(page) ? page[0] : undefined;

            const products = await this.productService.getAllProducts(
                limitStr !== undefined ? String(limitStr) : '10',
                pageStr !== undefined ? String(pageStr) : '1',
            );
            SuccessResponse.OK(products).send(res);
        } catch (error) {
            logger.error('Error fetching all products', error);
            next(error);
        }
    }

    async getProductsByShopId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const query = req.query;
        const { page, limit, shopId } = query;
        const limitStr =
            typeof limit === 'string' ? limit : Array.isArray(limit) ? limit[0] : undefined;
        const pageStr = typeof page === 'string' ? page : Array.isArray(page) ? page[0] : undefined;

        const shopIdStr =
            typeof shopId === 'string' ? shopId : Array.isArray(shopId) ? shopId[0] : undefined;

        const products = await this.productService.getProductsByShopId(
            limitStr !== undefined ? String(limitStr) : '10',
            pageStr !== undefined ? String(pageStr) : '1',
            shopIdStr !== undefined ? String(shopIdStr) : '',
        );
        SuccessResponse.OK(products).send(res);
    }
}
