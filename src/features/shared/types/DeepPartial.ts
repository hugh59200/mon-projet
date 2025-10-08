export type DeepPartial<T> = T extends Array<infer W> ? Array<DeepPartial<W>> : { [P in keyof T]?: DeepPartial<T[P]> }
