/**
 * Fourni une union petit une tableau constant de clée
 */
export type ConstArrayKeysToUnionType<T extends readonly (string | number | symbol)[]> = T[number]
