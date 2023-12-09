export type AggregateSnapshot<T, A extends string> = {
  aggregateId: string;
  aggregateType: A;
  aggregateVersion: number
  data: T,
  timestamp: number
}
