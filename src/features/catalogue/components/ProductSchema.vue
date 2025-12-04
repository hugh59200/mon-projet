<template>
  <!-- Composant headless - aucun rendu visuel -->
</template>

<script setup lang="ts">
/**
 * ProductSchema.vue
 * Composant headless pour l'injection de données structurées JSON-LD (Schema.org)
 *
 * Stratégie GEO (Generative Engine Optimization):
 * - Signale explicitement aux IA que les produits sont des réactifs de laboratoire
 * - Ajoute "Research Use Only (RUO)" à la description
 * - Inclut des identifiants scientifiques (CAS Number, pureté HPLC)
 * - Cible l'audience "Researchers" pour éviter toute confusion avec des médicaments
 */

import { useHead } from '@vueuse/head'
import { computed, toRefs } from 'vue'
import { SEO_CONFIG, getCanonicalUrl } from '@/config/seo'

// ============================================
// PROPS
// ============================================
export interface ProductSchemaProps {
  /** Nom du produit (ex: "BPC-157 5mg") */
  name: string
  /** Description du produit */
  description: string
  /** Prix en nombre */
  price: number
  /** Devise (default: EUR) */
  currency?: string
  /** SKU / Référence produit */
  sku: string
  /** URL de l'image produit */
  image: string
  /** Disponibilité en stock */
  inStock: boolean
  /** Pureté (ex: "≥99%") */
  purity?: string
  /** Numéro CAS - crucial pour la crédibilité scientifique */
  casNumber?: string
  /** Séquence d'acides aminés */
  sequence?: string
  /** URL de la page produit */
  productUrl?: string
  /** Nom de la marque */
  brand?: string
  /** Catégorie du produit */
  category?: string
}

const props = withDefaults(defineProps<ProductSchemaProps>(), {
  currency: 'EUR',
  brand: SEO_CONFIG.SITE_NAME,
})

const {
  name,
  description,
  price,
  currency,
  sku,
  image,
  inStock,
  purity,
  casNumber,
  sequence,
  productUrl,
  brand,
  category,
} = toRefs(props)

// ============================================
// COMPUTED: JSON-LD SCHEMA
// ============================================

/**
 * Construit la description enrichie avec mention RUO
 */
const enrichedDescription = computed(() => {
  const rouPrefix = 'Research Use Only (RUO) - '
  const baseDesc = description.value || ''

  // Évite de dupliquer si déjà présent
  if (baseDesc.toLowerCase().includes('research use only')) {
    return baseDesc
  }

  return `${rouPrefix}${baseDesc}`
})

/**
 * Génère les propriétés additionnelles (pureté, séquence)
 */
const additionalProperties = computed(() => {
  const properties: Array<{
    '@type': 'PropertyValue'
    name: string
    value: string
    unitText?: string
  }> = []

  // Pureté HPLC
  if (purity?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'HPLC Purity',
      value: purity.value,
      unitText: 'Percent',
    })
  }

  // Séquence d'acides aminés
  if (sequence?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Amino Acid Sequence',
      value: sequence.value,
    })
  }

  // Catégorie scientifique
  if (category?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Product Category',
      value: category.value,
    })
  }

  // Type de produit (toujours présent pour GEO)
  properties.push({
    '@type': 'PropertyValue',
    name: 'Product Type',
    value: 'Research Peptide',
  })

  // Usage autorisé
  properties.push({
    '@type': 'PropertyValue',
    name: 'Intended Use',
    value: 'Laboratory Research Only',
  })

  return properties
})

/**
 * Génère les identifiants (CAS Number, SKU)
 */
const productIdentifiers = computed(() => {
  const identifiers: Array<{
    '@type': 'PropertyValue'
    propertyID: string
    value: string
  }> = []

  // CAS Number - identifiant scientifique crucial
  if (casNumber?.value) {
    identifiers.push({
      '@type': 'PropertyValue',
      propertyID: 'CAS Number',
      value: casNumber.value,
    })
  }

  // SKU
  if (sku.value) {
    identifiers.push({
      '@type': 'PropertyValue',
      propertyID: 'SKU',
      value: sku.value,
    })
  }

  return identifiers
})

/**
 * Schema JSON-LD complet
 */
const productSchema = computed(() => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name.value,
    description: enrichedDescription.value,
    image: image.value,
    sku: sku.value,
    brand: {
      '@type': 'Brand',
      name: brand?.value || SEO_CONFIG.SITE_NAME,
    },
    manufacturer: {
      '@type': 'Organization',
      name: SEO_CONFIG.AUTHOR,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl?.value || getCanonicalUrl(`/catalogue/${sku.value}`),
      priceCurrency: currency.value,
      price: price.value.toFixed(2),
      availability: inStock.value
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SEO_CONFIG.SITE_NAME,
      },
      // Région de vente (Europe)
      eligibleRegion: {
        '@type': 'Place',
        name: 'European Union',
      },
      // Conditions de vente
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        merchantReturnDays: 0,
      },
    },
    // Audience cible - crucial pour GEO
    audience: {
      '@type': 'Audience',
      audienceType: 'Researchers',
      geographicArea: {
        '@type': 'Place',
        name: 'Europe',
      },
    },
    // Catégorie produit
    category: 'Research Chemicals > Peptides',
    // Usage prévu
    isAccessoryOrSparePartFor: {
      '@type': 'Thing',
      name: 'Laboratory Research Equipment',
    },
  }

  // Ajoute les propriétés additionnelles si présentes
  if (additionalProperties.value.length > 0) {
    schema.additionalProperty = additionalProperties.value
  }

  // Ajoute les identifiants si présents
  if (productIdentifiers.value.length > 0) {
    schema.identifier = productIdentifiers.value
  }

  // Ajoute le GTIN/CAS si disponible (pour une meilleure indexation)
  if (casNumber?.value) {
    schema.gtin = casNumber.value // Certains crawlers utilisent ce champ
  }

  return schema
})

// ============================================
// INJECTION DANS LE HEAD
// ============================================
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(productSchema.value)),
    },
  ],
})
</script>
