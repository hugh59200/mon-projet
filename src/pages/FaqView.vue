<template>
  <section class="faq__page">
    <PageHeader />
    <div class="faq__layout">
      <aside class="faq__filters">
        <div class="faq__filters-card">
          <BasicText
            size="body-m"
            weight="semibold"
            color="neutral-700"
          >
            Filtres
          </BasicText>
          <BasicToolbar
            v-model:search="search"
            search-placeholder="Rechercher une question..."
            :show-reset="true"
            @reset="resetSearch"
          />
          <BasicDropdown
            v-model="selectedCategory"
            :items="categoryOptions"
            size="small"
            dropdown-type="table"
            force-value
          />
        </div>
      </aside>

      <div class="faq__content">
        <WrapperLoader
          :loading="false"
          :has-loaded="true"
          :is-empty="groupedVisible.length === 0"
          message="Chargement…"
          empty-message="Aucun résultat."
        >
          <div class="faq__groups">
            <FilterGroup
              v-for="group in groupedVisible"
              :key="group.id"
              :title="group.label"
              :icon="group.icon"
              :items="group.items"
              v-model:openState="groupOpenState"
            />
          </div>
        </WrapperLoader>
      </div>
    </div>

    <footer class="faq__footer">
      <BasicText color="neutral-700">
        Une question restante ? Notre support vous répond rapidement.
      </BasicText>
      <RouterLink to="/profil">
        <BasicButton
          label="Contacter le support"
          type="primary"
        />
      </RouterLink>
    </footer>
  </section>
</template>

