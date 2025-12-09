<template></template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { computed, toRefs } from 'vue'
import { SEO_CONFIG, getCanonicalUrl } from '@/config/seo'

export interface ProductSchemaProps {
  name: string
  description: string
  price: number
  currency?: string
  sku: string
  image: string
  inStock: boolean
  // Propriétés scientifiques/cliniques
  purity?: string
  casNumber?: string
  sequence?: string
  molecularWeight?: string // Poids moléculaire (ex: "1206.4 Da")
  molecularFormula?: string // Formule moléculaire (ex: "C55H91N17O15S")
  storageConditions?: string // Conditions de stockage (ex: "-20°C, lyophilisé")
  form?: string // Forme physique (ex: "Poudre lyophilisée blanche")
  solubility?: string // Solubilité (ex: "Eau bactériostatique, NaCl 0.9%")
  productUrl?: string
  brand?: string
  category?: string
  averageRating?: number
  reviewCount?: number
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
  molecularWeight,
  molecularFormula,
  storageConditions,
  form,
  solubility,
  productUrl,
  brand,
  category,
  averageRating,
  reviewCount,
} = toRefs(props)

const enrichedDescription = computed(() => {
  const rouPrefix = 'Research Use Only (RUO) - '
  const baseDesc = description.value || ''

  if (baseDesc.toLowerCase().includes('research use only')) {
    return baseDesc
  }

  return `${rouPrefix}${baseDesc}`
})

const additionalProperties = computed(() => {
  const properties: Array<{
    '@type': 'PropertyValue'
    name: string
    value: string
    unitText?: string
    unitCode?: string
  }> = []

  // === Données scientifiques/cliniques (froides et techniques) ===

  // Pureté HPLC - donnée clé pour les chercheurs
  if (purity?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'HPLC Purity',
      value: purity.value,
      unitText: 'Percent',
      unitCode: 'P1',
    })
  }

  // Poids moléculaire - donnée technique essentielle
  if (molecularWeight?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Molecular Weight',
      value: molecularWeight.value,
      unitText: 'Dalton',
      unitCode: 'D',
    })
  }

  // Formule moléculaire
  if (molecularFormula?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Molecular Formula',
      value: molecularFormula.value,
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

  // Forme physique
  if (form?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Physical Form',
      value: form.value,
    })
  }

  // Conditions de stockage
  if (storageConditions?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Storage Conditions',
      value: storageConditions.value,
    })
  }

  // Solubilité
  if (solubility?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Solubility',
      value: solubility.value,
    })
  }

  // Catégorie produit
  if (category?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Product Category',
      value: category.value,
    })
  }

  // === Attributs fixes (positionnement laboratoire) ===

  properties.push({
    '@type': 'PropertyValue',
    name: 'Product Type',
    value: 'Synthetic Research Peptide',
  })

  properties.push({
    '@type': 'PropertyValue',
    name: 'Intended Use',
    value: 'Laboratory Research Only - Not for human or veterinary use',
  })

  properties.push({
    '@type': 'PropertyValue',
    name: 'Quality Standard',
    value: 'Research Grade - HPLC Verified',
  })

  properties.push({
    '@type': 'PropertyValue',
    name: 'Certificate',
    value: 'Certificate of Analysis (COA) included',
  })

  return properties
})

const productIdentifiers = computed(() => {
  const identifiers: Array<{
    '@type': 'PropertyValue'
    propertyID: string
    value: string
  }> = []

  if (casNumber?.value) {
    identifiers.push({
      '@type': 'PropertyValue',
      propertyID: 'CAS Number',
      value: casNumber.value,
    })
  }

  if (sku.value) {
    identifiers.push({
      '@type': 'PropertyValue',
      propertyID: 'SKU',
      value: sku.value,
    })
  }

  return identifiers
})

const productSchema = computed(() => {
  // Schema principal Product enrichi pour positionnement "fourniture laboratoire"
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    // Triple type : Product + ChemicalSubstance + IndividualProduct pour e-commerce scientifique
    // ChemicalSubstance signale aux crawlers que c'est un produit chimique de recherche, pas un médicament
    '@type': ['Product', 'ChemicalSubstance', 'IndividualProduct'],
    name: name.value,
    description: enrichedDescription.value,
    image: image.value,
    sku: sku.value,
    // Marque et fabricant orientés B2B scientifique
    brand: {
      '@type': 'Brand',
      name: brand?.value || SEO_CONFIG.SITE_NAME,
    },
    manufacturer: {
      '@type': 'Organization',
      name: SEO_CONFIG.AUTHOR,
      description: 'Fournisseur de réactifs et peptides de synthèse pour la recherche scientifique',
      url: SEO_CONFIG.APP_URL,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl?.value || getCanonicalUrl(`/catalogue/${sku.value}`),
      priceCurrency: currency.value,
      price: price.value.toFixed(2),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: inStock.value
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SEO_CONFIG.SITE_NAME,
        description: 'Fourniture laboratoire peptides Europe',
      },
      eligibleRegion: {
        '@type': 'Place',
        name: 'European Union',
      },
      // Restriction explicite : B2B / Recherche uniquement
      eligibleCustomerType: 'https://schema.org/Business',
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        merchantReturnDays: 0,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'FR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
        },
      },
    },
    // Audience explicitement scientifique/chercheurs (signal B2B fort)
    audience: {
      '@type': 'Audience',
      audienceType: 'Researcher',
      geographicArea: {
        '@type': 'Place',
        name: 'Europe',
      },
    },
    // Catégorie orientée fourniture laboratoire
    category: 'Laboratory Supplies > Research Chemicals > Synthetic Peptides',
    // Signal fort : ce produit est pour équipement de laboratoire
    isRelatedTo: [
      {
        '@type': 'Thing',
        name: 'Laboratory Research Equipment',
      },
      {
        '@type': 'Thing',
        name: 'Scientific Research Supplies',
      },
      {
        '@type': 'Thing',
        name: 'HPLC Analysis Equipment',
      },
    ],
    // Usage prévu : recherche uniquement
    usageInfo: 'Research Use Only (RUO) - Not for human or veterinary use',
    // Matériau / composition chimique
    material: 'Synthetic Peptide',
    // Avertissement légal
    warning: 'For laboratory research purposes only. Not intended for human consumption.',
  }

  if (additionalProperties.value.length > 0) {
    schema.additionalProperty = additionalProperties.value
  }

  if (productIdentifiers.value.length > 0) {
    schema.identifier = productIdentifiers.value
  }

  if (reviewCount?.value && reviewCount.value > 0 && averageRating?.value) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating.value.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      ratingCount: reviewCount.value,
    }
  }

  return schema
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(productSchema.value)),
    },
  ],
})
</script>
