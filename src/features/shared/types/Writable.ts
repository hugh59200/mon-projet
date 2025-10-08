export type Writable<T> = { -readonly [P in keyof T]: T[P] }

export type DeepWritable<T> = { -readonly [P in keyof T]: DeepWritable<T[P]> }
