// supabase/functions/utils/templates/baseEmailTemplate.ts

export function baseEmailTemplate({
  title,
  bodyHTML,
  ctaLabel,
  ctaUrl,
}: {
  title: string
  bodyHTML: string
  ctaLabel?: string
  ctaUrl?: string
}) {
  const primary = '#00796B'
  const accent = '#00BFA5'
  const accentYellow = '#facc15' // Couleur accent jaune

  // URL de ton logo hébergé
  const logoUrl =
    'https://dwomsbawthlktapmtmqu.supabase.co/storage/v1/object/public/email-icon/fast-peptides-logo.png'

  const ctaBlock =
    ctaLabel && ctaUrl
      ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
        <tr>
          <td align="center">
            <a href="${ctaUrl}"
               style="background:${primary};
                      color:#ffffff;
                      font-size:16px;
                      font-weight:bold;
                      padding:14px 32px;
                      border-radius:8px;
                      text-decoration:none;
                      display:inline-block;
                      mso-padding-alt:0;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
               <span style="mso-text-raise: 15pt;">${ctaLabel}</span>
               </a>
          </td>
        </tr>
      </table>
    `
      : ''

  return `
<!DOCTYPE html>
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <center style="width:100%;background-color:#f4f7fa;padding:40px 0;">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
      
      <div style="background-color:${primary};padding:40px 20px;text-align:center;">
        
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td style="padding-right: 12px; vertical-align: middle;">
                    <img src="${logoUrl}" width="38" height="38" alt="FP Store" style="display:block; border:0; outline:none;" />
                </td>
                <td style="vertical-align: middle; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 26px; line-height: 1;">
                    <span style="color:#ffffff; font-weight:900; font-style:italic; padding-right: 3px;">FP</span>
                    <span style="color:${accentYellow}; font-weight:600; letter-spacing:1px;">Store</span>
                </td>
            </tr>
        </table>

        <h1 style="margin-top:24px; margin-bottom:0; font-size:20px; font-weight:normal; color:#e0f2f1; letter-spacing:-0.5px;">
          ${title}
        </h1>
      </div>

      <div style="padding:40px 32px;color:#334155;line-height:1.6;font-size:16px;">
        ${bodyHTML}
        
        ${ctaBlock}

        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e2e8f0;text-align:center;font-size:14px;color:#64748b;">
          <p style="margin:0 0 8px;">Besoin d'aide ? Contactez notre support.</p>
          <p style="margin:0;">
            L'équipe Atlas Lab (FP)<br/>
            <a href="https://fast-peptides.com" style="color:${accent};text-decoration:none;">fp-store.com</a>
          </p>
        </div>
      </div>

      <div style="background-color:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#94a3b8;">
        <p style="margin:0;">© ${new Date().getFullYear()} Atlas Lab Solutions LLC</p>
      </div>

    </div>
  </center>

</body>
</html>
  `
}
