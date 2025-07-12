import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from 'response/error.respone';

export function validateDto<T>(DtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoInstance = plainToInstance(DtoClass, req.body);
      const errors = await validate(dtoInstance as object, {
        whitelist: true,
        forbidNonWhitelisted: false,
        skipMissingProperties: false,
      });

      if (errors.length > 0) {
        const messages = errors
          .flatMap((error: ValidationError) =>
            Object.values(error.constraints || {})
          )
          .join(', ');

        return ErrorResponse.BADREQUEST(messages).send(res);
      }

      req.body = dtoInstance;
      next();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return ErrorResponse.INTERNAL('Validation error').send(res);
    }
  };
}
