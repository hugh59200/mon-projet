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
  const logoUrl = 'https://mon-projet-perso.pages.dev/logo-app.png'

  const ctaBlock =
    ctaLabel && ctaUrl
      ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
        <tr>
          <td align="center">
            <a href="${ctaUrl}"
              style="background:${primary};
                     color:#fff;
                     font-size:16px;
                     font-weight:600;
                     padding:14px 32px;
                     border-radius:8px;
                     text-decoration:none;
                     display:inline-block;">
               ${ctaLabel}
            </a>
          </td>
        </tr>
      </table>
    `
      : ''

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Roboto,Arial,sans-serif;">

  <center style="width:100%;background:#f0f4f8;padding:40px 0;">
    <div style="max-width:620px;margin:0 auto;">

      <!-- Wrapper -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background:#fff;border-radius:16px;overflow:hidden;
               box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td align="center" style="background:${primary};padding:35px 20px;color:#fff;">
            <img
              src="${logoUrl}"
              width="70"
              alt="Fast Peptides"
              style="display:block;margin:0 auto 16px;"
            />
            <h1 style="margin:0;font-size:24px;font-weight:700;color:#fff;">
              ${title}
            </h1>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:32px 28px;color:#222;line-height:1.6;font-size:15px;">
            ${bodyHTML}

            ${ctaBlock}

            <hr style="margin:32px 0;border:none;border-top:1px solid #eee;" />

            <p style="font-size:13px;color:#777;text-align:center;margin:0;">
              L’équipe Fast Peptides 🧬<br/>
              <a href="https://fastpeptides.com"
                 style="color:${accent};text-decoration:none;font-weight:500;">
                fastpeptides.com
              </a>
            </p>
          </td>
        </tr>
      </table>

      <p style="font-size:12px;color:#999;text-align:center;margin-top:24px;">
        © ${new Date().getFullYear()} Fast Peptides — Tous droits réservés.
      </p>
    </div>
  </center>
</body>
</html>
  `
}