<script setup lang="ts">
  import BasicToolbar from '@/features/admin/shared/components/BasicToolbar.vue'
  import FilterGroup from '@/features/shared/components/FilterGroup.vue'
  import PageHeader from '@/features/shared/components/PageHeader.vue'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  // Plus besoin de useRoute ici pour le titre, PageHeader s'en occupe

  type CatId = 'qualite' | 'stockage' | 'commande' | 'shipping' | 'conformite' | 'retour'

  type FaqItem = {
    id: string
    cat: CatId
    q: string
    a: string
    ruo?: boolean
    kw?: string[]
  }

  const categories = [
    { id: 'qualite', label: 'Produits & Qualité', icon: 'FlaskRound' },
    { id: 'stockage', label: 'Stockage & Manipulation', icon: 'Boxes' },
    { id: 'commande', label: 'Commandes & Paiement', icon: 'CreditCard' },
    { id: 'shipping', label: 'Expédition & Suivi', icon: 'PackageSearch' },
    { id: 'conformite', label: 'Conformité & Sécurité (RUO)', icon: 'ShieldCheck' },
    { id: 'retour', label: 'Retours & Support', icon: 'Undo2' },
  ] as const

  const faqs: FaqItem[] = [
    {
      id: 'q1',
      cat: 'qualite',
      q: 'Fournissez-vous un certificat d’analyse (CoA) ?',
      a: `Oui. Chaque lot est fourni avec un CoA comprenant selon les cas : chromatogramme <strong>HPLC</strong>,
        masse observée (<strong>LC-MS</strong>), pureté et informations de lot.`,
    },
    {
      id: 'q2',
      cat: 'qualite',
      q: 'Quelle pureté ciblez-vous ?',
      a: `Selon la séquence, nos partenaires visent une pureté élevée (ex. ≥ 98&nbsp;% quand réalisable).
        La pureté est distincte du <em>contenu net en peptide</em> (taux réel de matière peptidique dans la
        poudre lyophilisée).`,
    },
    {
      id: 'q3',
      cat: 'qualite',
      q: 'Vos peptides sont-ils stériles ?',
      a: `Les flacons sont livrés <strong>lyophilisés</strong> pour <strong>usage recherche</strong>.
        Ils ne sont pas destinés à un usage humain et ne constituent pas un médicament.`,
      ruo: true,
    },
    {
      id: 'q4',
      cat: 'stockage',
      q: 'Comment stocker la poudre lyophilisée ?',
      a: `Conserver au <strong>sec</strong>, à l’abri de la lumière, idéalement à <strong>≤ −20&nbsp;°C</strong>.
        Éviter l’humidité&nbsp;: refermer soigneusement et utiliser un dessiccant si possible.`,
    },
    {
      id: 'q5',
      cat: 'stockage',
      q: 'Et les solutions reconstituées en laboratoire ?',
      a: `Préparer dans une solution/tampon stérile compatible avec votre protocole (pH ~5–7),
        <strong>aliquoter</strong> et limiter les cycles de congélation/décongélation. Stockage conseillé à ≤ −20&nbsp;°C.`,
    },
    {
      id: 'q6',
      cat: 'stockage',
      q: 'Dois-je laisser revenir le flacon à température avant ouverture ?',
      a: `Oui. Laisser revenir à température ambiante avant ouverture pour limiter la <strong>condensation</strong> et l’humidité.`,
    },
    {
      id: 'q7',
      cat: 'commande',
      q: 'Puis-je modifier ou annuler ma commande ?',
      a: `Nous préparons rapidement les commandes. Une fois la préparation lancée, nous ne pouvons
        pas toujours modifier/annuler. Contactez-nous au plus tôt et nous ferons le maximum.`,
    },
    {
      id: 'q8',
      cat: 'commande',
      q: 'Quels moyens de paiement acceptez-vous ?',
      a: `Cartes bancaires majeures et autres solutions sécurisées selon la région.
        Les paiements sont traités via des prestataires conformes <strong>PCI-DSS</strong>.`,
    },
    {
      id: 'q9',
      cat: 'commande',
      q: 'Proposez-vous des factures avec TVA/TVA intracom ?',
      a: `Oui. Renseignez votre société et, le cas échéant, votre numéro de TVA intracommunautaire.`,
    },
    {
      id: 'q10',
      cat: 'shipping',
      q: 'Quel est le délai d’expédition ?',
      a: `Les commandes validées partent rapidement. Un <strong>numéro de suivi</strong> est envoyé à l’expédition.`,
    },
    {
      id: 'q11',
      cat: 'shipping',
      q: 'Le transport nécessite-t-il du froid ?',
      a: `Les peptides <strong>lyophilisés</strong> sont généralement <strong>stables à température ambiante</strong> pendant le transport.
        À réception, placer au réfrigérateur (2–8&nbsp;°C) ou au congélateur pour stockage long terme.`,
    },
    {
      id: 'q12',
      cat: 'shipping',
      q: 'Conditionnement et discrétion',
      a: `Emballages <strong>discrets</strong> et protecteurs, flacons scellés et protections antichocs.`,
    },
    {
      id: 'q13',
      cat: 'shipping',
      q: 'Expédiez-vous à l’international ?',
      a: `Oui, selon zones desservies. Le client est responsable des éventuelles contraintes et droits
        locaux. Déclaration comme <em>réactifs de laboratoire – usage recherche</em>.`,
    },
    {
      id: 'q14',
      cat: 'conformite',
      q: 'Vos produits sont-ils destinés à un usage humain ?',
      a: `<strong>Non</strong>. Produits RUO : non destinés à l’usage humain ni vétérinaire. Aucun conseil
        d’administration ou posologie n’est fourni.`,
      ruo: true,
    },
    {
      id: 'q15',
      cat: 'conformite',
      q: 'Fournissez-vous des recommandations de reconstitution/administration ?',
      a: `Nous ne donnons <strong>aucune</strong> recommandation d’administration. Pour la reconstitution,
        référez-vous à vos procédures internes et aux informations du CoA.`,
      ruo: true,
    },
    {
      id: 'q16',
      cat: 'conformite',
      q: 'Traçabilité et contrôles qualité',
      a: `Traçabilité des lots et contrôles analytiques (HPLC, LC-MS, pureté) fournis sur le CoA.`,
    },
    {
      id: 'q17',
      cat: 'retour',
      q: 'Puis-je retourner un article ?',
      a: `Pour des raisons d’intégrité produit, <strong>aucun retour</strong> n’est accepté pour les flacons
        ouverts/altérés. Les retours d’articles non ouverts peuvent être envisagés sous conditions (délai, état, autorisation préalable).`,
    },
    {
      id: 'q18',
      cat: 'retour',
      q: 'Comment vous contacter ?',
      a: `Depuis votre espace client (messagerie), par email ou via le formulaire de contact. Nous répondons rapidement aux questions techniques <em>(cadre RUO)</em>.`,
    },
  ]

  const search = ref('')
  const selectedCategory = ref<'all' | CatId>('all')

  const categoryOptions = computed(() => [
    { id: 'all', label: 'Toutes les catégories' },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ])

  function resetSearch() {
    search.value = ''
    selectedCategory.value = 'all'
  }

  const visibleFaqs = computed(() => {
    const q = search.value.trim().toLowerCase()
    return faqs.filter((f) => {
      const catOk = selectedCategory.value === 'all' || f.cat === selectedCategory.value
      if (!q) return catOk
      const hay = (
        f.q +
        ' ' +
        f.a.replace(/<[^>]+>/g, '') +
        ' ' +
        (f.kw?.join(' ') ?? '')
      ).toLowerCase()
      return catOk && hay.includes(q)
    })
  })

  const groupedVisible = computed(() => {
    return categories
      .map((c) => ({
        ...c,
        items: visibleFaqs.value.filter((f) => f.cat === c.id),
      }))
      .filter((g) => g.items.length > 0)
  })

  const groupOpenState = ref<Record<string, boolean>>({})

  watch(
    () => groupedVisible.value,
    (groups) => {
      groups.forEach((g) => {
        g.items.forEach((item) => {
          if (groupOpenState.value[item.id] === undefined) {
            groupOpenState.value[item.id] = false
          }
        })
      })
    },
    { immediate: true },
  )

  async function openFromHash() {
    const raw = window.location.hash?.slice(1)
    if (!raw) return
    const id = decodeURIComponent(raw)
    const target = faqs.find((f) => f.id === id)
    if (!target) return

    selectedCategory.value = target.cat

    await nextTick()

    groupOpenState.value[id] = true

    await nextTick()

    const el = document.getElementById(id)
    if (!el) return

    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    el.classList.add('faq-item--flash')
    setTimeout(() => el.classList.remove('faq-item--flash'), 1200)
  }

  function injectFaqJsonLd() {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a.replace(/\n/g, ' '),
        },
      })),
    }
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.text = JSON.stringify(data)
    document.head.appendChild(s)
  }

  onMounted(() => {
    injectFaqJsonLd()
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('hashchange', openFromHash)
  })
