// supabase/utils/i18n.ts
// Système de traduction pour les emails transactionnels

export type Locale = 'fr' | 'en'

export const translations = {
  // ========== BASE EMAIL TEMPLATE ==========
  base: {
    needHelp: {
      fr: "Besoin d'aide ? Contactez notre support.",
      en: 'Need help? Contact our support.',
    },
    teamSignature: {
      fr: "L'équipe Atlas Lab (FP)",
      en: 'The Atlas Lab (FP) Team',
    },
    defaultNotificationTitle: {
      fr: 'Notification FP Store',
      en: 'FP Store Notification',
    },
    defaultNotificationMessage: {
      fr: 'Vous avez reçu une nouvelle notification.',
      en: 'You have received a new notification.',
    },
  },

  // ========== ORDER CONFIRMATION ==========
  confirmation: {
    title: {
      fr: (orderNumber: string) => `Commande #${orderNumber} confirmée`,
      en: (orderNumber: string) => `Order #${orderNumber} Confirmed`,
    },
    subject: {
      fr: (orderNumber: string) => `Confirmation de commande #${orderNumber}`,
      en: (orderNumber: string) => `Order Confirmation #${orderNumber}`,
    },
    greeting: {
      fr: (name: string) => `Bonjour <strong>${name || 'cher client'}</strong>,`,
      en: (name: string) => `Hello <strong>${name || 'dear customer'}</strong>,`,
    },
    orderReceived: {
      fr: (orderNumber: string, date: string) =>
        `Nous avons bien reçu votre commande <strong>#${orderNumber}</strong> passée le ${date}. Elle est en cours de traitement.`,
      en: (orderNumber: string, date: string) =>
        `We have received your order <strong>#${orderNumber}</strong> placed on ${date}. It is being processed.`,
    },
    yourOrder: {
      fr: 'Votre commande',
      en: 'Your order',
    },
    item: {
      fr: 'article',
      en: 'item',
    },
    items: {
      fr: 'articles',
      en: 'items',
    },
    subtotal: {
      fr: 'Sous-total',
      en: 'Subtotal',
    },
    shipping: {
      fr: 'Livraison',
      en: 'Shipping',
    },
    free: {
      fr: 'Offerte',
      en: 'Free',
    },
    total: {
      fr: 'Total',
      en: 'Total',
    },
    pickupPoint: {
      fr: 'Point Relais',
      en: 'Pickup Point',
    },
    address: {
      fr: 'Adresse',
      en: 'Address',
    },
    viewDetails: {
      fr: 'Pour consulter le détail complet de votre commande (articles, quantités, facture), cliquez sur le bouton ci-dessous.',
      en: 'To view the complete details of your order (items, quantities, invoice), click the button below.',
    },
    trackingEmailNotice: {
      fr: 'Vous recevrez un nouvel email avec le numéro de suivi dès que votre colis sera expédié.',
      en: 'You will receive another email with the tracking number once your package is shipped.',
    },
    ctaTrackOrder: {
      fr: 'Suivre ma commande',
      en: 'Track my order',
    },
    ctaViewOrder: {
      fr: 'Voir ma commande',
      en: 'View my order',
    },
    createAccountTitle: {
      fr: 'Créez votre espace chercheur',
      en: 'Create your researcher account',
    },
    createAccountDesc: {
      fr: 'Suivez vos commandes, accédez à l\'historique de vos lots et recommandez facilement.',
      en: 'Track your orders, access your batch history and reorder easily.',
    },
    createAccountCta: {
      fr: 'Créer mon compte',
      en: 'Create my account',
    },
  },

  // ========== SHIPPING ==========
  shipping: {
    title: {
      fr: 'Votre colis est en route !',
      en: 'Your package is on its way!',
    },
    subject: {
      fr: (orderNumber: string) => `Votre commande #${orderNumber} est en route`,
      en: (orderNumber: string) => `Your order #${orderNumber} is on its way`,
    },
    greeting: {
      fr: (name: string) => `Bonjour <strong>${name || 'cher client'}</strong>,`,
      en: (name: string) => `Hello <strong>${name || 'dear customer'}</strong>,`,
    },
    shipped: {
      fr: (orderNumber: string) =>
        `Excellente nouvelle ! Votre commande <strong>#${orderNumber}</strong> vient d'être expédiée.`,
      en: (orderNumber: string) =>
        `Great news! Your order <strong>#${orderNumber}</strong> has just been shipped.`,
    },
    packageContents: {
      fr: 'Contenu du colis',
      en: 'Package contents',
    },
    trackingInfo: {
      fr: 'Informations de suivi',
      en: 'Tracking information',
    },
    carrier: {
      fr: 'Transporteur',
      en: 'Carrier',
    },
    standard: {
      fr: 'Standard',
      en: 'Standard',
    },
    trackingPending: {
      fr: 'Le numéro de suivi sera disponible prochainement.',
      en: 'The tracking number will be available soon.',
    },
    viewOrderDetails: {
      fr: 'Pour voir le détail de votre commande, cliquez sur le bouton ci-dessous.',
      en: 'To view your order details, click the button below.',
    },
    ctaTrackPackage: {
      fr: 'Suivre mon colis',
      en: 'Track my package',
    },
    ctaViewOrder: {
      fr: 'Voir ma commande',
      en: 'View my order',
    },
    storageTipsTitle: {
      fr: 'Conseils de réception',
      en: 'Reception tips',
    },
    storageTip1: {
      fr: 'Réceptionnez rapidement votre colis',
      en: 'Receive your package promptly',
    },
    storageTip2: {
      fr: 'Vérifiez l\'intégrité des scellés',
      en: 'Check the integrity of the seals',
    },
    storageTip3: {
      fr: 'Stockez selon les conditions recommandées sur chaque produit',
      en: 'Store according to the recommended conditions on each product',
    },
  },

  // ========== STATUS UPDATE ==========
  statusUpdate: {
    title: {
      fr: (orderNumber: string) => `Mise à jour – Commande #${orderNumber}`,
      en: (orderNumber: string) => `Update – Order #${orderNumber}`,
    },
    subject: {
      fr: (orderNumber: string) => `Mise à jour – Commande #${orderNumber}`,
      en: (orderNumber: string) => `Update – Order #${orderNumber}`,
    },
    statusChanged: {
      fr: 'Le statut de votre commande a évolué.',
      en: 'Your order status has changed.',
    },
    ctaViewDetails: {
      fr: 'Suivre ma commande',
      en: 'Track my order',
    },
    orderInfo: {
      fr: 'Informations de commande',
      en: 'Order information',
    },
    orderNumber: {
      fr: 'N° de commande',
      en: 'Order number',
    },
    currentStatus: {
      fr: 'Statut actuel',
      en: 'Current status',
    },
    trackingNote: {
      fr: 'Vous pouvez suivre l\'évolution de votre commande à tout moment depuis votre espace client.',
      en: 'You can track your order status at any time from your account.',
    },
    // Labels de statut pour les badges
    statusLabels: {
      pending: { fr: 'En attente', en: 'Pending' },
      confirmed: { fr: 'Confirmée', en: 'Confirmed' },
      paid: { fr: 'Payée', en: 'Paid' },
      processing: { fr: 'En préparation', en: 'Processing' },
      shipped: { fr: 'Expédiée', en: 'Shipped' },
      completed: { fr: 'Livrée', en: 'Delivered' },
      canceled: { fr: 'Annulée', en: 'Canceled' },
      refunded: { fr: 'Remboursée', en: 'Refunded' },
      failed: { fr: 'Erreur', en: 'Failed' },
    },
  },

  // ========== PAYMENT ==========
  payment: {
    title: {
      fr: 'Paiement reçu 💳',
      en: 'Payment Received 💳',
    },
    received: {
      fr: (amount: string) =>
        `Nous confirmons la réception de votre paiement de <strong>${amount} €</strong>.<br/>Votre commande est maintenant validée et partira en préparation.`,
      en: (amount: string) =>
        `We confirm the receipt of your payment of <strong>${amount} €</strong>.<br/>Your order is now validated and will be prepared for shipping.`,
    },
    ctaViewOrder: {
      fr: 'Voir ma commande',
      en: 'View my order',
    },
  },

  // ========== AUTH - SIGNUP ==========
  signup: {
    title: {
      fr: 'Bienvenue chez FP Store',
      en: 'Welcome to FP Store',
    },
    subject: {
      fr: 'Confirmez votre inscription',
      en: 'Confirm your registration',
    },
    greeting: {
      fr: (name: string) => `Bonjour ${name || ''},`,
      en: (name: string) => `Hello ${name || ''},`,
    },
    thanks: {
      fr: 'Merci de votre inscription !',
      en: 'Thank you for signing up!',
    },
    activatePrompt: {
      fr: 'Cliquez ci-dessous pour activer votre compte :',
      en: 'Click below to activate your account:',
    },
    ctaActivate: {
      fr: 'Activer mon compte',
      en: 'Activate my account',
    },
  },

  // ========== AUTH - RECOVERY ==========
  recovery: {
    title: {
      fr: 'Réinitialisation du mot de passe 🔐',
      en: 'Password Reset 🔐',
    },
    subject: {
      fr: 'Réinitialisation du mot de passe',
      en: 'Password Reset',
    },
    requestReceived: {
      fr: 'Nous avons reçu une demande de réinitialisation.',
      en: 'We received a password reset request.',
    },
    ignoreIfNotYou: {
      fr: "Si ce n'est pas vous, ignorez cet email.",
      en: "If this wasn't you, please ignore this email.",
    },
    ctaReset: {
      fr: 'Réinitialiser mon mot de passe',
      en: 'Reset my password',
    },
  },

  // ========== AUTH - EMAIL CHANGE ==========
  emailChange: {
    title: {
      fr: 'Confirmez votre nouvelle adresse email 📫',
      en: 'Confirm your new email address 📫',
    },
    subject: {
      fr: 'Confirmez votre nouvelle adresse email',
      en: 'Confirm your new email address',
    },
    confirmPrompt: {
      fr: 'Cliquez ci-dessous pour confirmer le changement :',
      en: 'Click below to confirm the change:',
    },
    ctaConfirm: {
      fr: 'Confirmer mon email',
      en: 'Confirm my email',
    },
  },

  // ========== ACCOUNT DELETED ==========
  accountDeleted: {
    title: {
      fr: 'Votre compte a été supprimé',
      en: 'Your account has been deleted',
    },
    greeting: {
      fr: 'Bonjour,',
      en: 'Hello,',
    },
    confirmation: {
      fr: (email: string) =>
        `Nous confirmons que votre compte associé à l'adresse <strong>${email}</strong> a bien été supprimé de notre plateforme.`,
      en: (email: string) =>
        `We confirm that your account associated with the address <strong>${email}</strong> has been deleted from our platform.`,
    },
    notYouWarning: {
      fr: "Si cette action n'a pas été effectuée par vous, merci de contacter notre support dans les plus brefs délais.",
      en: 'If this action was not performed by you, please contact our support immediately.',
    },
    ctaContactSupport: {
      fr: 'Contacter le support',
      en: 'Contact support',
    },
  },

  // ========== PENDING PAYMENT ==========
  pendingPayment: {
    title: {
      fr: 'Commande en attente de paiement',
      en: 'Order awaiting payment',
    },
    subject: {
      fr: (orderNumber: string) => `Commande #${orderNumber} – En attente de paiement`,
      en: (orderNumber: string) => `Order #${orderNumber} – Awaiting payment`,
    },
    greeting: {
      fr: (name: string) => `Merci <strong>${name || 'cher client'}</strong>.`,
      en: (name: string) => `Thank you <strong>${name || 'dear customer'}</strong>.`,
    },
    orderRegistered: {
      fr: (orderNumber: string) =>
        `Votre commande <strong>#${orderNumber}</strong> est bien enregistrée et les produits sont réservés pour <strong>24 heures</strong>.`,
      en: (orderNumber: string) =>
        `Your order <strong>#${orderNumber}</strong> has been registered and the products are reserved for <strong>24 hours</strong>.`,
    },
    paymentInstructions: {
      fr: 'Instructions de paiement',
      en: 'Payment instructions',
    },
    bankTransferTitle: {
      fr: 'Virement bancaire',
      en: 'Bank transfer',
    },
    cryptoTitle: {
      fr: 'Paiement en cryptomonnaie',
      en: 'Cryptocurrency payment',
    },
    beneficiary: {
      fr: 'Bénéficiaire',
      en: 'Beneficiary',
    },
    iban: {
      fr: 'IBAN',
      en: 'IBAN',
    },
    bic: {
      fr: 'BIC / SWIFT',
      en: 'BIC / SWIFT',
    },
    reference: {
      fr: 'Référence (obligatoire)',
      en: 'Reference (required)',
    },
    referenceWarning: {
      fr: 'Indiquez impérativement cette référence dans le libellé de votre virement pour permettre le traitement rapide de votre commande.',
      en: 'Please include this reference in your transfer description to ensure quick processing of your order.',
    },
    btcAddress: {
      fr: 'Adresse BTC',
      en: 'BTC Address',
    },
    usdtAddress: {
      fr: 'Adresse USDT (TRC-20)',
      en: 'USDT Address (TRC-20)',
    },
    cryptoWarning: {
      fr: 'Envoyez le montant exact indiqué ci-dessous. Toute différence pourrait retarder le traitement de votre commande.',
      en: 'Send the exact amount indicated below. Any discrepancy may delay the processing of your order.',
    },
    amountToPay: {
      fr: 'Montant à régler',
      en: 'Amount to pay',
    },
    orderSummary: {
      fr: 'Récapitulatif de votre commande',
      en: 'Order summary',
    },
    quantity: {
      fr: 'Quantité',
      en: 'Quantity',
    },
    itemSingular: {
      fr: 'article',
      en: 'item',
    },
    itemPlural: {
      fr: 'articles',
      en: 'items',
    },
    subtotal: {
      fr: 'Sous-total',
      en: 'Subtotal',
    },
    shipping: {
      fr: 'Livraison',
      en: 'Shipping',
    },
    free: {
      fr: 'Offerte',
      en: 'Free',
    },
    total: {
      fr: 'Total',
      en: 'Total',
    },
    expirationNotice: {
      fr: 'Passé ce délai de 24h sans paiement, la réservation sera automatiquement annulée.',
      en: 'After 24 hours without payment, the reservation will be automatically cancelled.',
    },
    ctaViewOrder: {
      fr: 'Voir ma commande',
      en: 'View my order',
    },
  },

  // ========== PAYMENT VALIDATED (processing status) ==========
  paymentValidated: {
    title: {
      fr: 'Paiement validé avec succès',
      en: 'Payment successfully validated',
    },
    subject: {
      fr: (orderNumber: string) => `Paiement Reçu - Commande #${orderNumber} en préparation`,
      en: (orderNumber: string) => `Payment Received - Order #${orderNumber} in preparation`,
    },
    greeting: {
      fr: (name: string) => `Bonjour <strong>${name}</strong>,`,
      en: (name: string) => `Hello <strong>${name}</strong>,`,
    },
    greetingDefault: {
      fr: 'Bonjour,',
      en: 'Hello,',
    },
    confirmationTitle: {
      fr: 'Paiement confirmé',
      en: 'Payment confirmed',
    },
    confirmationMessage: {
      fr: 'Nous vous confirmons la bonne réception de votre règlement. Votre commande est officiellement validée et part en préparation logistique immédiate.',
      en: 'We confirm the receipt of your payment. Your order is officially validated and is now being prepared for immediate shipment.',
    },
    orderDetails: {
      fr: 'Détails de la commande',
      en: 'Order details',
    },
    orderNumber: {
      fr: 'Numéro de commande',
      en: 'Order number',
    },
    paymentMethod: {
      fr: 'Mode de paiement',
      en: 'Payment method',
    },
    paymentMethodLabel: {
      fr: (method: string) => {
        if (method === 'bank_transfer') return 'Virement bancaire'
        if (method === 'crypto') return 'Cryptomonnaie'
        return method
      },
      en: (method: string) => {
        if (method === 'bank_transfer') return 'Bank transfer'
        if (method === 'crypto') return 'Cryptocurrency'
        return method
      },
    },
    amountReceived: {
      fr: 'Montant reçu',
      en: 'Amount received',
    },
    nextStepsTitle: {
      fr: 'Prochaines étapes',
      en: 'Next steps',
    },
    step1: {
      fr: 'Votre commande est maintenant en préparation',
      en: 'Your order is now being prepared',
    },
    step2: {
      fr: 'Vous recevrez un email avec le numéro de suivi dès expédition',
      en: 'You will receive an email with tracking number once shipped',
    },
    step3: {
      fr: 'Livraison estimée sous 2-5 jours ouvrés',
      en: 'Estimated delivery within 2-5 business days',
    },
    ctaLabel: {
      fr: 'Suivre ma commande',
      en: 'Track my order',
    },
  },

  // ========== STATUS MESSAGES ==========
  status: {
    pending: {
      fr: 'Votre commande est en attente de traitement. Notre équipe la prendra en charge dans les plus brefs délais.',
      en: 'Your order is awaiting processing. Our team will handle it as soon as possible.',
    },
    confirmed: {
      fr: 'Votre commande a été confirmée avec succès. Elle sera préparée sous 24 à 48 heures.',
      en: 'Your order has been successfully confirmed. It will be prepared within 24 to 48 hours.',
    },
    paid: {
      fr: 'Nous avons bien reçu votre paiement. Votre commande entre maintenant en phase de préparation.',
      en: 'We have received your payment. Your order is now entering the preparation phase.',
    },
    processing: {
      fr: 'Votre commande est actuellement en cours de préparation par notre équipe.',
      en: 'Your order is currently being prepared by our team.',
    },
    shipped: {
      fr: 'Votre commande a été expédiée. Vous la recevrez sous 2 à 5 jours ouvrés selon votre localisation.',
      en: 'Your order has been shipped. You will receive it within 2 to 5 business days depending on your location.',
    },
    completed: {
      fr: 'Votre commande a été livrée avec succès. Merci pour votre confiance !',
      en: 'Your order has been successfully delivered. Thank you for your trust!',
    },
    canceled: {
      fr: "Votre commande a été annulée. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre service client.",
      en: 'Your order has been canceled. If you believe this is an error, please contact our customer service.',
    },
    refunded: {
      fr: 'Votre commande a été remboursée. Le montant sera crédité sur votre compte sous 5 à 10 jours ouvrés.',
      en: 'Your order has been refunded. The amount will be credited to your account within 5 to 10 business days.',
    },
    failed: {
      fr: "Un problème est survenu avec votre commande. Veuillez contacter notre service client pour plus d'informations.",
      en: 'An issue occurred with your order. Please contact our customer service for more information.',
    },
    defaultUpdate: {
      fr: (status: string) => `Le statut de votre commande a été mis à jour : <b>${status}</b>`,
      en: (status: string) => `Your order status has been updated to: <b>${status}</b>`,
    },
    carrierLabel: {
      fr: 'Transporteur',
      en: 'Carrier',
    },
    trackingLabel: {
      fr: 'Numéro de suivi',
      en: 'Tracking number',
    },
  },
} as const

/**
 * Retourne la locale validée (fallback 'fr' par défaut)
 */
export function getValidLocale(locale?: string): Locale {
  if (locale === 'en') return 'en'
  return 'fr' // Fallback FR (site principalement français)
}

/**
 * Formate une date selon la locale
 */
export function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Retourne "article" ou "articles" / "item" ou "items" selon le nombre
 */
export function pluralizeItem(count: number, locale: Locale): string {
  if (locale === 'fr') {
    return count > 1 ? translations.confirmation.items.fr : translations.confirmation.item.fr
  }
  return count > 1 ? translations.confirmation.items.en : translations.confirmation.item.en
}
