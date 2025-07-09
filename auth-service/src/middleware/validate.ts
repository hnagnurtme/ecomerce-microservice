import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ErrorResponse } from 'response/error.respone';

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return ErrorResponse.BADREQUEST(message, 'Validation failed').send(res);
    }

    next();
  };
};
