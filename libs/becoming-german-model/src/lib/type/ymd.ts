export const ymd = (v: Date) =>
  `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, '0')}-${String(v.getMonth() + 1).padStart(2, '0')}`;
