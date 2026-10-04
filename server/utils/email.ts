import nodemailer from 'nodemailer'

function createTransport() {
  const config = useRuntimeConfig()
  return nodemailer.createTransport({
    host:   config.smtpHost,
    port:   Number(config.smtpPort),
    secure: Number(config.smtpPort) === 465,
    requireTLS: Number(config.smtpPort) === 587,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    tls: { rejectUnauthorized: false },
  })
}

export async function sendAccessRequestEmail(data: {
  name:    string
  email:   string
  company: string
  phone:   string
}) {
  const config = useRuntimeConfig()
  if (!config.smtpHost || !config.smtpUser || !config.smtpAdminTo) return

  const transporter = createTransport()
  const companyLine = data.company ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Empresa</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9;">${data.company}</td></tr>` : ''
  const phoneLine   = data.phone   ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Teléfono</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9;">${data.phone}</td></tr>` : ''

  await transporter.sendMail({
    from:    `"SIEEG INTEGRADORES" <${config.smtpUser}>`,
    to:      config.smtpAdminTo,
    subject: `🙋 Nueva solicitud de acceso — ${data.name}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#06101E;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#0C1A2E;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0EA5E9,#0284C7);padding:28px 32px;">
      <div style="font-size:22px;font-weight:700;color:white;">SIEEG INTEGRADORES</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;">Nueva solicitud de acceso a la plataforma</div>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="font-size:15px;color:#e2e8f0;margin:0 0 20px;">
        Un nuevo prospecto llenó el formulario en tu sitio web y quiere ser cliente:
      </p>

      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;width:100px;">Nombre</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9;">${data.name}</td></tr>
        <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Correo</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#7DD3FC;">${data.email}</td></tr>
        ${companyLine}
        ${phoneLine}
      </table>

      <div style="margin-top:24px;padding:14px 16px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.2);border-radius:10px;font-size:13px;color:#94a3b8;">
        Para activar su acceso, entra al panel de administración → <strong style="color:#7DD3FC;">Usuarios</strong> y cambia su estado a <strong style="color:#22C55E;">Activo</strong>.
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;color:rgba(100,118,142,0.7);">
      Este mensaje fue generado automáticamente por la plataforma SIEEG INTEGRADORES.
    </div>
  </div>
</body>
</html>`,
  })
}

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
const mxn = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

/** Envía una cotización al cliente: resumen con precios del día y liga para verla, descargar el PDF y aceptarla. */
export async function sendQuoteEmail(data: {
  to:       string
  replyTo?: string | null
  folio:    string
  proyecto: string | null
  cliente:  string
  vendedor: string | null
  items:    Array<{ name: string; sku: string; quantity: number; price: number; garantia?: string }>
  envio:    number
  total:    number
  link:     string
}) {
  const config = useRuntimeConfig()
  if (!config.smtpHost || !config.smtpUser) throw createError({ statusCode: 503, message: 'El correo no está configurado en el servidor' })

  const filas = data.items.map(i => `
        <tr>
          <td style="padding:8px 6px;border-bottom:1px solid #E4E9F1;font-size:13px;color:#0B1B33;">${esc(i.name)}<div style="font-size:11px;color:#7A889C;">Modelo: ${esc(i.sku)}${i.garantia ? ` · Garantía: ${esc(i.garantia)}` : ''}</div></td>
          <td style="padding:8px 6px;border-bottom:1px solid #E4E9F1;font-size:13px;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 6px;border-bottom:1px solid #E4E9F1;font-size:13px;text-align:right;white-space:nowrap;">${mxn(i.price * i.quantity)}</td>
        </tr>`).join('')

  await createTransport().sendMail({
    from:    `"SIEEG INTEGRADORES" <${config.smtpUser}>`,
    to:      data.to,
    ...(data.replyTo ? { replyTo: data.replyTo } : {}),
    subject: `Cotización ${data.folio}${data.proyecto ? ` · ${data.proyecto}` : ''} — SIEEG Integradores`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F4F7FB;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:620px;margin:32px auto;background:#FFFFFF;border-radius:16px;border:1px solid #E4E9F1;overflow:hidden;">
    <div style="background:#0B1B33;padding:24px 28px;">
      <div style="font-size:20px;font-weight:700;color:#FFFFFF;">SIEEG INTEGRADORES</div>
      <div style="font-size:13px;color:#B9C6DA;margin-top:4px;">Cotización ${esc(data.folio)}${data.proyecto ? ` · Proyecto: ${esc(data.proyecto)}` : ''}</div>
    </div>
    <div style="padding:24px 28px;">
      <p style="font-size:15px;color:#0B1B33;margin:0 0 6px;">Hola ${esc(data.cliente)},</p>
      <p style="font-size:14px;color:#5B6B82;margin:0 0 18px;line-height:1.55;">${data.vendedor ? `${esc(data.vendedor)} te comparte` : 'Te compartimos'} la cotización que preparamos para ti. Los precios incluyen IVA y son los del día de hoy.</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead><tr>
          <th style="text-align:left;padding:6px;font-size:11px;color:#7A889C;text-transform:uppercase;border-bottom:2px solid #0B1B33;">Producto</th>
          <th style="padding:6px;font-size:11px;color:#7A889C;text-transform:uppercase;border-bottom:2px solid #0B1B33;">Cant.</th>
          <th style="text-align:right;padding:6px;font-size:11px;color:#7A889C;text-transform:uppercase;border-bottom:2px solid #0B1B33;">Importe</th>
        </tr></thead>
        <tbody>${filas}
          <tr><td colspan="2" style="padding:8px 6px;font-size:13px;color:#5B6B82;text-align:right;">Envío</td><td style="padding:8px 6px;font-size:13px;text-align:right;">${mxn(data.envio)}</td></tr>
          <tr><td colspan="2" style="padding:8px 6px;font-size:15px;font-weight:700;text-align:right;">Total (IVA incluido)</td><td style="padding:8px 6px;font-size:15px;font-weight:700;text-align:right;color:#0B5BD3;white-space:nowrap;">${mxn(data.total)}</td></tr>
        </tbody>
      </table>
      <div style="text-align:center;margin:26px 0 8px;">
        <a href="${esc(data.link)}" style="display:inline-block;padding:12px 26px;border-radius:10px;background:#1570EF;color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;">Ver cotización y descargar PDF</a>
      </div>
      <p style="font-size:12px;color:#7A889C;margin:14px 0 0;line-height:1.5;">Precios sujetos a existencias y a cambio sin previo aviso; al confirmar el pedido se aplica el precio del día. La garantía de cada producto es la que otorga su fabricante.</p>
    </div>
    <div style="padding:14px 28px;border-top:1px solid #E4E9F1;font-size:11px;color:#7A889C;">
      SIEEG Integradores · Tel. / WhatsApp 961 333 6529 · contacto@sieeg.com.mx
    </div>
  </div>
</body>
</html>`,
  })
}
