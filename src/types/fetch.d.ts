// src/types/fetch.d.ts
export {}

declare global {
  interface RequestInit {
    /** Active le sablier global pendant la requête */
    sablier?: boolean
  }
}
