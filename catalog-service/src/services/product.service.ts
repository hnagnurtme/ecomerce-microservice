import { CreateProductDto, ProductType } from 'dtos';
import { IProduct } from 'models/product.model';
import { ProductRepository } from 'repositories/product.repository';
import { ErrorResponse } from 'response';
import { convertToObjectId, elasticClient } from 'utils';
import logger from 'utils/logger';
import { ProductProducer } from 'kafka/producer/product.producer';
import { mapIProductCreatedToKafkaPayload } from 'mapper/catalog.mapper';
class Product {
    protected readonly repo: ProductRepository;
    protected readonly dto: CreateProductDto;

    constructor(productData: CreateProductDto) {
        this.repo = new ProductRepository();
        this.dto = productData;
    }

    async createProduct(refId: string): Promise<IProduct> {
        const productData: Partial<IProduct> = {
            _id: refId,
            productName: this.dto.productName,
            productThumb: this.dto.productThumb || '',
            productDescription: this.dto.productDescription || '',
            productPrice: this.dto.productPrice,
            productQuantity: this.dto.productQuantity,
            productType: this.dto.productType,
            productShop: convertToObjectId(this.dto.productShop),
            productAttributes: this.dto.productAttributes,
            productVariations: this.dto.productVariations || [],
            productRatingsAverage: 0,
        };
        const createdProduct = await this.repo.createProduct(productData);
        if (!createdProduct) {
            throw new Error('Failed to create product');
        }
        try {
            await elasticClient.index({
                index: 'products',
                id: createdProduct._id
                    ? createdProduct._id.toString()
                    : (createdProduct._id as string),
                document: {
                    productName: createdProduct.productName,
                    productDescription: createdProduct.productDescription,
                    productPrice: createdProduct.productPrice,
                    productType: createdProduct.productType,
                    productShop: createdProduct.productShop.toString(),
                },
            });
        } catch (error) {
            logger.error('Failed to index product in Elasticsearch');
            throw error;
        }
        return createdProduct;
    }
}

export class Clothing extends Product {
    async createProduct() {
        const clothing = await this.repo.createClothing({
            ...this.dto.productAttributes,
            productShop: convertToObjectId(this.dto.productShop),
        });

        if (!clothing) throw ErrorResponse.NOTFOUND('Failed to create clothing');
        const clothingId = clothing._id as string;
        return await super.createProduct(clothingId);
    }
}

export class Electronic extends Product {
    async createProduct() {
        const electronic = await this.repo.createElectronic({
            ...this.dto.productAttributes,
            productShop: convertToObjectId(this.dto.productShop),
        });

        if (!electronic) throw ErrorResponse.NOTFOUND('Failed to create electronic');
        const electronicId = electronic._id as string;
        return await super.createProduct(electronicId);
    }
}

export class Furniture extends Product {
    async createProduct() {
        const furniture = await this.repo.createFurniture({
            ...this.dto.productAttributes,
            productShop: convertToObjectId(this.dto.productShop),
        });

        if (!furniture) throw ErrorResponse.NOTFOUND('Failed to create furniture');
        return await super.createProduct(furniture._id as string);
    }
}

export class ProductServiceFactory {
    private static productRegistry: Partial<Record<ProductType, any>> = {};

    static registerProductType(type: ProductType, classRef: any) {
        ProductServiceFactory.productRegistry[type] = classRef;
    }

    constructor() {
        logger.info('ProductServiceFactory instance created');
    }

    async createProduct(productData: CreateProductDto): Promise<Partial<IProduct>> {
        const { productType } = productData;
        const ProductClass = ProductServiceFactory.productRegistry[productType];
        logger.info(`[Factory] Creating product of type: ${productType}`);
        if (!ProductClass) {
            throw new Error(`Invalid product type: ${productType}`);
        }

        const productInstance = new ProductClass(productData);
        const result = await productInstance.createProduct();
        logger.info(`[Factory] Created product of type: ${productType}`);
        try {
            const totalStock = productData.productVariations?.reduce(
                (sum, variation) => sum + (variation.stock || 0),
                0,
            );
            const kafkaPayload = mapIProductCreatedToKafkaPayload(result);
            kafkaPayload.stock = totalStock || result.productQuantity;
            await ProductProducer.publishProductCreated(kafkaPayload);
            logger.info(
                `[Factory] Published product created event for productId: ${kafkaPayload.productId}`,
            );
        } catch (error) {
            logger.error('Failed to send Kafka message', error);
        }
        return result;
    }

    async getProductById(productId: string): Promise<IProduct | null> {
        const product = await new ProductRepository().findProductById(productId);
        if (!product) {
            throw ErrorResponse.NOTFOUND('Product not found');
        }
        return product;
    }

    async getAllProducts(limit: string, page: string): Promise<IProduct[]> {
        const parsedLimit = parseInt(limit, 10) || 10;
        const parsedPage = parseInt(page, 10) || 1;
        const products = await new ProductRepository().findAllProducts(parsedLimit, parsedPage);
        if (!products || products.length === 0) {
            throw ErrorResponse.NOTFOUND('No products found');
        }
        return products;
    }
}

ProductServiceFactory.registerProductType('Clothing', Clothing);
ProductServiceFactory.registerProductType('Electronic', Electronic);
ProductServiceFactory.registerProductType('Furniture', Furniture);
