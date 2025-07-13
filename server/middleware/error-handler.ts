import { Request, Response, NextFunction } from 'express';

export interface APIError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export class AppError extends Error implements APIError {
  statusCode: number;
  code: string;
  details?: any;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'INTERNAL_ERROR';
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'المسار المطلوب غير موجود',
    error: {
      code: 'NOT_FOUND',
      path: req.originalUrl,
      method: req.method
    }
  });
};

export const errorHandler = (error: APIError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'حدث خطأ في الخادم';
  let code = error.code || 'INTERNAL_ERROR';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'بيانات غير صالحة';
    code = 'VALIDATION_ERROR';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'معرف غير صالح';
    code = 'INVALID_ID';
  } else if (error.name === 'MongoError' && error.code === 11000) {
    statusCode = 400;
    message = 'البيانات موجودة مسبقاً';
    code = 'DUPLICATE_ENTRY';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'رمز مصادقة غير صالح';
    code = 'INVALID_TOKEN';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'انتهت صلاحية رمز المصادقة';
    code = 'EXPIRED_TOKEN';
  }

  // Log error (in production, use proper logging service)
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error:', {
      message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  const errorResponse = {
    success: false,
    message,
    error: {
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      ...(error.details && { details: error.details })
    }
  };

  res.status(statusCode).json(errorResponse);
};