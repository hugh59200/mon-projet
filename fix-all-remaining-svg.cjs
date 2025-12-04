const fs = require('fs');
const path = require('path');

const files = [
  'src/features/interface/layout/footer/FooterApp.vue',
  'src/features/actualités/ActualiteDetailView.vue',
  'src/features/actualités/ActualitesView.vue',
  'src/features/livraison/mondial-relay/RelaySelector.vue',
  'src/features/checkout/paiement/PaymentSuccessView.vue',
  'src/features/reconstitution/ReconstitutionView.vue',
  'src/features/auth/AuthLayout.vue',
  'src/features/catalogue/ProductDetails.vue',
  'src/features/home/shared/BaseButton.vue',
];

// Patterns de remplacement plus flexibles
const patterns = [
  // ArrowLeft
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M19 12H5M12 19l-7-7 7-7"[^>]*\/>\s*<\/svg>/gs, 'ArrowLeft'],
  [/<svg[^>]*>\s*<path[^>]*d="M19 12H5M12 19l-7-7 7-7"[^>]*\/>\s*<\/svg>/gs, 'ArrowLeft', 20],

  // ArrowRight
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M5 12h14M12 5l7 7-7 7"[^>]*\/>\s*<\/svg>/gs, 'ArrowRight'],

  // X
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M18 6L6 18M6 6l12 12"[^>]*\/>\s*<\/svg>/gs, 'X'],
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<line[^>]*x1="18"[^>]*y1="6"[^>]*x2="6"[^>]*y2="18"[^>]*\/>\s*<line[^>]*x1="6"[^>]*y1="6"[^>]*x2="18"[^>]*y2="18"[^>]*\/>\s*<\/svg>/gs, 'X'],

  // Check
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<polyline[^>]*points="20 6 9 17 4 12"[^>]*\/>\s*<\/svg>/gs, 'Check'],
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M20 6L9 17l-5-5"[^>]*\/>\s*<\/svg>/gs, 'Check'],

  // CheckCircle2
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M22 11\.08V12a10 10 0 1[^"]*"[^>]*\/>\s*<(?:polyline|path)[^>]*(?:points="22 4 12 14\.01 9 11\.01"|d="M22 4L12 14\.01l-3-3")[^>]*\/>\s*<\/svg>/gs, 'CheckCircle2'],

  // Clock
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<circle[^>]*cx="12"[^>]*cy="12"[^>]*r="10"[^>]*\/>\s*<polyline[^>]*points="12 6 12 12 16 14"[^>]*\/>\s*<\/svg>/gs, 'Clock'],

  // Calendar
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<rect[^>]*x="3"[^>]*y="4"[^>]*width="18"[^>]*height="18"[^>]*rx="2"[^>]*(?:ry="2")?[^>]*\/>\s*<line[^>]*x1="16"[^>]*y1="2"[^>]*x2="16"[^>]*y2="6"[^>]*\/>\s*<line[^>]*x1="8"[^>]*y1="2"[^>]*x2="8"[^>]*y2="6"[^>]*\/>\s*<line[^>]*x1="3"[^>]*y1="10"[^>]*x2="21"[^>]*y2="10"[^>]*\/>\s*<\/svg>/gs, 'Calendar'],

  // User
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"[^>]*\/>\s*<circle[^>]*cx="12"[^>]*cy="7"[^>]*r="4"[^>]*\/>\s*<\/svg>/gs, 'User'],

  // Mail
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<(?:path|rect)[^>]*d="M4 4h16c1\.1 0 2 \.9 2 2v12c0 1\.1-\.9 2-2 2H4c-1\.1 0-2-\.9-2-2V6c0-1\.1\.9-2 2-2z"[^>]*\/>\s*<(?:polyline|path)[^>]*(?:points="22,6 12,13 2,6"|d="M22 6l-10 7L2 6")[^>]*\/>\s*<\/svg>/gs, 'Mail'],

  // MapPin
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"[^>]*\/>\s*<circle[^>]*cx="12"[^>]*cy="10"[^>]*r="3"[^>]*\/>\s*<\/svg>/gs, 'MapPin'],

  // Phone
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M22 16\.92v3a2 2 0 01-2\.18 2[^"]*"[^>]*\/>\s*<\/svg>/gs, 'Phone'],

  // Shield
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"[^>]*\/>\s*<\/svg>/gs, 'Shield'],

  // ShieldCheck
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"[^>]*\/>\s*<path[^>]*d="M9 12l2 2 4-4"[^>]*\/>\s*<\/svg>/gs, 'ShieldCheck'],

  // Truck
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<rect[^>]*x="1"[^>]*y="3"[^>]*width="15"[^>]*height="13"[^>]*rx="2"[^>]*\/>\s*<path[^>]*d="M16 8h4a2 2 0 012 2v9[^"]*"[^>]*\/>\s*<circle[^>]*cx="5\.5"[^>]*cy="18\.5"[^>]*r="2\.5"[^>]*\/>\s*<circle[^>]*cx="18\.5"[^>]*cy="18\.5"[^>]*r="2\.5"[^>]*\/>\s*<\/svg>/gs, 'Truck'],

  // Package
  [/<svg[^>]*width="(\d+)"[^>]*>[\s\S]*?<path[^>]*d="M16\.5 9\.4[^"]*"[\s\S]*?<\/svg>/gs, 'Package'],

  // CreditCard
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<rect[^>]*x="1"[^>]*y="4"[^>]*width="22"[^>]*height="16"[^>]*rx="2"[^>]*(?:ry="2")?[^>]*\/>\s*<(?:line|path)[^>]*(?:x1="1"[^>]*y1="10"|d="M1 10h22")[^>]*\/>\s*<\/svg>/gs, 'CreditCard'],

  // Search
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<circle[^>]*cx="11"[^>]*cy="11"[^>]*r="8"[^>]*\/>\s*<(?:path|line)[^>]*(?:d="M21 21l-4\.35-4\.35"|x1="21")[^>]*\/>\s*<\/svg>/gs, 'Search'],

  // ExternalLink
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"[^>]*\/>\s*<polyline[^>]*points="15 3 21 3 21 9"[^>]*\/>\s*<line[^>]*x1="10"[^>]*y1="14"[^>]*x2="21"[^>]*y2="3"[^>]*\/>\s*<\/svg>/gs, 'ExternalLink'],

  // ChevronDown
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<(?:path|polyline)[^>]*(?:d="M6 9l6 6 6-6"|points="6 9 12 15 18 9")[^>]*\/>\s*<\/svg>/gs, 'ChevronDown'],

  // ChevronUp
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<(?:path|polyline)[^>]*(?:d="M18 15l-6-6-6 6"|points="18 15 12 9 6 15")[^>]*\/>\s*<\/svg>/gs, 'ChevronUp'],

  // ChevronLeft
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<(?:path|polyline)[^>]*(?:d="M15 18l-6-6 6-6"|points="15 18 9 12 15 6")[^>]*\/>\s*<\/svg>/gs, 'ChevronLeft'],

  // ChevronRight
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<(?:path|polyline)[^>]*(?:d="M9 18l6-6-6-6"|points="9 18 15 12 9 6")[^>]*\/>\s*<\/svg>/gs, 'ChevronRight'],

  // Info
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<circle[^>]*cx="12"[^>]*cy="12"[^>]*r="10"[^>]*\/>\s*<line[^>]*x1="12"[^>]*y1="16"[^>]*x2="12"[^>]*y2="12"[^>]*\/>\s*<line[^>]*x1="12"[^>]*y1="8"[^>]*x2="12\.01"[^>]*y2="8"[^>]*\/>\s*<\/svg>/gs, 'Info'],
  [/<svg[^>]*>\s*<path[^>]*d="M13 16h-1v-4h-1m1-4h\.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"[^>]*\/>\s*<\/svg>/gs, 'Info', 20],

  // AlertCircle
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<circle[^>]*cx="12"[^>]*cy="12"[^>]*r="10"[^>]*\/>\s*<line[^>]*x1="12"[^>]*y1="8"[^>]*x2="12"[^>]*y2="12"[^>]*\/>\s*<line[^>]*x1="12"[^>]*y1="16"[^>]*x2="12\.01"[^>]*y2="16"[^>]*\/>\s*<\/svg>/gs, 'AlertCircle'],

  // Plus
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<(?:line|path)[^>]*(?:x1="12"[^>]*y1="5"[^>]*x2="12"[^>]*y2="19"|d="M12 5v14")[^>]*\/>\s*<(?:line|path)[^>]*(?:x1="5"[^>]*y1="12"[^>]*x2="19"[^>]*y2="12"|d="M5 12h14")[^>]*\/>\s*<\/svg>/gs, 'Plus'],

  // Minus
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<(?:line|path)[^>]*(?:x1="5"[^>]*y1="12"[^>]*x2="19"[^>]*y2="12"|d="M5 12h14")[^>]*\/>\s*<\/svg>/gs, 'Minus'],

  // Eye
  [/<svg[^>]*width="(\d+)"[^>]*>[\s\S]*?<path[^>]*d="M1 12s4-8 11-8 11 8 11 8[\s\S]*?<\/svg>/gs, 'Eye'],

  // Facebook
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"[^>]*\/>\s*<\/svg>/gs, 'Facebook'],

  // Twitter
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M23 3a10\.9 10\.9 0 01-3\.14 1\.53[\s\S]*?<\/svg>/gs, 'Twitter'],

  // Instagram
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<rect[^>]*x="2"[^>]*y="2"[^>]*width="20"[^>]*height="20"[^>]*rx="5"[^>]*ry="5"[^>]*\/>\s*<path[^>]*d="M16 11\.37A4 4 0 1112\.63 8[^"]*"[^>]*\/>\s*<line[^>]*x1="17\.5"[^>]*y1="6\.5"[^>]*x2="17\.51"[^>]*y2="6\.5"[^>]*\/>\s*<\/svg>/gs, 'Instagram'],

  // Linkedin
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2[\s\S]*?<\/svg>/gs, 'Linkedin'],

  // Youtube
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M22\.54 6\.42a2\.78 2\.78 0 00-1\.94-2C18\.88 4 12 4 12 4s-6\.88 0-8\.6\.46[\s\S]*?<\/svg>/gs, 'Youtube'],

  // MessageSquare
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"[^>]*\/>\s*<\/svg>/gs, 'MessageSquare'],

  // Tag
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M20\.59 13\.41l-7\.17 7\.17a2 2 0 01-2\.83 0L2 12V2h10l8\.59 8\.59a2 2 0 010 2\.82z"[^>]*\/>\s*<line[^>]*x1="7"[^>]*y1="7"[^>]*x2="7\.01"[^>]*y2="7"[^>]*\/>\s*<\/svg>/gs, 'Tag'],

  // Copy
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<rect[^>]*x="9"[^>]*y="9"[^>]*width="13"[^>]*height="13"[^>]*rx="2"[^>]*\/>\s*<path[^>]*d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"[^>]*\/>\s*<\/svg>/gs, 'Copy'],

  // Lock
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<rect[^>]*x="3"[^>]*y="11"[^>]*width="18"[^>]*height="11"[^>]*rx="2"[^>]*(?:ry="2")?[^>]*\/>\s*<path[^>]*d="M7 11V7a5 5 0 0110 0v4"[^>]*\/>\s*<\/svg>/gs, 'Lock'],

  // Gift
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<polyline[^>]*points="20 12 20 22 4 22 4 12"[^>]*\/>\s*<rect[^>]*x="2"[^>]*y="7"[^>]*width="20"[^>]*height="5"[^>]*\/>\s*<line[^>]*x1="12"[^>]*y1="22"[^>]*x2="12"[^>]*y2="7"[^>]*\/>\s*<path[^>]*d="M12 7H7\.5a2\.5 2\.5 0 010-5C11 2 12 7 12 7z"[^>]*\/>\s*<path[^>]*d="M12 7h4\.5a2\.5 2\.5 0 000-5C13 2 12 7 12 7z"[^>]*\/>\s*<\/svg>/gs, 'Gift'],

  // Zap
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<(?:polygon|path)[^>]*(?:points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"|d="M13 10V3L4 14h7v7l9-11h-7z")[^>]*\/>\s*<\/svg>/gs, 'Zap'],

  // FlaskConical
  [/<svg[^>]*width="(\d+)"[^>]*>[\s\S]*?<path[^>]*d="M(?:19\.428 15\.428|10 2v7\.527)[^"]*"[\s\S]*?<\/svg>/gs, 'FlaskConical'],

  // Star
  [/<svg[^>]*width="(\d+)"[^>]*>[\s\S]*?<(?:polygon|path)[^>]*(?:points|d)="[^"]*12 2[^"]*15\.09 8\.26[\s\S]*?<\/svg>/gs, 'Star'],

  // Heart
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M20\.84 4\.61a5\.5 5\.5 0 00-7\.78 0L12 5\.67l-1\.06-1\.06a5\.5 5\.5 0 00-7\.78 7\.78[\s\S]*?<\/svg>/gs, 'Heart'],

  // Share2
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<circle[^>]*cx="18"[^>]*cy="5"[^>]*r="3"[^>]*\/>\s*<circle[^>]*cx="6"[^>]*cy="12"[^>]*r="3"[^>]*\/>\s*<circle[^>]*cx="18"[^>]*cy="19"[^>]*r="3"[^>]*\/>\s*<line[^>]*x1="8\.59"[^>]*y1="13\.51"[^>]*x2="15\.42"[^>]*y2="17\.49"[^>]*\/>\s*<line[^>]*x1="15\.41"[^>]*y1="6\.51"[^>]*x2="8\.59"[^>]*y2="10\.49"[^>]*\/>\s*<\/svg>/gs, 'Share2'],

  // Bookmark
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"[^>]*\/>\s*<\/svg>/gs, 'Bookmark'],

  // Home
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"[^>]*\/>\s*<polyline[^>]*points="9,22 9,12 15,12 15,22"[^>]*\/>\s*<\/svg>/gs, 'Home'],

  // ShoppingBag
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"[^>]*\/>\s*<\/svg>/gs, 'ShoppingBag'],

  // ShoppingCart
  [/<svg[^>]*width="(\d+)"[^>]*>[\s\S]*?<circle[^>]*cx="[89]"[^>]*cy="21"[\s\S]*?<\/svg>/gs, 'ShoppingCart'],

  // Download
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<path[^>]*d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"[^>]*\/>\s*<polyline[^>]*points="7 10 12 15 17 10"[^>]*\/>\s*<line[^>]*x1="12"[^>]*y1="15"[^>]*x2="12"[^>]*y2="3"[^>]*\/>\s*<\/svg>/gs, 'Download'],

  // RotateCcw
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<(?:polyline|path)[^>]*(?:points="1 4 1 10 7 10"|d="M3 12a9 9 0 109-9[^"]*")[^>]*\/>\s*<path[^>]*d="M3[^"]*"[^>]*\/>\s*<\/svg>/gs, 'RotateCcw'],

  // Globe
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<circle[^>]*cx="12"[^>]*cy="12"[^>]*r="10"[^>]*\/>\s*<line[^>]*x1="2"[^>]*y1="12"[^>]*x2="22"[^>]*y2="12"[^>]*\/>\s*<path[^>]*d="M12 2a15\.3 15\.3 0 014 10[^"]*"[^>]*\/>\s*<\/svg>/gs, 'Globe'],

  // Navigation
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<polygon[^>]*points="3 11 22 2 13 21 11 13 3 11"[^>]*\/>\s*<\/svg>/gs, 'Navigation'],

  // Send
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<line[^>]*x1="22"[^>]*y1="2"[^>]*x2="11"[^>]*y2="13"[^>]*\/>\s*<polygon[^>]*points="22 2 15 22 11 13 2 9 22 2"[^>]*\/>\s*<\/svg>/gs, 'Send'],

  // RefreshCw
  [/<svg[^>]*width="(\d+)"[^>]*>\s*<polyline[^>]*points="23 4 23 10 17 10"[^>]*\/>\s*<polyline[^>]*points="1 20 1 14 7 14"[^>]*\/>\s*<path[^>]*d="M3\.51 9a9 9 0 0114\.85-3\.36L23 10M1 14l4\.64 4\.36A9 9 0 0020\.49 15"[^>]*\/>\s*<\/svg>/gs, 'RefreshCw'],

  // Trash2
  [/<svg[^>]*width="(\d+)"[^>]*>[\s\S]*?<(?:polyline|path)[^>]*(?:points="3 6 5 6 21 6"|d="M3 6h18")[^>]*\/>[\s\S]*?<\/svg>/gs, 'Trash2'],
];

function processFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP: ${filePath} (not found)`);
    return 0;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let count = 0;

  for (const [pattern, iconName, defaultSize] of patterns) {
    content = content.replace(pattern, (match) => {
      const sizeMatch = match.match(/width="(\d+)"/);
      const size = sizeMatch ? sizeMatch[1] : (defaultSize || '20');
      count++;
      return `<BasicIconNext name="${iconName}" :size="${size}" />`;
    });
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  return count;
}

let total = 0;
for (const file of files) {
  const count = processFile(file);
  console.log(`${file}: ${count}`);
  total += count;
}
console.log(`\nTotal: ${total}`);