</script>

<style scoped lang="less">
  .faq {
    /* PAGE */
    &__page {
      display: flex;
      flex-direction: column;
      gap: 48px;
      padding: 48px 32px;
      max-width: 1280px;
      margin: 0 auto;

      @media (max-width: 768px) {
        padding: 32px 16px;
        gap: 32px;
      }
    }

    /* LAYOUT 2 COLONNES */
    &__layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 32px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    /* SIDEBAR */
    &__filters {
      position: sticky;
      top: 90px;
      height: fit-content;

      @media (max-width: 900px) {
        position: static;
      }

      &-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(14px);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 16px;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    }

    /* CONTENT */
    &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    &__groups {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    /* ANSWER BLOCK */
    &__answer {
      padding: 4px 2px 12px;
    }

    /* RUO BADGE */
    &__ruo {
      margin-top: 12px;
      display: flex;
      gap: 6px;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, @danger-500 10%, transparent);
      border: 1px solid color-mix(in srgb, @danger-500 30%, transparent);
    }

    /* FOOTER */
    &__footer {
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding-top: 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      text-align: center;
      flex-wrap: wrap;
    }

    /* ANIMATION HASH (scroll-to) */
    &-item--flash {
      animation: faqFlash 1.2s ease-out;
    }

    @keyframes faqFlash {
      0% {
        background: rgba(var(--primary-500-rgb), 0.12);
      }
      60% {
        background: rgba(var(--primary-500-rgb), 0.03);
      }
      100% {
        background: transparent;
      }
    }
  }
</style>
