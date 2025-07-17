import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class KafkaCreatePayload {
    @IsNotEmpty({ message: 'Product ID is required' })
    productId!: string;
    @IsNotEmpty({ message: 'Shop ID is required' })
    shopId!: string;
    @IsNumber({}, { message: 'Stock must be a number' })
    @IsNotEmpty({ message: 'Stock is required' })
    stock!: number;
    @IsOptional()
    location?: string;
}
