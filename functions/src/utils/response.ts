import type {Response as ExpressResponse} from "express";

export interface PaginationMeta {
  page: number;
  totalPages: number;
  limit: number;
  currentPage: number;
  totalItems?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: PaginationMeta | null;
  statusCode: number;
  errors?: unknown;
}

export const buildPaginationMeta = (
  page: number,
  limit: number,
  totalItems: number
): PaginationMeta => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.max(limit, 1);
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / safeLimit);

  return {
    page: safePage,
    totalPages,
    limit: safeLimit,
    currentPage: safePage,
    totalItems,
  };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Response {
      successResponse: <T>(
        statusCode: number,
        message: string,
        data?: T | null,
        meta?: PaginationMeta | null
      ) => ExpressResponse;
      errorResponse: (
        statusCode: number,
        message: string,
        errors?: unknown,
        meta?: PaginationMeta | null,
        data?: unknown
      ) => ExpressResponse;
    }
  }
}

export const attachResponseHelpers = (
  res: ExpressResponse
): ExpressResponse => {
  res.successResponse = <T>(
    statusCode: number,
    message: string,
    data: T | null = null,
    meta: PaginationMeta | null = null
  ): ExpressResponse => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
      statusCode,
    } satisfies ApiResponse<T>);
  };

  res.errorResponse = (
    statusCode: number,
    message: string,
    errors: unknown = null,
    meta: PaginationMeta | null = null,
    data: unknown = null
  ): ExpressResponse => {
    const payload: ApiResponse<unknown> = {
      success: false,
      message,
      data,
      meta,
      statusCode,
    };

    if (errors !== undefined && errors !== null) {
      payload.errors = errors;
    }

    return res.status(statusCode).json(payload);
  };

  return res;
};

export const successResponse = <T>(
  res: ExpressResponse,
  statusCode: number,
  message: string,
  data: T | null = null,
  meta: PaginationMeta | null = null
): ExpressResponse => res.successResponse(statusCode, message, data, meta);

export const errorResponse = (
  res: ExpressResponse,
  statusCode: number,
  message: string,
  errors: unknown = null,
  meta: PaginationMeta | null = null,
  data: unknown = null
// eslint-disable-next-line max-len
): ExpressResponse => res.errorResponse(statusCode, message, errors, meta, data);

export {};
