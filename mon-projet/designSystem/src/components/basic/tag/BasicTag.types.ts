export enum TagLabel {
  NonTraite = 'NON TRAITE',
  ATraite = 'A TRAITE',
  Traite = 'TRAITE',
  NonConforme = 'NON CONFORME',
  EnTraitement = 'EN TRAITEMENT',
  Conforme = 'CONFORME',
  EnAttente = 'EN ATTENTE',
  EnAttenteDeTraitementParAkto = 'EN ATTENTE DE TRAITEMENT PAR AKTO',
  EnAttenteDeDepot = 'EN ATTENTE DE DEPOT',
  EnCoursDAnalyse = 'EN COURS D\'ANALYSE',
  Manquant = 'MANQUANT',
  Recu = 'REÇU'
}

export type TagType = 'success' | 'pending' | 'danger' | 'disabled'
export type TagSize = 'medium' | 'small'

export type TagProps = {
  label: string
  size: TagSize
}

export const tagTypes: TagType[] = ['success', 'pending', 'danger', 'disabled']
export const tagSizes: TagSize[] = ['medium', 'small']

export const labelToTypeMapping: Record<string, TagType> = {
  [TagLabel.NonTraite]: 'danger',
  [TagLabel.ATraite]: 'pending',
  [TagLabel.Traite]: 'success',
  [TagLabel.NonConforme]: 'danger',
  [TagLabel.EnTraitement]: 'pending',
  [TagLabel.Conforme]: 'success',
  [TagLabel.EnAttente]: 'success',
  [TagLabel.EnAttenteDeTraitementParAkto]: 'pending',
  [TagLabel.EnAttenteDeDepot]: 'pending',
  [TagLabel.EnCoursDAnalyse]: 'pending',
  [TagLabel.Manquant]: 'disabled',
  [TagLabel.Recu]: 'success',
}
