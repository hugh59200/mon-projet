/**
 * German (Deutsch)
 */
export default {
  // ============================================
  // COMMON / SHARED
  // ============================================
  common: {
    loading: 'Laden...',
    error: 'Ein Fehler ist aufgetreten',
    retry: 'Erneut versuchen',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    save: 'Speichern',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    close: 'Schließen',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Zurück',
    search: 'Suchen',
    filter: 'Filtern',
    sort: 'Sortieren',
    all: 'Alle',
    none: 'Keine',
    yes: 'Ja',
    no: 'Nein',
    or: 'oder',
    and: 'und',
    seeMore: 'Mehr sehen',
    seeLess: 'Weniger sehen',
    learnMore: 'Mehr erfahren',
    viewAll: 'Alle anzeigen',
    showMore: 'Mehr anzeigen',
    showLess: 'Weniger anzeigen',
    comingSoon: 'Demnächst',
  },

  // ============================================
  // NAVIGATION
  // ============================================
  nav: {
    home: 'Startseite',
    catalogue: 'Katalog',
    news: 'Neuigkeiten',
    faq: 'FAQ',
    contact: 'Kontakt',
    cart: 'Warenkorb',
    profile: 'Profil',
    orders: 'Meine Bestellungen',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
    admin: 'Verwaltung',
    guest: 'Gast',
  },

  // ============================================
  // AUTHENTICATION
  // ============================================
  auth: {
    login: {
      title: 'Anmelden',
      welcome: 'Willkommen zurück',
      subtitle: 'Melden Sie sich an, um auf Ihren Bereich zuzugreifen und Ihre Forschung fortzusetzen.',
      email: 'Berufliche E-Mail',
      password: 'Passwort',
      rememberMe: 'Angemeldet bleiben',
      forgotPassword: 'Passwort vergessen?',
      submit: 'Anmelden',
      noAccount: 'Noch kein Konto?',
      createAccount: 'Konto erstellen',
      orContinueWith: 'Oder fortfahren mit',
      google: 'Google',
    },
    register: {
      title: 'Konto erstellen',
      subtitle: 'Treten Sie Fast Peptides bei, um auf unseren kompletten Katalog und unsere Tools zuzugreifen.',
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'Berufliche E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      acceptTerms: 'Ich akzeptiere die',
      terms: 'Allgemeinen Geschäftsbedingungen',
      submit: 'Registrieren',
      alreadyAccount: 'Bereits ein Konto?',
      login: 'Anmelden',
    },
    reset: {
      title: 'Passwort vergessen?',
      subtitle: 'Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.',
      email: 'E-Mail',
      submit: 'Link zum Zurücksetzen senden',
      backToLogin: 'Zurück zur Anmeldung',
      success: 'Wenn ein Konto mit dieser E-Mail existiert, erhalten Sie in Kürze einen Link.',
    },
    callback: {
      loading: 'Sichere Anmeldung',
      verifying: 'Fast Peptides überprüft Ihren Zugang...',
      success: 'Anmeldung erfolgreich!',
      welcome: 'Willkommen',
      invalidLink: 'Ungültiger Link',
      linkExpired: 'Dieser Link ist abgelaufen.',
      invalidValidation: 'Ungültiger Validierungslink.',
      noSession: 'Keine Sitzung gefunden. Bitte melden Sie sich erneut an.',
    },
    errors: {
      invalidEmail: 'Ungültige E-Mail-Adresse',
      invalidPassword: 'Ungültiges Passwort',
      emailRequired: 'E-Mail ist erforderlich',
      passwordRequired: 'Passwort ist erforderlich',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      userNotFound: 'Benutzer nicht gefunden',
      wrongPassword: 'Falsches Passwort',
      emailAlreadyUsed: 'Diese E-Mail wird bereits verwendet',
      weakPassword: 'Das Passwort muss mindestens 8 Zeichen haben',
      generic: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      captchaRequired: 'Bitte bestätigen Sie die Sicherheitsprüfung.',
      invalidCredentials: 'Ungültige E-Mail oder Passwort.',
      registrationFailed: 'Bei der Registrierung ist ein Fehler aufgetreten.',
      resetFailed: 'E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.',
    },
  },

  // ============================================
  // CATALOGUE
  // ============================================
  catalogue: {
    title: 'Katalog',
    subtitle: 'Entdecken Sie unsere Auswahl an Forschungspeptiden',
    searchPlaceholder: 'Peptide suchen...',
    filters: {
      title: 'Filter',
      categories: 'Kategorien',
      tags: 'Tags',
      price: 'Preis',
      inStock: 'Nur auf Lager',
      resetAll: 'Alle zurücksetzen',
    },
    sort: {
      label: 'Sortieren nach',
      newest: 'Neueste',
      priceAsc: 'Preis aufsteigend',
      priceDesc: 'Preis absteigend',
      nameAsc: 'Name A-Z',
      nameDesc: 'Name Z-A',
      popular: 'Beliebtheit',
    },
    product: {
      addToCart: 'In den Warenkorb',
      outOfStock: 'Nicht auf Lager',
      inStock: 'Auf Lager',
      lowStock: 'Geringer Bestand',
      viewDetails: 'Details anzeigen',
      quantity: 'Menge',
      purity: 'Reinheit',
      format: 'Format',
    },
    results: {
      showing: 'Anzeige von',
      of: 'von',
      products: 'Produkte',
      noResults: 'Keine Produkte gefunden',
      noResultsText: 'Versuchen Sie, Ihre Filter oder Suche anzupassen',
    },
    categories: {
      recovery: 'Erholung',
      weightLoss: 'Gewichtsverlust',
      growth: 'Wachstum',
      antiAging: 'Anti-Aging',
      performance: 'Leistung',
      wellness: 'Wohlbefinden',
      hormonal: 'Hormonal',
      nootropic: 'Nootropisch',
      cosmetic: 'Kosmetik',
      health: 'Gesundheit',
    },
  },

  // ============================================
  // PRODUCT DETAILS
  // ============================================
  product: {
    description: 'Beschreibung',
    specifications: 'Spezifikationen',
    storage: 'Lagerung',
    research: 'Forschungsanwendungen',
    coa: 'Analysezertifikat',
    downloadCoa: 'CoA herunterladen',
    relatedProducts: 'Ähnliche Produkte',
    reviews: 'Bewertungen',
    addToCart: 'In den Warenkorb',
    buyNow: 'Jetzt kaufen',
    selectQuantity: 'Menge wählen',
    selectFormat: 'Format wählen',
    trustBadges: {
      quality: 'Zertifizierte Qualität',
      shipping: 'Schneller Versand',
      support: 'Experten-Support',
      secure: 'Sichere Zahlung',
    },
  },

  // ============================================
  // CART
  // ============================================
  cart: {
    title: 'Warenkorb',
    empty: 'Ihr Warenkorb ist leer',
    emptyText: 'Durchstöbern Sie unseren Katalog und fügen Sie Produkte hinzu',
    continueShopping: 'Weiter einkaufen',
    item: 'Artikel',
    items: 'Artikel',
    quantity: 'Menge',
    price: 'Preis',
    total: 'Gesamt',
    subtotal: 'Zwischensumme',
    shipping: 'Versand',
    freeShipping: 'Kostenlos',
    discount: 'Rabatt',
    tax: 'MwSt.',
    grandTotal: 'Gesamtsumme',
    checkout: 'Zur Kasse',
    remove: 'Entfernen',
    update: 'Aktualisieren',
    promoCode: 'Gutscheincode',
    apply: 'Anwenden',
    promoApplied: 'Gutscheincode angewendet',
    promoError: 'Ungültiger Gutscheincode',
  },

  // ============================================
  // CHECKOUT
  // ============================================
  checkout: {
    title: 'Kasse',
    steps: {
      cart: 'Warenkorb',
      shipping: 'Versand',
      payment: 'Zahlung',
      confirmation: 'Bestätigung',
    },
    shipping: {
      title: 'Lieferadresse',
      firstName: 'Vorname',
      lastName: 'Nachname',
      company: 'Firma (optional)',
      address: 'Adresse',
      addressLine2: 'Zusatz (optional)',
      city: 'Stadt',
      postalCode: 'Postleitzahl',
      country: 'Land',
      phone: 'Telefon',
      saveAddress: 'Diese Adresse speichern',
      shippingMethod: 'Versandart',
      standard: 'Standard',
      express: 'Express',
      relay: 'Abholstation',
    },
    payment: {
      title: 'Zahlung',
      method: 'Zahlungsart',
      card: 'Kreditkarte',
      cardNumber: 'Kartennummer',
      expiry: 'Ablaufdatum',
      cvv: 'CVV',
      billingAddress: 'Rechnungsadresse',
      sameAsShipping: 'Identisch mit Lieferadresse',
      securePayment: '100% sichere Zahlung',
    },
    summary: {
      title: 'Bestellübersicht',
      orderTotal: 'Bestellsumme',
    },
    placeOrder: 'Bestellung aufgeben',
    processing: 'Verarbeitung...',
    success: {
      title: 'Zahlung bestätigt!',
      error: 'Fehler',
      finalizing: 'Finalisierung',
      orderRegistered: 'Ihre Bestellung wurde registriert',
      verificationRequired: 'Überprüfung erforderlich',
      secure: 'Sicher',
      fast: 'Schnell',
      shop: 'Shop',
      createAccount: 'Mein Konto erstellen',
      trackOrders: 'Verfolgen Sie Ihre Bestellungen einfach',
      email: 'E-Mail',
      password: 'Passwort',
      minChars: 'Min. 6 Zeichen',
      activate: 'Aktivieren',
      track: 'Verfolgen',
      history: 'Verlauf',
      realTimeTracking: 'Echtzeit-Tracking',
      exclusiveOffers: 'Exklusive Angebote',
      orderSaved: 'Bestellung gespeichert',
      findInSpace: 'Finden Sie es in Ihrem Bereich',
      viewOrder: 'Meine Bestellung ansehen',
      problemOccurred: 'Ein Problem ist aufgetreten. Unser Team wurde benachrichtigt.',
      newMember: 'Neues Mitglied',
      confirmationEmailSent: '📧 Eine Bestätigungs-E-Mail wurde an Sie gesendet!',
      linkOrderError: 'Die Bestellung konnte nicht verknüpft werden. Bitte kontaktieren Sie den Support.',
      conversionError: 'Fehler bei der Konvertierung',
      trackingTokenNotFound: 'Tracking-Token nicht gefunden',
      accountCreationError: 'Fehler beim Erstellen des Kontos',
      confirmationProblem: 'Problem bei der Bestätigung.',
    },
    cancel: {
      title: 'Zahlung abgebrochen',
      subtitle: 'Die Zahlung konnte nicht abgeschlossen werden oder wurde unterbrochen.',
      retryAnytime: 'Sie können es jederzeit erneut versuchen.',
      backToCart: 'Zurück zum Warenkorb',
    },
    wrapper: {
      securePayment: 'Sichere Zahlung, verifiziert von Stripe 🔒',
    },
  },

  // ============================================
  // ORDERS
  // ============================================
  orders: {
    title: 'Meine Bestellungen',
    empty: 'Keine Bestellungen',
    emptyText: 'Sie haben noch keine Bestellungen aufgegeben',
    orderNumber: 'Bestellung Nr.',
    date: 'Datum',
    status: 'Status',
    total: 'Gesamt',
    details: 'Details',
    track: 'Verfolgen',
    invoice: 'Rechnung',
    reorder: 'Erneut bestellen',
    statuses: {
      pending: 'Ausstehend',
      confirmed: 'Bestätigt',
      processing: 'In Bearbeitung',
      shipped: 'Versendet',
      delivered: 'Geliefert',
      cancelled: 'Storniert',
      refunded: 'Erstattet',
    },
  },

  // ============================================
  // TRACKING
  // ============================================
  tracking: {
    title: 'Bestellverfolgung',
    subtitle: 'Verfolgen Sie Ihre Bestellung in Echtzeit',
    searchPlaceholder: 'Bestellnummer oder E-Mail',
    search: 'Suchen',
    orderFound: 'Bestellung gefunden',
    orderNotFound: 'Bestellung nicht gefunden',
    orderNotFoundText: 'Überprüfen Sie die Bestellnummer und versuchen Sie es erneut',
    timeline: {
      ordered: 'Bestellt',
      confirmed: 'Bestätigt',
      processing: 'In Bearbeitung',
      shipped: 'Versendet',
      inTransit: 'Unterwegs',
      delivered: 'Geliefert',
    },
    carrier: 'Spediteur',
    trackingNumber: 'Sendungsnummer',
    estimatedDelivery: 'Voraussichtliche Lieferung',
  },

  // ============================================
  // PROFILE
  // ============================================
  profile: {
    title: 'Mein Profil',
    personalInfo: 'Persönliche Informationen',
    email: 'E-Mail',
    emailNotSet: 'E-Mail nicht angegeben',
    phone: 'Telefon',
    phonePlaceholder: '+49 ...',
    fullName: 'Vollständiger Name',
    fullNamePlaceholder: 'Vor- und Nachname',
    addresses: 'Adressen',
    addAddress: 'Adresse hinzufügen',
    defaultAddress: 'Standard-Lieferadresse',
    addressLabel: 'Adresse (Straße & Nr.)',
    addressPlaceholder: 'Peptidstraße 12',
    postalCode: 'Postleitzahl',
    city: 'Stadt',
    country: 'Land',
    security: 'Sicherheit & Kontoverwaltung',
    changePassword: 'Passwort ändern',
    currentPassword: 'Aktuelles Passwort',
    newPassword: 'Neues Passwort',
    confirmNewPassword: 'Passwort bestätigen',
    updatePassword: 'Passwort aktualisieren',
    preferences: 'Einstellungen & Präferenzen',
    language: 'Sprache',
    currency: 'Währung',
    notifications: 'Benachrichtigungen',
    newsletter: 'Newsletter und Aktionen erhalten',
    deleteAccount: 'Konto löschen',
    deleteAccountWarning: 'Diese Aktion kann nicht rückgängig gemacht werden',
    saveChanges: 'Änderungen speichern',
    savePreferences: 'Einstellungen speichern',
    recentOrders: 'Letzte Bestellungen',
    viewAllOrders: 'Alle Bestellungen anzeigen',
    noOrders: 'Sie haben noch keine Bestellungen aufgegeben.',
    startShopping: 'Jetzt einkaufen!',
    orderNumber: 'Bestellung #',
    orderTotal: 'Gesamt:',
    orderDate: 'Bestellt am',
    appearance: 'Erscheinungsbild',
    theme: 'Oberflächen-Theme',
    themeDesc: 'Wählen Sie Ihr bevorzugtes Farbschema.',
    support: 'Hilfe & Support',
    supportDesc: 'Haben Sie eine Frage zu einer Bestellung oder einem Produkt? Kontaktieren Sie unser Support-Team für sofortige Hilfe.',
    openMessaging: 'Nachrichten öffnen',
  },

  // ============================================
  // FAQ
  // ============================================
  faq: {
    title: 'Häufig gestellte Fragen',
    subtitle: 'Finden Sie schnell Antworten auf Ihre Fragen',
    searchPlaceholder: 'Fragen suchen...',
    categories: {
      all: 'Alle Kategorien',
      products: 'Produkte & Qualität',
      storage: 'Lagerung & Handhabung',
      orders: 'Bestellungen & Zahlung',
      shipping: 'Versand & Verfolgung',
      compliance: 'Compliance & Sicherheit',
      returns: 'Rückgaben & Support',
    },
    noResults: 'Keine Ergebnisse gefunden',
    noResultsText: 'Versuchen Sie andere Suchbegriffe oder durchsuchen Sie die Kategorien',
    reset: 'Zurücksetzen',
    needHelp: 'Brauchen Sie Hilfe?',
    contactSupport: 'Support kontaktieren',
    responseTime: 'Antwort innerhalb von 24h',
  },

  // ============================================
  // RECONSTITUTION
  // ============================================
  reconstitution: {
    title: 'Rekonstitutionsanleitung',
    subtitle: 'Rechner und Protokoll für die Forschung',
    calculator: {
      title: 'Dosierungsrechner',
      subtitle: 'Geben Sie Ihre Parameter ein, um das genaue Volumen zu erhalten',
      vialAmount: 'Peptidmenge (Fläschchen)',
      waterAmount: 'Hinzugefügtes bakteriostatisches Wasser',
      desiredDose: 'Gewünschte Forschungsdosis',
      presets: 'Schnellvoreinstellungen',
      result: 'Aufzuziehendes Volumen',
      concentration: 'Konzentration',
      dosesAvailable: 'Verfügbare Dosen',
    },
    protocol: {
      title: 'Rekonstitutionsprotokoll',
      subtitle: 'Befolgen Sie diese Schritte für eine optimale Zubereitung',
      step1: {
        title: 'Vorbereitung',
        desc: 'Desinfizieren Sie den Peptid-Fläschchenstopfen und den Stopfen des bakteriostatischen Wassers mit einem 70%igen Isopropylalkohol-Tupfer.',
      },
      step2: {
        title: 'Wasser aufziehen',
        desc: 'Ziehen Sie mit einer sterilen Spritze die gewünschte Menge bakteriostatisches Wasser auf. Vermeiden Sie Luftblasen.',
      },
      step3: {
        title: 'Sanfte Injektion',
        desc: 'Injizieren Sie das Wasser langsam an die Innenwand des Peptid-Fläschchens, um das lyophilisierte Pulver nicht zu beschädigen.',
      },
      step4: {
        title: 'Auflösung',
        desc: 'Niemals schütteln! Rollen Sie das Fläschchen sanft zwischen Ihren Händen bis zur vollständigen Auflösung.',
      },
    },
    storage: {
      title: 'Lagerung nach Rekonstitution',
      text: 'Nach dem Mischen muss das Peptid im Kühlschrank (2-8°C) aufbewahrt werden. Vor Licht schützen. Durchschnittliche Haltbarkeit: 4 bis 8 Wochen.',
    },
    warning: {
      title: 'Nur für Forschungszwecke',
      text: 'Diese Informationen werden zu Bildungszwecken für die Laborhandhabung bereitgestellt. Niemals bei Menschen oder Tieren anwenden.',
    },
  },

  // ============================================
  // NEWS / ACTUALITES
  // ============================================
  news: {
    title: 'Neuigkeiten',
    subtitle: 'Neueste Fortschritte in der Peptidforschung',
    featured: 'Empfohlen',
    latest: 'Neueste Artikel',
    categories: 'Kategorien',
    readMore: 'Artikel lesen',
    readTime: 'Min. Lesezeit',
    share: 'Teilen',
    relatedArticles: 'Ähnliche Artikel',
    backToNews: 'Zurück zu Neuigkeiten',
    publishedOn: 'Veröffentlicht am',
    author: 'Von',
  },

  // ============================================
  // FOOTER
  // ============================================
  footer: {
    description: 'Hochwertige Forschungspeptide für Labore und Forschungsinstitute.',
    quickLinks: 'Navigation',
    legal: 'Informationen',
    terms: 'Allgemeine Geschäftsbedingungen',
    privacy: 'Datenschutz',
    cookies: 'Cookies',
    refunds: 'Rückerstattungsrichtlinie',
    contact: 'Kontakt',
    support: 'Support',
    researchOnly: 'Research Use Only',
    copyright: '© {year} Fast-Peptides. Alle Rechte vorbehalten.',
    legalNotice: 'Impressum',
    hours: 'Mo - Fr: 9:00 - 18:00',
    region: 'Frankreich & Europa',
    securePayments: 'Sichere Zahlungen',
    sslSecure: 'SSL Gesichert',
    disclaimer: {
      research: 'Nur Forschung',
      researchDesc: 'Produkte für wissenschaftliche Forschung',
      noHuman: 'Keine menschliche Verwendung',
      noHumanDesc: 'Nicht für therapeutische Zwecke bestimmt',
      responsibility: 'Verantwortung',
      responsibilityDesc: 'Käufer hält lokale Vorschriften ein',
    },
    newsletter: {
      title: 'Newsletter',
      subtitle: 'Neuigkeiten & exklusive Angebote',
      placeholder: 'ihre@email.de',
      subscribe: 'Abonnieren',
      success: 'Erfolgreich abonniert!',
    },
  },

  // ============================================
  // ERRORS & MESSAGES
  // ============================================
  errors: {
    notFound: 'Seite nicht gefunden',
    notFoundText: 'Die gesuchte Seite existiert nicht',
    serverError: 'Serverfehler',
    serverErrorText: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    unauthorized: 'Nicht autorisiert',
    unauthorizedText: 'Sie haben keine Berechtigung für diese Seite',
    sessionExpired: 'Sitzung abgelaufen',
    sessionExpiredText: 'Bitte melden Sie sich erneut an',
    networkError: 'Netzwerkfehler',
    networkErrorText: 'Überprüfen Sie Ihre Internetverbindung',
  },

  // ============================================
  // SUCCESS MESSAGES
  // ============================================
  success: {
    saved: 'Änderungen gespeichert',
    deleted: 'Erfolgreich gelöscht',
    copied: 'In die Zwischenablage kopiert',
    addedToCart: 'Zum Warenkorb hinzugefügt',
    orderPlaced: 'Bestellung bestätigt',
    messageSent: 'Nachricht gesendet',
    subscribed: 'Erfolgreich abonniert',
  },

  // ============================================
  // LANGUAGE
  // ============================================
  language: {
    select: 'Sprache',
    current: 'Deutsch',
    fr: 'Français',
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    it: 'Italiano',
  },
} as const
