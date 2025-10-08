import type { DeepPartial, NestedKeyOf } from '../types'

/**
 * Fusionne les clées de n objets
 * @param args objets
 * @returns clés des objets
 */
export function objectMergeKeys(...args: object[]): string[] {
  const allKeys = args
    .filter(isObject)
    .reduce<string[]>((keys, obj) => {
      return [...keys, ...Object.keys(obj)]
    }, [])

  return [...new Set(allKeys)]
}

function isUserObject(obj?: any) {
  return isObject(obj) && !(obj instanceof Date) && !Array.isArray(obj)
}

export function isObject(obj?: any): obj is Exclude<object, null | undefined> {
  return obj !== null && typeof obj === 'object'
}

export function isObjectEquals(obj1?: any, obj2?: any) {
  if (obj1 === obj2) return true
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export function isNullOrUndefined(obj?: any): obj is null | undefined {
  return obj === null || obj === undefined
}

export function isNotNullOrUndefined<T>(obj: T | null | undefined): obj is T {
  return !isNullOrUndefined(obj)
}

export function isNullUndefinedOrEmptyString(obj?: any): obj is null | undefined | '' {
  return obj === null || obj === undefined || obj === ''
}

export function isNotNullUndefinedOrEmptyString<T>(obj: T | null | undefined | ''): obj is Exclude<T, null | undefined | ''> {
  return !isNullUndefinedOrEmptyString(obj)
}

type ObjectExtractKeys<T extends object> = (keyof T)[]
type ObjectExtractResult<T extends object, K extends ObjectExtractKeys<T>> = { [P in K[number]]: T[P] }
/**
 * Fonction pour extraire des propriétés d'un objet en fonction des clés fournies.
 *
 * @param objectValue - L'objet à partir duquel on veut extraire les propriétés.
 * @param members - Les clés des propriétés à extraire.
 *
 * @returns Un objet avec les propriétés extraites.
 */
export function objectExtract<T extends object>(objectValue: T, members: ObjectExtractKeys<T>): ObjectExtractResult<T, ObjectExtractKeys<T>> {
  return members.reduce((newObj, key) => {
    newObj[key] = objectValue[key]
    return newObj
  }, {} as any)
}

/**
 * Effectue le patch d'un objet en mode profond
 *  - Les tableaux sont patchés s'ils sont de taille identiques
 *  - Si un tableaux est fourni dans le patch et que la propréiété à muter est null ou undefined,
 *    le tableau est copié via une copie légére
 * @param obj
 * @param args
 * @returns l'objet muté
 */
export function objectAssignDeep<T extends object>(obj: T, ...args: DeepPartial<T>[]): T {
  for (const objSource of args) {
    for (const propName of Object.keys(objSource)) {
      const propValue = (objSource as any)[propName]
      // Tableaux
      if (Array.isArray(propValue)) {
        const sourceValue = (obj as any)[propName] as Array<any>
        if (!sourceValue) {
          ; (obj as any)[propName] = [...propValue]
          continue
        }
        if (sourceValue.length !== propValue.length) {
          throw new Error('Les tableaux doivent avoir les mêmes dimensions')
        }
        for (let index = 0; index < sourceValue.length; index++) {
          const itemSource = sourceValue[index]
          const itemPatch = propValue[index]
          if (isUserObject(itemPatch)) {
            sourceValue[index] = objectAssignDeep(itemSource, itemPatch)
          } else {
            sourceValue[index] = itemPatch ?? sourceValue[index]
          }
        }
      }
      // Objets anonymes et classes
      else if (isUserObject(propValue)) {
        const sourceValue = (obj as any)[propName]
        if (sourceValue === null || sourceValue === undefined) {
          ; (obj as any)[propName] = propValue
        } else {
          ; (obj as any)[propName] = objectAssignDeep(sourceValue, propValue)
        }
      }
      // Autres membres
      else {
        ; (obj as any)[propName] = propValue
      }
    }
  }
  return obj
}

/**
 * Version typée de Object.create
 * @param obj
 * @returns une nouvelle instance
 */
export function objectCreate<T extends object>(obj: T): T {
  return Object.create(obj) as T
}

/**
 * Renvoie la valeur obtenue en parcourant les clés imbriquées
 * @param obj Un object
 * @param keys Une chaine de clée séparée par des points : personne.adresse.cp ou salariés.0.nom
 * @returns La valeur trouvée
 */
export function objectGetValueWithNestedKey<TObject extends object, TResult>(
  obj: TObject,
  keys: NestedKeyOf<TObject>,
): TResult {
  return objectGetValueWithNestedKeyArray(obj, keys.split('.'))
}

/**
 * Version de objectGetValueWithNestedKey utilisant un tableau
 * @param obj Un object
 * @param keys Un tableau de chaine ou de nombre représentant le chemin pour obtenir la valeur : ['personne', 'adresse', 'cp'] ou ['salariés', 0 'nom']
 * @returns La valeur trouvée
 */
export function objectGetValueWithNestedKeyArray<TObject extends object, TResult>(
  obj: TObject,
  keys: Array<string | number>,
): TResult {
  if (keys.length === 0) return obj as any

  let result: any = obj
  for (const key of keys) {
    if (result === undefined || result === null) break
    result = result[key]
  }
  return result
}



/**
 * Extraction d'une liste des propriétés d'un objet à plat (ex : ['personne.nom', 'personne.adresse.cp'])
 * @param obj Un object
 * @param objectKeys par défault initialise un tableau
 * @param previousPath par défault à vide
 * @returns
 */
export function getObjectKeysFlat(obj: any, objectKeys: string[] = [], previousPath: string = ''): string[] {
  Object.keys(obj).forEach((key) => {
    const currentPath = previousPath ? `${previousPath}.${key}` : key

    if (typeof obj[key] !== 'object') {
      objectKeys.push(currentPath)
    } else {
      getObjectKeysFlat(obj[key], objectKeys, currentPath)
    }
  })

  return objectKeys
}

export function deepEqual(obj1: object | null | undefined, obj2: object | null | undefined) {
  // Cas de base: si les deux objets sont identiques, renvoie true.
  if (obj1 === obj2) {
    return true
  }
  // Vérifiez si les deux objets sont des objets et non nuls.
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false
  }
  // Obtenir les clés des deux objets.
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  // Check if the number of keys is the same.
  if (keys1.length !== keys2.length) {
    return false
  }
  // Parcourir les clés et comparez leurs valeurs de manière récursive.
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual((obj1 as any)[key], (obj2 as any)[key])) {
      return false
    }
  }
  // Si tous les contrôles réussissent, les objets sont égaux.
  return true
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return hash >>> 0; // Conversion en entier non signé
}

export function simpleObjectHash(obj: any): string {
  const str = JSON.stringify(obj)
  return djb2Hash(str).toString(16)
}
