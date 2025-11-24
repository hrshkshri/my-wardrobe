import { PAGINATION } from '../constants';

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Validate and normalize pagination parameters
 */
export const normalizePaginationQuery = (query: {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  sortOrder?: string;
}): PaginationQuery => {
  let page = parseInt(query.page || '1', 10);
  let pageSize = parseInt(
    query.pageSize || String(PAGINATION.DEFAULT_PAGE_SIZE),
    10
  );

  // Validate page
  if (isNaN(page) || page < 1) {
    page = PAGINATION.DEFAULT_PAGE;
  }

  // Validate pageSize
  if (isNaN(pageSize) || pageSize < 1) {
    pageSize = PAGINATION.DEFAULT_PAGE_SIZE;
  }

  if (pageSize > PAGINATION.MAX_PAGE_SIZE) {
    pageSize = PAGINATION.MAX_PAGE_SIZE;
  }

  return {
    page,
    pageSize,
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
  };
};

/**
 * Create pagination metadata
 */
export const createPaginationMeta = (
  page: number,
  pageSize: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export default {
  normalizePaginationQuery,
  createPaginationMeta,
};
