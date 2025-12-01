/**
 * French (Français) - Default language
 */
export default {
  // ============================================
  // COMMON / SHARED
  // ============================================
  common: {
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    retry: 'Réessayer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    all: 'Tous',
    none: 'Aucun',
    yes: 'Oui',
    no: 'Non',
    or: 'ou',
    and: 'et',
    seeMore: 'Voir plus',
    seeLess: 'Voir moins',
    learnMore: 'En savoir plus',
    viewAll: 'Voir tout',
    showMore: 'Afficher plus',
    showLess: 'Afficher moins',
    comingSoon: 'Bientôt',
  },

  // ============================================
  // NAVIGATION
  // ============================================
  nav: {
    home: 'Accueil',
    catalogue: 'Catalogue',
    news: 'Actualités',
    faq: 'FAQ',
    contact: 'Contact',
    cart: 'Panier',
    profile: 'Profil',
    orders: 'Mes commandes',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: "S'inscrire",
    admin: 'Administration',
    guest: 'Invité',
  },

  // ============================================
  // AUTHENTICATION
  // ============================================
  auth: {
    login: {
      title: 'Connexion',
      welcome: 'Bon retour',
      subtitle: 'Connectez-vous pour accéder à votre espace et poursuivre vos recherches.',
      email: 'Email professionnel',
      password: 'Mot de passe',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      submit: 'Se connecter',
      noAccount: 'Pas encore de compte ?',
      createAccount: 'Créer un compte',
      orContinueWith: 'Ou continuer avec',
      google: 'Google',
    },
    register: {
      title: 'Créer un compte',
      subtitle: 'Rejoignez Fast Peptides pour accéder à notre catalogue complet et à nos outils.',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email professionnel',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      acceptTerms: "J'accepte les",
      terms: "conditions générales d'utilisation",
      submit: "S'inscrire",
      alreadyAccount: 'Vous avez déjà un compte ?',
      login: 'Se connecter',
    },
    reset: {
      title: 'Mot de passe oublié ?',
      subtitle: 'Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.',
      email: 'Email',
      submit: 'Envoyer le lien de réinitialisation',
      backToLogin: 'Retour à la connexion',
      success: 'Si un compte existe avec cet e-mail, vous recevrez bientôt un lien.',
    },
    callback: {
      loading: 'Connexion sécurisée',
      verifying: 'Fast Peptides vérifie vos accès...',
      success: 'Connexion réussie !',
      welcome: 'Bienvenue',
      invalidLink: 'Lien invalide',
      linkExpired: 'Ce lien a expiré.',
      invalidValidation: 'Lien de validation invalide.',
      noSession: 'Aucune session trouvée. Veuillez vous reconnecter.',
    },
    errors: {
      invalidEmail: 'Adresse email invalide',
      invalidPassword: 'Mot de passe invalide',
      emailRequired: "L'email est requis",
      passwordRequired: 'Le mot de passe est requis',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      userNotFound: 'Utilisateur non trouvé',
      wrongPassword: 'Mot de passe incorrect',
      emailAlreadyUsed: 'Cette adresse email est déjà utilisée',
      weakPassword: 'Le mot de passe doit contenir au moins 8 caractères',
      generic: 'Une erreur est survenue. Veuillez réessayer.',
      captchaRequired: 'Veuillez valider la sécurité.',
      invalidCredentials: 'Email ou mot de passe incorrect.',
      registrationFailed: "Une erreur est survenue lors de l'inscription.",
      resetFailed: "Impossible d'envoyer l'e-mail. Veuillez réessayer plus tard.",
    },
  },

  // ============================================
  // CATALOGUE
  // ============================================
  catalogue: {
    title: 'Catalogue',
    subtitle: 'Découvrez notre sélection de peptides de recherche',
    searchPlaceholder: 'Rechercher un peptide...',
    filters: {
      title: 'Filtres',
      categories: 'Catégories',
      tags: 'Tags',
      price: 'Prix',
      inStock: 'En stock uniquement',
      resetAll: 'Réinitialiser',
    },
    sort: {
      label: 'Trier par',
      newest: 'Plus récents',
      priceAsc: 'Prix croissant',
      priceDesc: 'Prix décroissant',
      nameAsc: 'Nom A-Z',
      nameDesc: 'Nom Z-A',
      popular: 'Popularité',
    },
    product: {
      addToCart: 'Ajouter au panier',
      outOfStock: 'Rupture de stock',
      inStock: 'En stock',
      lowStock: 'Stock limité',
      viewDetails: 'Voir les détails',
      quantity: 'Quantité',
      purity: 'Pureté',
      format: 'Format',
    },
    results: {
      showing: 'Affichage de',
      of: 'sur',
      products: 'produits',
      noResults: 'Aucun produit trouvé',
      noResultsText: 'Essayez de modifier vos filtres ou votre recherche',
    },
    categories: {
      recovery: 'Récupération',
      weightLoss: 'Perte de poids',
      growth: 'Croissance',
      antiAging: 'Anti-âge',
      performance: 'Performance',
      wellness: 'Bien-être',
      hormonal: 'Hormonal',
      nootropic: 'Nootropique',
      cosmetic: 'Cosmétique',
      health: 'Santé',
    },
  },

  // ============================================
  // PRODUCT DETAILS
  // ============================================
  product: {
    description: 'Description',
    specifications: 'Spécifications',
    storage: 'Conservation',
    research: 'Applications recherche',
    coa: "Certificat d'analyse",
    downloadCoa: 'Télécharger le CoA',
    relatedProducts: 'Produits similaires',
    reviews: 'Avis',
    addToCart: 'Ajouter au panier',
    buyNow: 'Acheter maintenant',
    selectQuantity: 'Sélectionner la quantité',
    selectFormat: 'Sélectionner le format',
    trustBadges: {
      quality: 'Qualité certifiée',
      shipping: 'Livraison rapide',
      support: 'Support expert',
      secure: 'Paiement sécurisé',
    },
  },

  // ============================================
  // CART
  // ============================================
  cart: {
    title: 'Panier',
    empty: 'Votre panier est vide',
    emptyText: 'Découvrez notre catalogue et ajoutez des produits',
    continueShopping: 'Continuer mes achats',
    item: 'Article',
    items: 'Articles',
    quantity: 'Quantité',
    price: 'Prix',
    total: 'Total',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    freeShipping: 'Gratuite',
    discount: 'Réduction',
    tax: 'TVA',
    grandTotal: 'Total TTC',
    checkout: 'Passer commande',
    remove: 'Supprimer',
    update: 'Mettre à jour',
    promoCode: 'Code promo',
    apply: 'Appliquer',
    promoApplied: 'Code promo appliqué',
    promoError: 'Code promo invalide',
  },

  // ============================================
  // CHECKOUT
  // ============================================
  checkout: {
    title: 'Commande',
    steps: {
      cart: 'Panier',
      shipping: 'Livraison',
      payment: 'Paiement',
      confirmation: 'Confirmation',
    },
    shipping: {
      title: 'Adresse de livraison',
      firstName: 'Prénom',
      lastName: 'Nom',
      company: 'Société (optionnel)',
      address: 'Adresse',
      addressLine2: 'Complément (optionnel)',
      city: 'Ville',
      postalCode: 'Code postal',
      country: 'Pays',
      phone: 'Téléphone',
      saveAddress: 'Enregistrer cette adresse',
      shippingMethod: 'Mode de livraison',
      standard: 'Standard',
      express: 'Express',
      relay: 'Point Relais',
      home: 'À domicile',
      whereToDeliver: 'Où souhaitez-vous être livré ?',
    },
    payment: {
      title: 'Paiement',
      method: 'Choisissez votre méthode de paiement',
      card: 'Carte bancaire',
      cardNumber: 'Numéro de carte',
      expiry: "Date d'expiration",
      cvv: 'CVV',
      billingAddress: 'Adresse de facturation',
      sameAsShipping: "Identique à l'adresse de livraison",
      securePayment: 'Paiement 100% sécurisé',
      paypalSecure: 'Paiement sécurisé PayPal',
      otherMethods: 'Autres méthodes',
      sslProtected: 'Données protégées SSL',
      satisfaction: 'Satisfaction garantie',
    },
    summary: {
      title: 'Récapitulatif',
      orderTotal: 'Total de la commande',
    },
    placeOrder: 'Confirmer la commande',
    processing: 'Traitement en cours...',
    success: {
      title: 'Paiement confirmé !',
      error: 'Erreur',
      finalizing: 'Finalisation',
      orderRegistered: 'Votre commande a bien été enregistrée',
      verificationRequired: 'Vérification nécessaire',
      secure: 'Sécurisé',
      fast: 'Rapide',
      shop: 'Boutique',
      createAccount: 'Créer mon compte',
      trackOrders: 'Suivez vos commandes facilement',
      email: 'Email',
      password: 'Mot de passe',
      minChars: 'Min. 6 caractères',
      activate: 'Activer',
      track: 'Suivre',
      history: 'Historique',
      realTimeTracking: 'Suivi temps réel',
      exclusiveOffers: 'Offres exclusives',
      orderSaved: 'Commande enregistrée',
      findInSpace: 'Retrouvez-la dans votre espace',
      viewOrder: 'Voir ma commande',
      problemOccurred: 'Un problème est survenu. Notre équipe a été notifiée.',
      newMember: 'Nouveau Membre',
      confirmationEmailSent: '📧 Un email de confirmation vous a été envoyé !',
      linkOrderError: 'Impossible de lier la commande. Veuillez contacter le support.',
      conversionError: 'Erreur lors de la conversion',
      trackingTokenNotFound: 'Token de suivi introuvable',
      accountCreationError: 'Erreur lors de la création du compte',
      confirmationProblem: 'Problème lors de la confirmation.',
    },
    cancel: {
      title: 'Paiement annulé',
      subtitle: "Le paiement n'a pas pu être finalisé ou a été interrompu.",
      retryAnytime: 'Vous pouvez réessayer à tout moment.',
      backToCart: 'Retourner au panier',
    },
    wrapper: {
      securePayment: 'Paiement sécurisé et vérifié par Stripe 🔒',
    },
  },

  // ============================================
  // ORDERS
  // ============================================
  orders: {
    title: 'Mes commandes',
    empty: 'Aucune commande',
    emptyText: "Vous n'avez pas encore passé de commande",
    orderNumber: 'Commande n°',
    date: 'Date',
    status: 'Statut',
    total: 'Total',
    details: 'Détails',
    track: 'Suivre',
    invoice: 'Facture',
    reorder: 'Commander à nouveau',
    statuses: {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      refunded: 'Remboursée',
    },
  },

  // ============================================
  // TRACKING
  // ============================================
  tracking: {
    title: 'Suivi de commande',
    subtitle: 'Suivez votre commande en temps réel',
    searchPlaceholder: 'Numéro de commande ou email',
    search: 'Rechercher',
    orderFound: 'Commande trouvée',
    orderNotFound: 'Commande non trouvée',
    orderNotFoundText: 'Vérifiez le numéro de commande et réessayez',
    timeline: {
      ordered: 'Commande passée',
      confirmed: 'Commande confirmée',
      processing: 'En préparation',
      shipped: 'Expédiée',
      inTransit: 'En transit',
      delivered: 'Livrée',
    },
    carrier: 'Transporteur',
    trackingNumber: 'Numéro de suivi',
    estimatedDelivery: 'Livraison estimée',
  },

  // ============================================
  // PROFILE
  // ============================================
  profile: {
    title: 'Mon profil',
    personalInfo: 'Informations personnelles',
    email: 'Email',
    emailNotSet: 'e-mail non renseigné',
    phone: 'Téléphone',
    phonePlaceholder: '+33 6 ...',
    fullName: 'Nom complet',
    fullNamePlaceholder: 'Prénom et Nom',
    addresses: 'Adresses',
    addAddress: 'Ajouter une adresse',
    defaultAddress: 'Adresse de livraison par défaut',
    addressLabel: 'Adresse (N° et Rue)',
    addressPlaceholder: '12 rue du Peptide',
    postalCode: 'Code postal',
    city: 'Ville',
    country: 'Pays',
    security: 'Sécurité & gestion du compte',
    changePassword: 'Changer le mot de passe',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmNewPassword: 'Confirmer le mot de passe',
    updatePassword: 'Mettre à jour le mot de passe',
    preferences: 'Préférences & réglages',
    language: 'Langue',
    currency: 'Devise',
    notifications: 'Notifications',
    newsletter: 'Recevoir les newsletters et promotions',
    deleteAccount: 'Supprimer mon compte',
    deleteAccountWarning: 'Cette action est irréversible',
    saveChanges: 'Enregistrer les modifications',
    savePreferences: 'Sauvegarder mes préférences',
    recentOrders: 'Mes commandes récentes',
    viewAllOrders: 'Voir toutes mes commandes',
    noOrders: "Vous n'avez pas encore de commande.",
    startShopping: 'Commencez vos achats !',
    orderNumber: 'Commande #',
    orderTotal: 'Total :',
    orderDate: 'Passée le',
    appearance: 'Apparence',
    theme: "Thème de l'interface",
    themeDesc: "Sélectionnez l'ambiance couleur que vous préférez.",
    support: 'Assistance & support',
    supportDesc: 'Vous avez une question sur une commande ou un produit ? Contactez notre support client pour une assistance immédiate.',
    openMessaging: 'Ouvrir la messagerie',
  },

  // ============================================
  // FAQ
  // ============================================
  faq: {
    title: 'Questions fréquentes',
    subtitle: 'Trouvez rapidement des réponses à vos questions',
    searchPlaceholder: 'Rechercher une question...',
    categories: {
      all: 'Toutes les catégories',
      products: 'Produits & Qualité',
      storage: 'Stockage & Manipulation',
      orders: 'Commandes & Paiement',
      shipping: 'Expédition & Suivi',
      compliance: 'Conformité & Sécurité',
      returns: 'Retours & Support',
    },
    noResults: 'Aucun résultat trouvé',
    noResultsText: "Essayez avec d'autres termes ou parcourez les catégories",
    reset: 'Réinitialiser',
    needHelp: "Besoin d'aide ?",
    contactSupport: 'Contacter le support',
    responseTime: 'Réponse sous 24h',
  },

  // ============================================
  // RECONSTITUTION
  // ============================================
  reconstitution: {
    title: 'Guide de Reconstitution',
    subtitle: 'Calculateur et protocole pour la recherche',
    calculator: {
      title: 'Calculateur de Dosage',
      subtitle: 'Entrez vos paramètres pour obtenir le volume exact',
      vialAmount: 'Quantité de Peptide (Vial)',
      waterAmount: 'Eau Bactériostatique Ajoutée',
      desiredDose: 'Dose de Recherche Désirée',
      presets: 'Presets rapides',
      result: 'Volume à prélever',
      concentration: 'Concentration',
      dosesAvailable: 'Doses disponibles',
    },
    protocol: {
      title: 'Protocole de Reconstitution',
      subtitle: 'Suivez ces étapes pour une préparation optimale',
      step1: {
        title: 'Préparation',
        desc: "Désinfectez le bouchon du flacon de peptide et celui de l'eau bactériostatique avec un tampon d'alcool isopropylique 70%.",
      },
      step2: {
        title: "Prélèvement de l'eau",
        desc: "À l'aide d'une seringue stérile, prélevez la quantité d'eau bactériostatique souhaitée. Évitez les bulles d'air.",
      },
      step3: {
        title: 'Injection douce',
        desc: "Injectez l'eau lentement contre la paroi interne du flacon de peptide pour éviter d'endommager la poudre lyophilisée.",
      },
      step4: {
        title: 'Dissolution',
        desc: "Ne secouez jamais ! Faites rouler doucement le flacon entre vos mains jusqu'à dissolution complète.",
      },
    },
    storage: {
      title: 'Stockage après reconstitution',
      text: 'Une fois mélangé, le peptide doit être conservé au réfrigérateur (2-8°C). À l\'abri de la lumière. Durée de vie moyenne : 4 à 8 semaines.',
    },
    warning: {
      title: 'Usage Recherche Uniquement',
      text: 'Ces informations sont fournies à titre éducatif pour la manipulation en laboratoire. Ne jamais utiliser sur des humains ou animaux.',
    },
  },

  // ============================================
  // NEWS / ACTUALITES
  // ============================================
  news: {
    title: 'Actualités',
    subtitle: 'Les dernières avancées en recherche peptidique',
    featured: 'À la une',
    latest: 'Articles récents',
    categories: 'Catégories',
    readMore: "Lire l'article",
    readTime: 'min de lecture',
    share: 'Partager',
    relatedArticles: 'Articles similaires',
    backToNews: 'Retour aux actualités',
    publishedOn: 'Publié le',
    author: 'Par',
  },

  // ============================================
  // FOOTER
  // ============================================
  footer: {
    description: 'Peptides de recherche de haute qualité pour les laboratoires et instituts de recherche.',
    quickLinks: 'Navigation',
    legal: 'Informations',
    terms: 'Conditions générales',
    privacy: 'Confidentialité',
    cookies: 'Cookies',
    refunds: 'Politique de remboursement',
    contact: 'Contact',
    support: 'Support',
    researchOnly: 'Research Use Only',
    copyright: '© {year} Fast-Peptides. Tous droits réservés.',
    legalNotice: 'Mentions légales',
    hours: 'Lun - Ven : 9h - 18h',
    region: 'France & Europe',
    securePayments: 'Paiements sécurisés',
    sslSecure: 'SSL Sécurisé',
    disclaimer: {
      research: 'Recherche uniquement',
      researchDesc: 'Produits destinés à la recherche scientifique',
      noHuman: "Pas d'usage humain",
      noHumanDesc: 'Non destiné à un usage thérapeutique',
      responsibility: 'Responsabilité',
      responsibilityDesc: "L'acheteur respecte la législation locale",
    },
    newsletter: {
      title: 'Newsletter',
      subtitle: 'Nouveautés & offres exclusives',
      placeholder: 'votre@email.com',
      subscribe: "S'abonner",
      success: 'Inscription réussie !',
    },
  },

  // ============================================
  // ADMIN
  // ============================================
  admin: {
    stats: 'Statistiques',
    users: 'Utilisateurs',
    orders: 'Commandes',
    products: 'Produits',
    news: 'Actualités',
    categories: 'Catégories',
    messaging: 'Messagerie',
  },

  // ============================================
  // ERRORS & MESSAGES
  // ============================================
  errors: {
    notFound: 'Page non trouvée',
    notFoundText: "La page que vous recherchez n'existe pas",
    serverError: 'Erreur serveur',
    serverErrorText: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    unauthorized: 'Accès non autorisé',
    unauthorizedText: "Vous n'avez pas les permissions nécessaires",
    sessionExpired: 'Session expirée',
    sessionExpiredText: 'Veuillez vous reconnecter',
    networkError: 'Erreur réseau',
    networkErrorText: 'Vérifiez votre connexion internet',
  },

  // ============================================
  // SUCCESS MESSAGES
  // ============================================
  success: {
    saved: 'Modifications enregistrées',
    deleted: 'Supprimé avec succès',
    copied: 'Copié dans le presse-papier',
    addedToCart: 'Ajouté au panier',
    orderPlaced: 'Commande confirmée',
    messageSent: 'Message envoyé',
    subscribed: 'Inscription réussie',
  },

  // ============================================
  // LANGUAGE
  // ============================================
  language: {
    select: 'Langue',
    current: 'Français',
    fr: 'Français',
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    it: 'Italiano',
  },

  // ============================================
  // ROUTES (Page titles & descriptions)
  // ============================================
  routes: {
    home: {
      title: 'Accueil – Fast Peptides',
      description: 'La référence européenne pour les peptides de recherche certifiés.',
    },
    auth: {
      login: 'Connexion',
      register: 'Inscription',
      reset: 'Mot de passe oublié',
      emailSent: 'Email envoyé',
      callback: 'Vérification en cours...',
    },
    profile: {
      title: 'Mon profil – Fast Peptides',
      description: 'Gérez vos informations personnelles, préférences et sécurité de votre compte.',
    },
    orders: {
      title: 'Mes commandes – Fast Peptides',
      description: 'Retrouvez toutes vos commandes précédentes sur Fast Peptides.',
    },
    orderDetail: {
      title: 'Détail de commande – Fast Peptides',
    },
    updatePassword: {
      title: 'Nouveau mot de passe – Fast Peptides',
      description: 'Choisissez un nouveau mot de passe pour accéder à votre compte Fast Peptides.',
    },
    updatePasswordSuccess: {
      title: 'Mot de passe mis à jour – Fast Peptides',
      description: 'Votre mot de passe a été modifié avec succès.',
    },
    accessDenied: {
      title: 'Accès refusé – Fast Peptides',
    },
    catalogue: {
      title: 'Catalogue – Fast Peptides',
      heading: 'Notre catalogue',
      description: "Découvrez l'ensemble de nos peptides & produits disponibles pour la recherche.",
    },
    product: {
      title: 'Produit – Fast Peptides',
    },
    news: {
      title: 'Actualités – Fast Peptides',
      heading: 'Restez informé sur la recherche peptidique',
      description: 'Découvrez nos derniers articles, études et actualités sur les peptides de recherche',
      badge: 'Blog & Actualités',
    },
    newsDetail: {
      description: 'Découvrez les détails de cette actualité sur Fast Peptides.',
    },
    cart: {
      title: 'Mon panier – Fast Peptides',
      description: 'Vérifiez vos articles, ajustez les quantités et validez votre commande.',
      badge: 'Votre sélection',
    },
    paymentSuccess: {
      title: 'Paiement Réussi 🎉',
    },
    paymentCancel: {
      title: 'Paiement Annulé',
    },
    tracking: {
      title: 'Suivre ma commande – Fast Peptides',
      heading: 'Suivez votre livraison',
      description: "Consultez l'état d'avancement de votre colis en temps réel",
      badge: 'Suivi de commande',
    },
    admin: {
      title: 'Espace administrateur – Fast Peptides',
      heading: 'Espace administrateur',
      description: 'Gérez les produits, utilisateurs, commandes, statistiques et actualités du site Fast Peptides.',
    },
    faq: {
      title: 'FAQ – Fast Peptides',
      description: 'Trouvez rapidement des réponses à vos questions sur nos produits et services',
      badge: "Centre d'aide",
    },
    cgu: {
      title: 'CGU – Fast Peptides',
      heading: 'Conditions Générales',
      description: "Consultez nos conditions générales d'utilisation (CGU) en vigueur.",
    },
    reconstitution: {
      title: 'Calculateur de Dosage & Reconstitution – Fast Peptides',
      heading: 'Calculateur de Reconstitution',
      description: 'Calculez précisément le volume à prélever pour vos protocoles de recherche',
      badge: 'Outil de laboratoire',
    },
  },
} as const
