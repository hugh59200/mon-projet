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
  const logoUrl = 'https://fast-peptides.com/logo.png'

  const ctaBlock =
    ctaLabel && ctaUrl
      ? `
      <table role="presentation" width="100%" style="margin:28px 0;">
        <tr>
          <td align="center">
            <a href="${ctaUrl}"
              style="background:${primary};
                     color:#fff;
                     font-size:16px;
                     font-weight:bold;
                     padding:12px 28px;
                     border-radius:6px;
                     text-decoration:none;
                     display:inline-block;">
               ${ctaLabel}
            </a>
          </td>
        </tr>
      </table>`
      : ''

  return `
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
    <center style="width:100%;padding:20px 0;">
      <div style="max-width:600px;margin:auto;">
        <table width="100%" style="background:#fff;border-radius:10px;overflow:hidden;">
          <tr>
            <td align="center" style="background:${primary};padding:25px;color:#fff;">             
              <h2 style="margin:0;font-size:22px;">${title}</h2>
            </td>
          </tr>

          <tr>
            <td style="padding:24px;color:#222;font-size:15px;line-height:1.5;">
              ${bodyHTML}
              ${ctaBlock}

              <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />

              <p style="font-size:13px;color:#777;text-align:center;">
                L’équipe Fast Peptides 🧬<br/>
                <a href="https://fast-peptides.com"
                  style="color:${primary};text-decoration:none;">fast-peptides.com</a>
              </p>
            </td>
          </tr>
        </table>
      </div>
    </center>
  </body>`
}
