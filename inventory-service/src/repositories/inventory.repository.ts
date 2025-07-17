import { IInventory, Inventory } from 'models/inventory.model';

export class InventoryRepository {
    async addStockToInventory(
        productId: string,
        shopId: string,
        stock: number,
        location: string = 'Da Nang',
    ): Promise<IInventory> {
        const filter = {
            productId,
            shopId,
        };
        const update = {
            $inc: { stock },
            $set: { location },
        };

        const options = {
            upsert: true,
            new: true,
        };

        const inventory = await Inventory.findOneAndUpdate(filter, update, options);
        if (!inventory) {
            throw new Error('Inventory not found or could not be created');
        }
        return inventory;
    }
}
