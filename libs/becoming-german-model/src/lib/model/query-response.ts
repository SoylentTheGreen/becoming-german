export type QueryResponse<T> = {
  status: 'ok' | 'error';
  total: number;
  offset: number;
  result: T[]
}
