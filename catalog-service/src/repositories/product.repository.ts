import productModel, { IProduct } from 'models/product.model';
import clothingModel, { IClothing } from 'models/clothing.model';
import electronicModel, { IElectronic } from 'models/electronic.model';
import furnitureModel, { IFurniture } from 'models/furniture.model';

export class ProductRepository {
    async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
        return await productModel.create(productData);
    }
    async createClothing(clothingData: Partial<IClothing>): Promise<IClothing> {
        return await clothingModel.create(clothingData);
    }
    async createElectronic(electronicData: Partial<IElectronic>): Promise<IElectronic> {
        return await electronicModel.create(electronicData);
    }
    async createFurniture(furnitureData: Partial<IFurniture>): Promise<IFurniture> {
        return await furnitureModel.create(furnitureData);
    }

    async findProductById(productId: string): Promise<IProduct | null> {
        return await productModel.findById(productId).lean();
    }

    async findAllProducts(limit: number, page: number): Promise<IProduct[]> {
        return await productModel
            .find()
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();
    }
}
