<template>
  <section class="faq container">
    <!-- Header -->
    <header class="faq__header">
      <div class="faq__title">
        <BasicIconNext
          name="HelpCircle"
          :size="28"
        />
        <BasicText
          size="h3"
          weight="semibold"
        >
          Foire aux questions
        </BasicText>
      </div>
      <BasicText color="neutral-700">
        Produits destinés exclusivement à la recherche (RUO). Non destinés à l’usage humain ou
        vétérinaire.
      </BasicText>
    </header>

    <!-- Toolbar: recherche + filtre -->
    <div class="faq__toolbar">
      <BasicToolbar
        v-model:search="search"
        :search-placeholder="'Rechercher une question...'"
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

    <!-- Liste groupée par catégorie -->
    <WrapperLoader
      :loading="false"
      :has-loaded="true"
      :is-empty="groupedVisible.length === 0"
      message="Chargement de la FAQ..."
      empty-message="Aucun résultat pour cette recherche."
    >
      <div class="faq__groups">
        <section
          v-for="group in groupedVisible"
          :key="group.id"
          class="faq-group"
        >
          <div class="faq-group__header">
            <BasicIconNext :name="group.icon" />
            <BasicText
              size="h5"
              weight="semibold"
            >
              {{ group.label }}
            </BasicText>
          </div>

          <div class="faq-group__items">
            <details
              v-for="item in group.items"
              :key="item.id"
              :id="item.id"
              class="faq-item"
            >
              <summary
                class="faq-item__question"
                @click="setHash(item.id)"
              >
                <BasicIconNext
                  name="ChevronRight"
                  class="chevron"
                />
                <BasicText weight="semibold">{{ item.q }}</BasicText>
              </summary>

              <div class="faq-item__answer">
                <BasicText color="neutral-700">
                  <span v-html="item.a" />
                </BasicText>

                <!-- infos RUO -->
                <div
                  v-if="item.ruo"
                  class="faq-ruo"
                >
                  <BasicIconNext
                    name="ShieldAlert"
                    :size="16"
                  />
                  <BasicText
                    size="body-s"
                    color="neutral-700"
                  >
                    Usage recherche uniquement (RUO). Aucune indication d’usage humain.
                  </BasicText>
                </div>
              </div>
            </details>
          </div>
        </section>
      </div>
    </WrapperLoader>

    <!-- CTA Support -->
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
  import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

  type CatId = 'qualite' | 'stockage' | 'commande' | 'shipping' | 'conformite' | 'retour'

  type FaqItem = {
    id: string
    cat: CatId
    q: string
    a: string // HTML autorisé (basique)
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

  /* ----------------------- CONTENU FAQ ----------------------- */
  const faqs: FaqItem[] = [
    // Qualité
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

    // Stockage
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

    // Commandes
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

    // Expédition
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

    // Conformité
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

    // Retours & support
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

  /* ----------------------- RECHERCHE / FILTRE ----------------------- */
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

  /* ----------------------- Permaliens (#hash) ----------------------- */
  /** Met à jour le hash (permalien question) sans recharger la page */
  function setHash(id: string) {
    history.replaceState(null, '', `#${encodeURIComponent(id)}`)
  }

  /** Ouvre la question depuis le hash et scroll + highlight */
  async function openFromHash() {
    const raw = window.location.hash?.slice(1)
    if (!raw) return
    const id = decodeURIComponent(raw)
    const target = faqs.find((f) => f.id === id)
    if (!target) return
    // Assure que la catégorie est visible
    selectedCategory.value = target.cat
    await nextTick()
    requestAnimationFrame(() => {
      const el = document.getElementById(id) as HTMLDetailsElement | null
      if (!el) return
      el.open = true
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      el.classList.add('faq-item--flash')
      setTimeout(() => el.classList.remove('faq-item--flash'), 1200)
    })
  }

  /* ----------------------- JSON-LD (SEO) ----------------------- */
  function injectFaqJsonLd() {
    // on envoie tous les Q/R pour le rich snippet
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
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__header {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: @neutral-900;
    }

    &__toolbar {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    &__groups {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    &__footer {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  /* Group */
  .faq-group {
    background: #fff;
    border: 1px solid @neutral-200;
    border-radius: 14px;
    box-shadow: 0 2px 8px fade(@neutral-900, 5%);
    overflow: hidden;

    &__header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 16px;
      background: @neutral-50;
      border-bottom: 1px solid @neutral-200;
      color: @neutral-900;
    }

    &__items {
      display: flex;
      flex-direction: column;
    }
  }

  /* Accordion item */
  .faq-item {
    border-top: 1px solid @neutral-200;
    scroll-margin-top: 90px; // espace sous un éventuel header fixe

    &:first-child {
      border-top: none;
    }

    /* remove default arrow */
    summary::-webkit-details-marker {
      display: none;
    }

    &__question {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 16px;
      cursor: pointer;
      list-style: none;
      transition: background-color 0.2s ease;
      color: @neutral-900;

      .chevron {
        transition: transform 0.2s ease;
      }
    }

    &__answer {
      padding: 0 16px 16px 36px;
      line-height: 1.6;
      color: @neutral-800;
    }

    /* hover/active */
    &:hover .faq-item__question {
      background: fade(@neutral-900, 4%);
    }
    &[open] .chevron {
      transform: rotate(90deg);
    }
  }

  /* Surlignage quand on arrive depuis un lien (hash) */
  .faq-item:target .faq-item__question,
  .faq-item--flash .faq-item__question {
    background: fade(@primary-600, 10%);
    box-shadow: 0 0 0 2px fade(@primary-600, 25%) inset;
    border-radius: 10px;
  }

  /* RUO callout */
  .faq-ruo {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    background: fade(@danger-500, 6%);
    border: 1px solid fade(@danger-500, 20%);
    border-radius: 8px;
  }
</style>
