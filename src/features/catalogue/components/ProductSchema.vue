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
  purity?: string
  casNumber?: string
  sequence?: string
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
  }> = []

  if (purity?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'HPLC Purity',
      value: purity.value,
      unitText: 'Percent',
    })
  }

  if (sequence?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Amino Acid Sequence',
      value: sequence.value,
    })
  }

  if (category?.value) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Product Category',
      value: category.value,
    })
  }

  properties.push({
    '@type': 'PropertyValue',
    name: 'Product Type',
    value: 'Research Peptide',
  })

  properties.push({
    '@type': 'PropertyValue',
    name: 'Intended Use',
    value: 'Laboratory Research Only',
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
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: inStock.value
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SEO_CONFIG.SITE_NAME,
      },
      eligibleRegion: {
        '@type': 'Place',
        name: 'European Union',
      },
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
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 18,
      audienceType: 'Researchers',
    },
    category: 'Research Chemicals > Peptides',
    isAccessoryOrSparePartFor: {
      '@type': 'Thing',
      name: 'Laboratory Research Equipment',
    },
  }

  // Ajoute les propriétés additionnelles si présentes
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
