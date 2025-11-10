import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function genericTemplate({ title, message }: { title: string; message: string }) {
  return baseEmailTemplate({
    title,
    bodyHTML: `<p>${message}</p>`,
  })
}
