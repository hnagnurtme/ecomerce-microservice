import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, SuccessResponse } from 'response';
import { InventoryService } from 'services';
import logger from 'utils/logger';

export class InventoryController {
    private readonly inventoryService: InventoryService;
    constructor() {
        this.inventoryService = new InventoryService();
        logger.info('InventoryController initialized');
    }

    async addStockToInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
        const data = req.body;
        if (!data.productId || !data.shopId || !data.stock || !data.location) {
            throw ErrorResponse.BADREQUEST('Missing required fields');
        }
        SuccessResponse.CREATED(await this.inventoryService.addStockToInventory(data)).send(res);
    }
}
