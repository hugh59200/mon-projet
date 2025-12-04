// Types utilitaires TypeScript génériques

/** Rend toutes les propriétés optionnelles récursivement */
export type DeepPartial<T> = T extends Array<infer W>
  ? Array<DeepPartial<W>>
  : { [P in keyof T]?: DeepPartial<T[P]> }

/** Omit distributif pour les unions */
export type DistributiveOmit<T, K extends PropertyKey> = T extends any ? Omit<T, K> : never

/** Types primitifs */
export type PrimaryTypes = boolean | string | number

/** Exclut null et undefined */
export type ExcludeNullOrUndefined<T> = Exclude<T, null | undefined>

/** Union depuis un tableau constant */
export type ConstArrayKeysToUnionType<T extends readonly (string | number | symbol)[]> = T[number]

/** Clés imbriquées d'un objet */
export type NestedKeyOf<TObject extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [Key in keyof TObject & (string | number)]: TObject[Key] extends Function
    ? never
    : TObject[Key] & {} extends object
      ? `${Key}` | `${Key}.${NestedKeyOf<TObject[Key] & {}>}`
      : `${Key}`
}[keyof TObject & (string | number)]

/** Unwrap tuple */
export type UnwrapTuple<T extends [...any[]]> = T extends [infer Head, ...infer Tail]
  ? [Head, ...UnwrapTuple<Tail>]
  : []

/** Rend un type writable (enlève readonly) */
export type Writable<T> = { -readonly [P in keyof T]: T[P] }

/** Rend un type writable récursivement */
export type DeepWritable<T> = { -readonly [P in keyof T]: DeepWritable<T[P]> }

/** Vérifie si un type est une union */
export type IsUnion<T, U extends T = T> = (
  T extends any ? (U extends T ? false : true) : never
) extends false
  ? false
  : true

/** Erreur silencieuse */
export class SilentError extends Error {}
