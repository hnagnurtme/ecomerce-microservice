import { IInventory } from 'models/inventory.model';
import logger from 'utils/logger';
import { AddStockToInventory } from 'dtos/addStockToInventory';
import { InventoryRepository } from 'repositories';
import { getInfoData } from 'utils';
export class InventoryService {
    private inventoryRepository: InventoryRepository;
    constructor() {
        this.inventoryRepository = new InventoryRepository();
        logger.info('InventoryService initialized');
    }

    async addStockToInventory(data: AddStockToInventory): Promise<Partial<IInventory>> {
        logger.info('Adding stock to inventory', data);

        const { productId, shopId, stock, location } = data;
        const inventory = await this.inventoryRepository.addStockToInventory(
            productId,
            shopId,
            stock,
            location,
        );

        logger.info('Stock added to inventory successfully', inventory);
        return getInfoData({
            fields: ['productId', 'shopId', 'stock', 'location'],
            object: inventory,
        });
    }
}
