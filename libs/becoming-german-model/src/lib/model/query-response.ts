export type QueryResponse<T> = {
  status: 'ok' | 'error';
  total: number;
  errors: number;
  offset: number;
  endId: number;
  result: T[]
}
