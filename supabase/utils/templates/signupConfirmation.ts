import { baseEmailTemplate } from './baseEmailTemplate.ts'

export function signupConfirmationTemplate({
  full_name = 'Cher client',
  confirmation_url,
}: {
  full_name?: string
  confirmation_url: string
}) {
  const bodyHTML = `
    <p>Bonjour ${full_name},</p>
    <p>Merci de votre inscription sur Fast Peptides 🧬</p>

    <p>Pour activer votre compte, cliquez ici :</p>

    <div style="text-align:center;margin:30px 0;">
      <a href="${confirmation_url}"
         style="background:#00796B;color:white;padding:14px 22px;
         border-radius:6px;font-size:16px;text-decoration:none;">
         ✅ Confirmer mon email
      </a>
    </div>

    <p>Ce lien est valide pendant une durée limitée.</p>
  `

  return baseEmailTemplate({
    title: 'Confirmez votre inscription 🎉',
    bodyHTML,
  })
}
