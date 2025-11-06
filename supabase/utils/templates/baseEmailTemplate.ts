export function baseEmailTemplate({ title, bodyHTML }: { title: string; bodyHTML: string }) {
  const color = '#00796B'

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff;
      border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

      <div style="background:${color};padding:20px;text-align:center;color:white;">
        <img src="https://fastpeptides.com/logo.png" alt="Fast Peptides" width="120" style="margin-bottom:8px;" />
        <h2 style="margin:0;font-size:22px;">${title}</h2>
      </div>

      <div style="padding:24px;color:#222;">
        ${bodyHTML}
        <hr style="margin:24px 0;border:none;border-top:1px solid #eee;" />
        <p style="font-size:13px;color:#777;text-align:center;">
          L’équipe Fast Peptides 🧬<br/>
          <a href="https://fastpeptides.com" style="color:${color};text-decoration:none;">fastpeptides.com</a>
        </p>
      </div>
    </div>
  `
}
