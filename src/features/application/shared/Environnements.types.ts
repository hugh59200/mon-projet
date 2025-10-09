export const Environnements = ['dev', 'rec01', 'int', 'rec02', 'staging', 'blue', 'green'] as const

export type Environnements = (typeof Environnements)[number]
