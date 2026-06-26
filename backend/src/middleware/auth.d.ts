import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: any;
    token?: string;
}
export declare const requireAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.d.ts.map