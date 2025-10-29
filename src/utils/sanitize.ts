import DOMPurify from 'dompurify'
import { marked } from 'marked'

export const parseAndSanitize = (input?: string | null): string => {
  if (!input) return ''

  // Support v10+ (parseSync) et versions plus anciennes (marked ou parse)
  const html =
    typeof (marked as any).parseSync === 'function'
      ? (marked as any).parseSync(input)
      : typeof (marked as any).parse === 'function'
        ? (marked as any).parse(input)
        : (marked as any)(input)

  return DOMPurify.sanitize(html)
}

/**
 * Nettoie directement du HTML (sans conversion Markdown)
 */
export const sanitizeHTML = (html?: string | null): string => (html ? DOMPurify.sanitize(html) : '')
