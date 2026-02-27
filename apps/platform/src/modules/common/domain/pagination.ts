export interface PaginationInfo {
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface PaginatedResponse<T> extends PaginationInfo {
  content: T[];
}

export interface PaginatedRequestParams {
  page: number;
  size: number;
}

export interface PaginatedRequest<T> {
  params: PaginatedRequestParams;
  body: T;
}
