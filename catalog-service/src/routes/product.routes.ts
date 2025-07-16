import { Router } from 'express';
import asyncHandler from 'middleware/asyncHandler';
import { ProductController } from 'controllers/product.controller';
import { validateDto } from 'middleware/validate';
import { CreateProductDto } from 'dtos';
const productController = new ProductController();
const productRouter = Router();

productRouter.post(
    '',
    validateDto(CreateProductDto),
    asyncHandler(productController.createProduct.bind(productController)),
);

export default productRouter;
