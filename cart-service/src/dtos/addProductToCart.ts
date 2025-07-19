import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
    @IsNotEmpty({ message: 'Product ID is required' })
    @IsString({ message: 'Product ID must be a string' })
    productId!: string;

    @IsNotEmpty({ message: 'Quantity is required' })
    @IsNumber({}, { message: 'Quantity must be a number' })
    quantity!: number;

    @IsNumber({}, { message: 'Old quantity must be a number' })
    old_quantity!: number;
}

export class ShopOrderDto {
    @IsNotEmpty({ message: 'Shop ID is required' })
    @IsString({ message: 'Shop ID must be a string' })
    shopId!: string;

    @IsArray({ message: 'Item products must be an array' })
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    item_products!: ProductDto[];
}

export class AddProductToCartDto {
    @IsNotEmpty({ message: 'User ID is required' })
    @IsString({ message: 'User ID must be a string' })
    userId!: string;

    @IsArray({ message: 'Shop orders must be an array' })
    @ValidateNested({ each: true })
    @Type(() => ShopOrderDto)
    shop_order_ids!: ShopOrderDto[];
}
