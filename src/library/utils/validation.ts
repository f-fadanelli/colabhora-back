import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { badRequest } from './http-response';

type RequestDataLocation = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, location: RequestDataLocation) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[location];

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
        const response = await badRequest(result.error.flatten())
        res.status(response.statusCode).json(response.body)
        return
    }
    
    req[location] = result.data;
    next();
  };
};