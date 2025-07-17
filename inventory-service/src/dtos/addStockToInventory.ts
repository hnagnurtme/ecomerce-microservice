import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddStockToInventory {
    @IsNumber({}, { message: 'Stock must be a number' })
    stock!: number;

    @IsString({ message: 'Product ID must be a string' })
    productId!: string;

    @IsString({ message: 'Location must be a string' })
    @IsOptional()
    location?: string;

    @IsString({ message: 'Shop ID must be a string' })
    shopId!: string;
}
