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

  // ========== WELCOME EMAIL ==========
  welcome: {
    title: {
      fr: 'Bienvenue dans votre espace chercheur',
      en: 'Welcome to your researcher space',
    },
    subject: {
      fr: 'Bienvenue chez FP Store – Votre espace est prêt',
      en: 'Welcome to FP Store – Your space is ready',
    },
    greeting: {
      fr: (name: string) => `Bonjour <strong>${name || 'cher chercheur'}</strong>,`,
      en: (name: string) => `Hello <strong>${name || 'dear researcher'}</strong>,`,
    },
    accountActive: {
      fr: 'Votre compte est maintenant actif et prêt à vous accompagner dans vos recherches.',
      en: 'Your account is now active and ready to support your research.',
    },
    welcomeTitle: {
      fr: 'Bienvenue dans la communauté FP Store',
      en: 'Welcome to the FP Store community',
    },
    welcomeSubtitle: {
      fr: 'Votre partenaire de confiance pour la recherche',
      en: 'Your trusted partner for research',
    },
    benefitsTitle: {
      fr: 'Ce que vous pouvez faire avec votre compte :',
      en: 'What you can do with your account:',
    },
    benefit1Title: {
      fr: 'Historique complet',
      en: 'Full history',
    },
    benefit1Desc: {
      fr: 'Commandes et factures accessibles en un clic.',
      en: 'Orders and invoices accessible in one click.',
    },
    benefit2Title: {
      fr: 'Suivi des lots',
      en: 'Batch tracking',
    },
    benefit2Desc: {
      fr: 'Conservez vos numeros de lot pour la reproductibilite.',
      en: 'Keep your batch numbers for reproducibility.',
    },
    benefit3Title: {
      fr: 'Recommande rapide',
      en: 'Quick reorder',
    },
    benefit3Desc: {
      fr: 'Renouvelez vos produits en un clic.',
      en: 'Renew your products with one click.',
    },
    benefit4Title: {
      fr: 'Support prioritaire',
      en: 'Priority support',
    },
    benefit4Desc: {
      fr: 'Accédez à notre équipe technique pour toute question sur vos commandes.',
      en: 'Access our technical team for any questions about your orders.',
    },
    quickLinksTitle: {
      fr: 'Accès rapides',
      en: 'Quick links',
    },
    linkCatalogue: {
      fr: 'Explorer le catalogue',
      en: 'Browse the catalogue',
    },
    linkProfile: {
      fr: 'Mon espace personnel',
      en: 'My personal space',
    },
    linkFaq: {
      fr: 'Questions fréquentes',
      en: 'FAQ',
    },
    ruoTitle: {
      fr: 'Recherche uniquement',
      en: 'Research use only',
    },
    ruoMessage: {
      fr: 'Tous nos produits sont destinés exclusivement à la recherche scientifique in vitro. Consultez les fiches produits pour les conditions de stockage.',
      en: 'All our products are intended exclusively for in vitro scientific research. Check product sheets for storage conditions.',
    },
    closing: {
      fr: 'À bientôt sur FP Store !',
      en: 'See you soon on FP Store!',
    },
    ctaLabel: {
      fr: 'Découvrir le catalogue',
      en: 'Explore the catalogue',
    },
  },

  // ========== NEWSLETTER CONFIRMATION ==========
  newsletterConfirmation: {
    title: {
      fr: 'Confirmez votre inscription',
      en: 'Confirm your subscription',
    },
    subject: {
      fr: 'Confirmez votre inscription et recevez -10%',
      en: 'Confirm your subscription and get 10% off',
    },
    greeting: {
      fr: (name: string) => `Bonjour <strong>${name}</strong>,`,
      en: (name: string) => `Hello <strong>${name}</strong>,`,
    },
    greetingDefault: {
      fr: 'Bonjour,',
      en: 'Hello,',
    },
    thankYou: {
      fr: 'Merci de votre inscription à notre newsletter ! Pour finaliser votre abonnement et recevoir votre code promo, veuillez confirmer votre adresse email.',
      en: 'Thank you for subscribing to our newsletter! To complete your subscription and receive your promo code, please confirm your email address.',
    },
    yourPromoCode: {
      fr: 'Votre code promo exclusif',
      en: 'Your exclusive promo code',
    },
    promoDescription: {
      fr: '-10% sur votre première commande',
      en: '10% off your first order',
    },
    confirmPrompt: {
      fr: 'Cliquez sur le bouton ci-dessous pour activer votre abonnement :',
      en: 'Click the button below to activate your subscription:',
    },
    ctaConfirm: {
      fr: 'Confirmer mon inscription',
      en: 'Confirm my subscription',
    },
    whatYouGet: {
      fr: 'Ce que vous recevrez :',
      en: 'What you will receive:',
    },
    benefit1: {
      fr: 'Offres exclusives réservées aux abonnés',
      en: 'Exclusive offers for subscribers only',
    },
    benefit2: {
      fr: 'Actualités et études scientifiques',
      en: 'Scientific news and studies',
    },
    benefit3: {
      fr: 'Nouveaux produits en avant-première',
      en: 'Early access to new products',
    },
    benefit4: {
      fr: 'Désinscription en 1 clic à tout moment',
      en: 'Unsubscribe in 1 click anytime',
    },
    ignoreIfNotYou: {
      fr: "Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement cet email.",
      en: "If you didn't sign up for this, simply ignore this email.",
    },
    // Page de confirmation
    confirmationSuccess: {
      fr: 'Inscription confirmée !',
      en: 'Subscription confirmed!',
    },
    confirmationSuccessMessage: {
      fr: 'Votre abonnement à la newsletter est maintenant actif. Utilisez le code ci-dessous pour bénéficier de -10% sur votre première commande.',
      en: 'Your newsletter subscription is now active. Use the code below to get 10% off your first order.',
    },
    confirmationError: {
      fr: 'Lien invalide ou expiré',
      en: 'Invalid or expired link',
    },
    confirmationErrorMessage: {
      fr: 'Ce lien de confirmation est invalide ou a déjà été utilisé. Si vous pensez qu\'il s\'agit d\'une erreur, veuillez vous réinscrire.',
      en: 'This confirmation link is invalid or has already been used. If you think this is an error, please subscribe again.',
    },
  },

  // ========== NEWSLETTER UNSUBSCRIBE ==========
  newsletterUnsubscribe: {
    title: {
      fr: 'Désinscription de la newsletter',
      en: 'Newsletter unsubscription',
    },
    confirmTitle: {
      fr: 'Vous souhaitez vous désinscrire ?',
      en: 'Do you want to unsubscribe?',
    },
    confirmMessage: {
      fr: 'Vous ne recevrez plus nos emails concernant les offres exclusives, les nouveaux produits et les actualités scientifiques.',
      en: 'You will no longer receive our emails about exclusive offers, new products and scientific news.',
    },
    reasonLabel: {
      fr: 'Raison (optionnel) :',
      en: 'Reason (optional):',
    },
    reasonPlaceholder: {
      fr: 'Dites-nous pourquoi vous partez...',
      en: 'Tell us why you are leaving...',
    },
    ctaUnsubscribe: {
      fr: 'Confirmer la désinscription',
      en: 'Confirm unsubscription',
    },
    successTitle: {
      fr: 'Désinscription confirmée',
      en: 'Unsubscription confirmed',
    },
    successMessage: {
      fr: 'Vous avez été désinscrit avec succès. Vous ne recevrez plus d\'emails de notre part.',
      en: 'You have been successfully unsubscribed. You will no longer receive emails from us.',
    },
    resubscribePrompt: {
      fr: 'Vous avez changé d\'avis ?',
      en: 'Changed your mind?',
    },
    ctaResubscribe: {
      fr: 'Se réinscrire',
      en: 'Resubscribe',
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

  // ========== NURTURING SEQUENCE (Email Éducatif) ==========
  nurturing: {
    // Labels communs
    seriesLabel: {
      fr: 'Série Éducative',
      en: 'Educational Series',
    },
    keyPointsTitle: {
      fr: 'Ce que vous apprendrez :',
      en: 'What you will learn:',
    },
    optoutText: {
      fr: 'Vous ne souhaitez plus recevoir ces emails éducatifs ?',
      en: 'You no longer want to receive these educational emails?',
    },
    optoutLink: {
      fr: 'Se désinscrire de la série',
      en: 'Unsubscribe from series',
    },

    // Step 1: Comment lire un rapport HPLC (J+2)
    step1: {
      subject: {
        fr: 'Comment lire un rapport HPLC ?',
        en: 'How to read an HPLC report?',
      },
      title: {
        fr: 'Comment lire un rapport HPLC ?',
        en: 'How to read an HPLC report?',
      },
      subtitle: {
        fr: 'La science de la transparence',
        en: 'The science of transparency',
      },
      intro: {
        fr: 'Un certificat d\'analyse HPLC est votre meilleure garantie de pureté. Savoir le lire vous permet de vérifier la qualité de chaque lot que vous recevez.',
        en: 'An HPLC analysis certificate is your best guarantee of purity. Knowing how to read it allows you to verify the quality of each batch you receive.',
      },
      point1: {
        fr: 'Comprendre le % de pureté et ce qu\'il signifie réellement',
        en: 'Understanding the % purity and what it really means',
      },
      point2: {
        fr: 'Identifier les pics du chromatogramme',
        en: 'Identifying chromatogram peaks',
      },
      point3: {
        fr: 'Vérifier les impuretés et leur nature',
        en: 'Checking impurities and their nature',
      },
      point4: {
        fr: 'Nos standards qualité (≥98% pureté)',
        en: 'Our quality standards (≥98% purity)',
      },
      ctaLabel: {
        fr: 'Lire le guide complet',
        en: 'Read the full guide',
      },
    },

    // Step 2: Eau stérile vs Bactériostatique (J+5)
    step2: {
      subject: {
        fr: 'Erreur classique : Eau stérile vs Bactériostatique',
        en: 'Common mistake: Sterile Water vs Bacteriostatic',
      },
      title: {
        fr: 'Eau stérile vs Bactériostatique',
        en: 'Sterile Water vs Bacteriostatic',
      },
      subtitle: {
        fr: 'L\'expertise technique',
        en: 'Technical expertise',
      },
      intro: {
        fr: 'Le choix du solvant de reconstitution est crucial. Une erreur peut compromettre la stabilité de vos peptides en quelques heures. Voici ce que vous devez savoir.',
        en: 'The choice of reconstitution solvent is crucial. A mistake can compromise your peptides\' stability within hours. Here\'s what you need to know.',
      },
      point1: {
        fr: 'Pourquoi l\'eau bactériostatique prolonge la conservation',
        en: 'Why bacteriostatic water extends shelf life',
      },
      point2: {
        fr: 'Quand utiliser l\'eau stérile (et quand l\'éviter)',
        en: 'When to use sterile water (and when to avoid it)',
      },
      point3: {
        fr: 'Les erreurs de reconstitution qui détruisent les peptides',
        en: 'Reconstitution mistakes that destroy peptides',
      },
      point4: {
        fr: 'Notre protocole de reconstitution recommandé',
        en: 'Our recommended reconstitution protocol',
      },
      ctaLabel: {
        fr: 'Voir le guide de reconstitution',
        en: 'See the reconstitution guide',
      },
    },

    // Step 3: Notre garantie livraison (J+9)
    step3: {
      subject: {
        fr: 'Notre garantie livraison',
        en: 'Our shipping guarantee',
      },
      title: {
        fr: 'Livraison sécurisée et garantie',
        en: 'Secure and guaranteed delivery',
      },
      subtitle: {
        fr: 'Zéro risque pour vous',
        en: 'Zero risk for you',
      },
      intro: {
        fr: 'Nous comprenons vos préoccupations concernant la livraison. C\'est pourquoi nous avons mis en place des garanties solides pour votre tranquillité d\'esprit.',
        en: 'We understand your concerns about delivery. That\'s why we\'ve implemented solid guarantees for your peace of mind.',
      },
      point1: {
        fr: 'Renvoi gratuit en cas de perte ou saisie',
        en: 'Free reshipment in case of loss or seizure',
      },
      point2: {
        fr: 'Emballage discret et sécurisé',
        en: 'Discreet and secure packaging',
      },
      point3: {
        fr: 'Suivi de colis en temps réel',
        en: 'Real-time package tracking',
      },
      point4: {
        fr: 'Support réactif en cas de problème',
        en: 'Responsive support if issues arise',
      },
      ctaLabel: {
        fr: 'Découvrir nos garanties',
        en: 'Discover our guarantees',
      },
    },
  },

  // ========== REVIEW REQUEST ==========
  reviewRequest: {
    title: {
      fr: 'Votre avis compte',
      en: 'Your feedback matters',
    },
    subject: {
      fr: (orderNumber: string) => `Votre avis sur votre commande #${orderNumber}`,
      en: (orderNumber: string) => `Share your feedback on order #${orderNumber}`,
    },
    greeting: {
      fr: (name: string) => `Bonjour <strong>${name || 'cher client'}</strong>,`,
      en: (name: string) => `Hello <strong>${name || 'dear customer'}</strong>,`,
    },
    intro: {
      fr: (orderNumber: string) =>
        `Nous espérons que vous êtes satisfait(e) de votre commande <strong>#${orderNumber}</strong>. Votre retour d'expérience nous aide à nous améliorer !`,
      en: (orderNumber: string) =>
        `We hope you're satisfied with your order <strong>#${orderNumber}</strong>. Your feedback helps us improve!`,
    },
    encouragement: {
      fr: 'Partagez votre expérience en quelques clics',
      en: 'Share your experience in just a few clicks',
    },
    whyReviewTitle: {
      fr: 'Pourquoi donner votre avis ?',
      en: 'Why share your feedback?',
    },
    whyReviewPoint1: {
      fr: 'Aidez d\'autres chercheurs à faire le bon choix',
      en: 'Help other researchers make the right choice',
    },
    whyReviewPoint2: {
      fr: 'Contribuez à l\'amélioration de nos produits',
      en: 'Contribute to improving our products',
    },
    whyReviewPoint3: {
      fr: 'Faites partie de notre communauté scientifique',
      en: 'Be part of our scientific community',
    },
    simpleNote: {
      fr: 'Cela ne prend que 30 secondes !',
      en: 'It only takes 30 seconds!',
    },
    ctaLabel: {
      fr: 'Donner mon avis',
      en: 'Leave a review',
    },
  },

  // ========== CART REMINDER (rappel doux 2h) ==========
  cartReminder: {
    subject: {
      fr: 'Vos recherches vous attendent...',
      en: 'Your research is waiting...',
    },
    title: {
      fr: 'Vos recherches vous attendent',
      en: 'Your research is waiting',
    },
    greeting: {
      fr: (name: string | null) => (name ? `Bonjour <strong>${name}</strong>,` : 'Bonjour,'),
      en: (name: string | null) => (name ? `Hello <strong>${name}</strong>,` : 'Hello,'),
    },
    cartNotice: {
      fr: (count: number, total: string) =>
        `Nous avons remarqué que vous avez laissé <strong>${count} article${count > 1 ? 's' : ''}</strong> dans votre panier pour un total de <strong>${total} EUR</strong>.`,
      en: (count: number, total: string) =>
        `We noticed you left <strong>${count} item${count > 1 ? 's' : ''}</strong> in your cart for a total of <strong>${total} EUR</strong>.`,
    },
    waitingText: {
      fr: 'Vos recherches sont en attente et nous voulons nous assurer que tout se passe bien de votre côté.',
      en: 'Your research is waiting and we want to make sure everything is going well on your end.',
    },
    helpTitle: {
      fr: "Besoin d'aide ?",
      en: 'Need help?',
    },
    helpItems: {
      fr: [
        'Un problème technique lors du paiement crypto ?',
        'Des questions sur un produit ?',
        'Besoin de conseils sur le dosage ou le stockage ?',
      ],
      en: [
        'Technical issue with crypto payment?',
        'Questions about a product?',
        'Need advice on dosage or storage?',
      ],
    },
    supportText: {
      fr: "Notre équipe est là pour vous accompagner. N'hésitez pas à nous contacter si vous avez la moindre question.",
      en: "Our team is here to help. Don't hesitate to contact us if you have any questions.",
    },
    ctaLabel: {
      fr: 'Reprendre mon panier',
      en: 'Continue shopping',
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
