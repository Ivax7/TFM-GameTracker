// src/@types/express/index.d.ts
import * as express from 'express';
import * as multer from 'multer';

declare global {
  namespace Express {
    type Multer = multer.Multer;
    interface Request {
      user?: any;
    }
    interface File extends multer.File {}
  }
}
