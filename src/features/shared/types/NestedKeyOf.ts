export type NestedKeyOf<TObject extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [Key in keyof TObject & (string | number)]: TObject[Key] extends Function
    ? never
    : TObject[Key] & {} extends object
      ? `${Key}` | `${Key}.${NestedKeyOf<TObject[Key] & {}>}`
      : `${Key}`
}[keyof TObject & (string | number)]

