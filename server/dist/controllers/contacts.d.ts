import { NextFunction, Request, Response } from 'express';
export declare const getContacts: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createContact: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateContact: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteContact: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=contacts.d.ts.map