import DOMPurify from 'dompurify'
import { marked } from 'marked'

/**
 * Convertit du Markdown en HTML, puis le nettoie (anti-XSS)
 */
export const parseAndSanitize = (input?: string | null): string => {
  if (!input) return ''

  let html: string

  if (typeof (marked as any).parseSync === 'function') {
    html = (marked as any).parseSync(input)
  } else if (typeof (marked as any).parse === 'function') {
    html = (marked as any).parse(input)
  } else {
    html = (marked as any)(input)
  }

  return DOMPurify.sanitize(html)
}

/**
 * Nettoie du HTML déjà généré
 */
export const sanitizeHTML = (html?: string | null): string => {
  return html ? DOMPurify.sanitize(html) : ''
}
