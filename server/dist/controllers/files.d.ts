import { Response, NextFunction } from 'express';
export declare const getFiles: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadFile: (req: any, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const updateFile: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteFile: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const downloadFile: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=files.d.ts.map