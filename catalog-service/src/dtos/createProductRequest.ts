import {
    IsString,
    IsNumber,
    IsEnum,
    IsOptional,
    IsArray,
    IsObject,
    ValidateNested,
    Min,
    Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export type ProductType = 'Clothing' | 'Electronic' | 'Furniture';

export class ProductVariationDto {
    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsNumber()
    @Min(0, { message: 'Stock must be greater than or equal to 0' })
    stock!: number;

    @IsOptional()
    @IsNumber()
    priceDiff?: number;
}

export class CreateProductDto {
    @IsString({ message: 'Product name is required' })
    productName!: string;

    @IsString({ message: 'Product thumbnail is required' })
    productThumb!: string;

    @IsOptional()
    @IsString()
    productDescription?: string;

    @IsNumber({}, { message: 'Product price must be a number' })
    @Min(0)
    productPrice!: number;

    @IsNumber({}, { message: 'Product quantity must be a number' })
    @Min(0)
    productQuantity!: number;

    @IsEnum(['Clothing', 'Electronic', 'Furniture'], {
        message: 'Product type must be one of Clothing, Electronic, Furniture',
    })
    productType!: ProductType;

    @IsOptional()
    productShop?: string;

    @IsObject({ message: 'Product attributes must be an object' })
    productAttributes!: Record<string, any>;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariationDto)
    productVariations?: ProductVariationDto[];
}
