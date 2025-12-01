/**
 * English - International
 */
export default {
  // ============================================
  // COMMON / SHARED
  // ============================================
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    all: 'All',
    none: 'None',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    and: 'and',
    seeMore: 'See more',
    seeLess: 'See less',
    learnMore: 'Learn more',
    viewAll: 'View all',
    showMore: 'Show more',
    showLess: 'Show less',
    comingSoon: 'Coming soon',
  },

  // ============================================
  // NAVIGATION
  // ============================================
  nav: {
    home: 'Home',
    catalogue: 'Catalogue',
    news: 'News',
    faq: 'FAQ',
    contact: 'Contact',
    cart: 'Cart',
    profile: 'Profile',
    orders: 'My Orders',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Sign Up',
    admin: 'Admin',
    guest: 'Guest',
  },

  // ============================================
  // AUTHENTICATION
  // ============================================
  auth: {
    login: {
      title: 'Sign In',
      welcome: 'Welcome back',
      subtitle: 'Sign in to access your space and continue your research.',
      email: 'Professional email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      submit: 'Sign In',
      noAccount: "Don't have an account?",
      createAccount: 'Create account',
      orContinueWith: 'Or continue with',
      google: 'Google',
    },
    register: {
      title: 'Create Account',
      subtitle: 'Join Fast Peptides to access our complete catalog and tools.',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Professional email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      acceptTerms: 'I accept the',
      terms: 'terms and conditions',
      submit: 'Sign Up',
      alreadyAccount: 'Already have an account?',
      login: 'Sign In',
    },
    reset: {
      title: 'Forgot Password?',
      subtitle: 'Enter your email address and we will send you a reset link.',
      email: 'Email',
      submit: 'Send reset link',
      backToLogin: 'Back to login',
      success: 'If an account exists with this email, you will receive a link shortly.',
    },
    callback: {
      loading: 'Secure login',
      verifying: 'Fast Peptides is verifying your access...',
      success: 'Login successful!',
      welcome: 'Welcome',
      invalidLink: 'Invalid link',
      linkExpired: 'This link has expired.',
      invalidValidation: 'Invalid validation link.',
      noSession: 'No session found. Please log in again.',
    },
    errors: {
      invalidEmail: 'Invalid email address',
      invalidPassword: 'Invalid password',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordMismatch: 'Passwords do not match',
      userNotFound: 'User not found',
      wrongPassword: 'Wrong password',
      emailAlreadyUsed: 'This email is already in use',
      weakPassword: 'Password must be at least 8 characters',
      generic: 'An error occurred. Please try again.',
      captchaRequired: 'Please validate the security check.',
      invalidCredentials: 'Invalid email or password.',
      registrationFailed: 'An error occurred during registration.',
      resetFailed: 'Unable to send email. Please try again later.',
    },
  },

  // ============================================
  // CATALOGUE
  // ============================================
  catalogue: {
    title: 'Catalogue',
    subtitle: 'Discover our selection of research peptides',
    searchPlaceholder: 'Search peptides...',
    filters: {
      title: 'Filters',
      categories: 'Categories',
      tags: 'Tags',
      price: 'Price',
      inStock: 'In stock only',
      resetAll: 'Reset all',
    },
    sort: {
      label: 'Sort by',
      newest: 'Newest',
      priceAsc: 'Price: Low to High',
      priceDesc: 'Price: High to Low',
      nameAsc: 'Name A-Z',
      nameDesc: 'Name Z-A',
      popular: 'Popularity',
    },
    product: {
      addToCart: 'Add to cart',
      outOfStock: 'Out of stock',
      inStock: 'In stock',
      lowStock: 'Low stock',
      viewDetails: 'View details',
      quantity: 'Quantity',
      purity: 'Purity',
      format: 'Format',
    },
    results: {
      showing: 'Showing',
      of: 'of',
      products: 'products',
      noResults: 'No products found',
      noResultsText: 'Try adjusting your filters or search terms',
    },
    categories: {
      recovery: 'Recovery',
      weightLoss: 'Weight Loss',
      growth: 'Growth',
      antiAging: 'Anti-aging',
      performance: 'Performance',
      wellness: 'Wellness',
      hormonal: 'Hormonal',
      nootropic: 'Nootropic',
      cosmetic: 'Cosmetic',
      health: 'Health',
    },
  },

  // ============================================
  // PRODUCT DETAILS
  // ============================================
  product: {
    description: 'Description',
    specifications: 'Specifications',
    storage: 'Storage',
    research: 'Research Applications',
    coa: 'Certificate of Analysis',
    downloadCoa: 'Download CoA',
    relatedProducts: 'Related Products',
    reviews: 'Reviews',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    selectQuantity: 'Select quantity',
    selectFormat: 'Select format',
    trustBadges: {
      quality: 'Certified Quality',
      shipping: 'Fast Shipping',
      support: 'Expert Support',
      secure: 'Secure Payment',
    },
  },

  // ============================================
  // CART
  // ============================================
  cart: {
    title: 'Cart',
    empty: 'Your cart is empty',
    emptyText: 'Browse our catalogue and add products',
    continueShopping: 'Continue Shopping',
    item: 'Item',
    items: 'Items',
    quantity: 'Quantity',
    price: 'Price',
    total: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    freeShipping: 'Free',
    discount: 'Discount',
    tax: 'Tax',
    grandTotal: 'Grand Total',
    checkout: 'Checkout',
    remove: 'Remove',
    update: 'Update',
    promoCode: 'Promo code',
    apply: 'Apply',
    promoApplied: 'Promo code applied',
    promoError: 'Invalid promo code',
  },

  // ============================================
  // CHECKOUT
  // ============================================
  checkout: {
    title: 'Checkout',
    steps: {
      cart: 'Cart',
      shipping: 'Shipping',
      payment: 'Payment',
      confirmation: 'Confirmation',
    },
    shipping: {
      title: 'Shipping Address',
      firstName: 'First Name',
      lastName: 'Last Name',
      company: 'Company (optional)',
      address: 'Address',
      addressLine2: 'Apartment, suite, etc. (optional)',
      city: 'City',
      postalCode: 'Postal Code',
      country: 'Country',
      phone: 'Phone',
      saveAddress: 'Save this address',
      shippingMethod: 'Shipping Method',
      standard: 'Standard',
      express: 'Express',
      relay: 'Pickup Point',
    },
    payment: {
      title: 'Payment',
      method: 'Payment Method',
      card: 'Credit Card',
      cardNumber: 'Card Number',
      expiry: 'Expiry Date',
      cvv: 'CVV',
      billingAddress: 'Billing Address',
      sameAsShipping: 'Same as shipping address',
      securePayment: '100% Secure Payment',
    },
    summary: {
      title: 'Order Summary',
      orderTotal: 'Order Total',
    },
    placeOrder: 'Place Order',
    processing: 'Processing...',
    success: {
      title: 'Payment Confirmed!',
      error: 'Error',
      finalizing: 'Finalizing',
      orderRegistered: 'Your order has been registered',
      verificationRequired: 'Verification required',
      secure: 'Secure',
      fast: 'Fast',
      shop: 'Shop',
      createAccount: 'Create my account',
      trackOrders: 'Track your orders easily',
      email: 'Email',
      password: 'Password',
      minChars: 'Min. 6 characters',
      activate: 'Activate',
      track: 'Track',
      history: 'History',
      realTimeTracking: 'Real-time tracking',
      exclusiveOffers: 'Exclusive offers',
      orderSaved: 'Order saved',
      findInSpace: 'Find it in your space',
      viewOrder: 'View my order',
      problemOccurred: 'A problem occurred. Our team has been notified.',
      newMember: 'New Member',
      confirmationEmailSent: '📧 A confirmation email has been sent to you!',
      linkOrderError: 'Unable to link the order. Please contact support.',
      conversionError: 'Error during conversion',
      trackingTokenNotFound: 'Tracking token not found',
      accountCreationError: 'Error creating account',
      confirmationProblem: 'Problem during confirmation.',
    },
    cancel: {
      title: 'Payment Cancelled',
      subtitle: 'The payment could not be completed or was interrupted.',
      retryAnytime: 'You can try again at any time.',
      backToCart: 'Back to cart',
    },
    wrapper: {
      securePayment: 'Secure payment verified by Stripe 🔒',
    },
  },

  // ============================================
  // ORDERS
  // ============================================
  orders: {
    title: 'My Orders',
    empty: 'No orders',
    emptyText: "You haven't placed any orders yet",
    orderNumber: 'Order #',
    date: 'Date',
    status: 'Status',
    total: 'Total',
    details: 'Details',
    track: 'Track',
    invoice: 'Invoice',
    reorder: 'Reorder',
    statuses: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
    },
  },

  // ============================================
  // TRACKING
  // ============================================
  tracking: {
    title: 'Order Tracking',
    subtitle: 'Track your order in real time',
    searchPlaceholder: 'Order number or email',
    search: 'Search',
    orderFound: 'Order found',
    orderNotFound: 'Order not found',
    orderNotFoundText: 'Check the order number and try again',
    timeline: {
      ordered: 'Order placed',
      confirmed: 'Order confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      inTransit: 'In transit',
      delivered: 'Delivered',
    },
    carrier: 'Carrier',
    trackingNumber: 'Tracking number',
    estimatedDelivery: 'Estimated delivery',
  },

  // ============================================
  // PROFILE
  // ============================================
  profile: {
    title: 'My Profile',
    personalInfo: 'Personal Information',
    email: 'Email',
    emailNotSet: 'email not set',
    phone: 'Phone',
    phonePlaceholder: '+1 555 ...',
    fullName: 'Full Name',
    fullNamePlaceholder: 'First and Last Name',
    addresses: 'Addresses',
    addAddress: 'Add address',
    defaultAddress: 'Default Shipping Address',
    addressLabel: 'Address (Street & Number)',
    addressPlaceholder: '123 Peptide Street',
    postalCode: 'Postal Code',
    city: 'City',
    country: 'Country',
    security: 'Security & Account Management',
    changePassword: 'Change password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmNewPassword: 'Confirm password',
    updatePassword: 'Update password',
    preferences: 'Preferences & Settings',
    language: 'Language',
    currency: 'Currency',
    notifications: 'Notifications',
    newsletter: 'Receive newsletters and promotions',
    deleteAccount: 'Delete account',
    deleteAccountWarning: 'This action cannot be undone',
    saveChanges: 'Save changes',
    savePreferences: 'Save preferences',
    recentOrders: 'Recent Orders',
    viewAllOrders: 'View all orders',
    noOrders: "You haven't placed any orders yet.",
    startShopping: 'Start shopping!',
    orderNumber: 'Order #',
    orderTotal: 'Total:',
    orderDate: 'Placed on',
    appearance: 'Appearance',
    theme: 'Interface Theme',
    themeDesc: 'Select your preferred color scheme.',
    support: 'Help & Support',
    supportDesc: 'Have a question about an order or product? Contact our support team for immediate assistance.',
    openMessaging: 'Open messaging',
  },

  // ============================================
  // FAQ
  // ============================================
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find quick answers to your questions',
    searchPlaceholder: 'Search questions...',
    categories: {
      all: 'All categories',
      products: 'Products & Quality',
      storage: 'Storage & Handling',
      orders: 'Orders & Payment',
      shipping: 'Shipping & Tracking',
      compliance: 'Compliance & Safety',
      returns: 'Returns & Support',
    },
    noResults: 'No results found',
    noResultsText: 'Try different search terms or browse categories',
    reset: 'Reset',
    needHelp: 'Need help?',
    contactSupport: 'Contact support',
    responseTime: 'Response within 24h',
  },

  // ============================================
  // RECONSTITUTION
  // ============================================
  reconstitution: {
    title: 'Reconstitution Guide',
    subtitle: 'Calculator and protocol for research',
    calculator: {
      title: 'Dosage Calculator',
      subtitle: 'Enter your parameters to get the exact volume',
      vialAmount: 'Peptide Amount (Vial)',
      waterAmount: 'Bacteriostatic Water Added',
      desiredDose: 'Desired Research Dose',
      presets: 'Quick presets',
      result: 'Volume to draw',
      concentration: 'Concentration',
      dosesAvailable: 'Doses available',
    },
    protocol: {
      title: 'Reconstitution Protocol',
      subtitle: 'Follow these steps for optimal preparation',
      step1: {
        title: 'Preparation',
        desc: 'Disinfect the peptide vial stopper and the bacteriostatic water stopper with a 70% isopropyl alcohol pad.',
      },
      step2: {
        title: 'Draw Water',
        desc: 'Using a sterile syringe, draw the desired amount of bacteriostatic water. Avoid air bubbles.',
      },
      step3: {
        title: 'Gentle Injection',
        desc: 'Inject the water slowly against the inner wall of the peptide vial to avoid damaging the lyophilized powder.',
      },
      step4: {
        title: 'Dissolution',
        desc: 'Never shake! Gently roll the vial between your hands until complete dissolution.',
      },
    },
    storage: {
      title: 'Storage after reconstitution',
      text: 'Once mixed, the peptide must be stored in the refrigerator (2-8°C). Away from light. Average shelf life: 4 to 8 weeks.',
    },
    warning: {
      title: 'Research Use Only',
      text: 'This information is provided for educational purposes for laboratory handling. Never use on humans or animals.',
    },
  },

  // ============================================
  // NEWS / ACTUALITES
  // ============================================
  news: {
    title: 'News',
    subtitle: 'Latest advances in peptide research',
    featured: 'Featured',
    latest: 'Recent Articles',
    categories: 'Categories',
    readMore: 'Read article',
    readTime: 'min read',
    share: 'Share',
    relatedArticles: 'Related Articles',
    backToNews: 'Back to news',
    publishedOn: 'Published on',
    author: 'By',
  },

  // ============================================
  // FOOTER
  // ============================================
  footer: {
    description: 'High-quality research peptides for laboratories and research institutes.',
    quickLinks: 'Navigation',
    legal: 'Information',
    terms: 'Terms and Conditions',
    privacy: 'Privacy',
    cookies: 'Cookies',
    refunds: 'Refund Policy',
    contact: 'Contact',
    support: 'Support',
    researchOnly: 'Research Use Only',
    copyright: '© {year} Fast-Peptides. All rights reserved.',
    legalNotice: 'Legal Notice',
    hours: 'Mon - Fri: 9am - 6pm',
    region: 'France & Europe',
    securePayments: 'Secure Payments',
    sslSecure: 'SSL Secure',
    disclaimer: {
      research: 'Research only',
      researchDesc: 'Products intended for scientific research',
      noHuman: 'No human use',
      noHumanDesc: 'Not intended for therapeutic use',
      responsibility: 'Responsibility',
      responsibilityDesc: 'Buyer complies with local regulations',
    },
    newsletter: {
      title: 'Newsletter',
      subtitle: 'News & exclusive offers',
      placeholder: 'your@email.com',
      subscribe: 'Subscribe',
      success: 'Subscription successful!',
    },
  },

  // ============================================
  // ADMIN
  // ============================================
  admin: {
    stats: 'Statistics',
    users: 'Users',
    orders: 'Orders',
    products: 'Products',
    news: 'News',
    categories: 'Categories',
    messaging: 'Messaging',
  },

  // ============================================
  // ERRORS & MESSAGES
  // ============================================
  errors: {
    notFound: 'Page Not Found',
    notFoundText: "The page you're looking for doesn't exist",
    serverError: 'Server Error',
    serverErrorText: 'An error occurred. Please try again later.',
    unauthorized: 'Unauthorized',
    unauthorizedText: "You don't have permission to access this page",
    sessionExpired: 'Session Expired',
    sessionExpiredText: 'Please log in again',
    networkError: 'Network Error',
    networkErrorText: 'Check your internet connection',
  },

  // ============================================
  // SUCCESS MESSAGES
  // ============================================
  success: {
    saved: 'Changes saved',
    deleted: 'Successfully deleted',
    copied: 'Copied to clipboard',
    addedToCart: 'Added to cart',
    orderPlaced: 'Order confirmed',
    messageSent: 'Message sent',
    subscribed: 'Successfully subscribed',
  },

  // ============================================
  // LANGUAGE
  // ============================================
  language: {
    select: 'Language',
    current: 'English',
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
      title: 'Home – Fast Peptides',
      description: 'The European reference for certified research peptides.',
    },
    auth: {
      login: 'Login',
      register: 'Sign Up',
      reset: 'Forgot Password',
      emailSent: 'Email Sent',
      callback: 'Verifying...',
    },
    profile: {
      title: 'My Profile – Fast Peptides',
      description: 'Manage your personal information, preferences and account security.',
    },
    orders: {
      title: 'My Orders – Fast Peptides',
      description: 'View all your previous orders on Fast Peptides.',
    },
    orderDetail: {
      title: 'Order Details – Fast Peptides',
    },
    updatePassword: {
      title: 'New Password – Fast Peptides',
      description: 'Choose a new password to access your Fast Peptides account.',
    },
    updatePasswordSuccess: {
      title: 'Password Updated – Fast Peptides',
      description: 'Your password has been successfully changed.',
    },
    accessDenied: {
      title: 'Access Denied – Fast Peptides',
    },
    catalogue: {
      title: 'Catalogue – Fast Peptides',
      heading: 'Our Catalogue',
      description: 'Discover our full range of peptides & products available for research.',
    },
    product: {
      title: 'Product – Fast Peptides',
    },
    news: {
      title: 'News – Fast Peptides',
      heading: 'Stay informed on peptide research',
      description: 'Discover our latest articles, studies and news about research peptides',
      badge: 'Blog & News',
    },
    newsDetail: {
      description: 'Discover the details of this news article on Fast Peptides.',
    },
    cart: {
      title: 'My Cart – Fast Peptides',
      description: 'Review your items, adjust quantities and complete your order.',
      badge: 'Your Selection',
    },
    paymentSuccess: {
      title: 'Payment Successful 🎉',
    },
    paymentCancel: {
      title: 'Payment Cancelled',
    },
    tracking: {
      title: 'Track My Order – Fast Peptides',
      heading: 'Track Your Delivery',
      description: 'Check the progress of your package in real time',
      badge: 'Order Tracking',
    },
    admin: {
      title: 'Admin Dashboard – Fast Peptides',
      heading: 'Admin Dashboard',
      description: 'Manage products, users, orders, statistics and news for the Fast Peptides website.',
    },
    faq: {
      title: 'FAQ – Fast Peptides',
      description: 'Find quick answers to your questions about our products and services',
      badge: 'Help Center',
    },
    cgu: {
      title: 'Terms & Conditions – Fast Peptides',
      heading: 'Terms & Conditions',
      description: 'View our current terms and conditions of use.',
    },
    reconstitution: {
      title: 'Dosage Calculator & Reconstitution – Fast Peptides',
      heading: 'Reconstitution Calculator',
      description: 'Calculate precisely the volume to draw for your research protocols',
      badge: 'Lab Tool',
    },
  },
} as const
