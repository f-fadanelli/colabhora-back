import { DecodedToken } from '../decoded-token';

declare module 'express-serve-static-core' {
    interface Request {
        user?: DecodedToken;
        validated?: {
            body?: any;
            query?: any;
            params?: any;
        };
    }
}