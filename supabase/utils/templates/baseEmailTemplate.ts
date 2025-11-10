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

  const ctaBlock =
    ctaLabel && ctaUrl
      ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
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
      </table>
    `
      : ''

  return `
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

    <center style="width:100%;table-layout:fixed;background:#f5f5f5;padding:20px 0;">
      <div style="max-width:600px;margin:0 auto;">

        <!--[if mso]>
        <table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0">
          <tr><td>
        <![endif]-->

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background:#fff;border-radius:10px;overflow:hidden;
                 box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <tr>
            <td align="center" style="background:${primary};padding:25px;color:#fff;">
              <img src="https://fastpeptides.com/logo-app.png"
                   width="60"
                   alt="Fast Peptides"
                   style="display:block;margin:0 auto 8px;" />
              <h2 style="margin:0;font-size:22px;color:#fff;">${title}</h2>
            </td>
          </tr>

          <tr>
            <td style="padding:24px;color:#222;line-height:1.5;font-size:15px;">
              ${bodyHTML}

              ${ctaBlock}

              <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />

              <p style="font-size:13px;color:#777;text-align:center;">
                L’équipe Fast Peptides 🧬<br/>
                <a href="https://fastpeptides.com" style="color:${primary};text-decoration:none;">
                  fastpeptides.com
                </a>
              </p>
            </td>
          </tr>

        </table>

        <!--[if mso]>
          </td></tr></table>
        <![endif]-->

      </div>
    </center>
  </body>
  `
}
