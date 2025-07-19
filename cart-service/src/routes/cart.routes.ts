import { Router } from 'express';
import { validateDto } from 'middleware/validate';
import { AddProductToCartDto } from 'dtos';
import { CartController } from 'controllers/cart.controller';
import asyncHandler from 'middleware/asyncHandler';
const cartContoller = new CartController();
const cartRouter = Router();

cartRouter.post(
    '',
    validateDto(AddProductToCartDto),
    asyncHandler(cartContoller.addProductToCart.bind(cartContoller)),
);

export default cartRouter;
