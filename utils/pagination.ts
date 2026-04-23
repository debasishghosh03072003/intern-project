export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export function getPaginationOptions(
  pageParam: string | null,
  limitParam: string | null
): PaginationOptions {
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(limitParam || "10", 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number
): { page: number; limit: number; total: number; totalPages: number } {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
