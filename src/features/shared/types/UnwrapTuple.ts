export type UnwrapTuple<T extends [...any[]]> = T extends [infer Head, ...infer Tail]
  ? [Head, ...UnwrapTuple<Tail>]
  : []
