import { Router } from 'express';
import { validateDto } from 'middleware/validate';
import { AddStockToInventory } from 'dtos/addStockToInventory';
import { InventoryController } from 'controllers/inventory.controller';
import asyncHandler from 'middleware/asyncHandler';
const inventoryController = new InventoryController();
const inventoryRouter = Router();

inventoryRouter.post(
    '',
    validateDto(AddStockToInventory),
    asyncHandler(inventoryController.addStockToInventory.bind(inventoryController)),
);

export default inventoryRouter;
