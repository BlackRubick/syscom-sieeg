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
<body style="margin:0;padding:0;background:#040C1A;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#0D1B35;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;">

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
        <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Correo</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#38bdf8;">${data.email}</td></tr>
        ${companyLine}
        ${phoneLine}
      </table>

      <div style="margin-top:24px;padding:14px 16px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.2);border-radius:10px;font-size:13px;color:#94a3b8;">
        Para activar su acceso, entra al panel de administración → <strong style="color:#38bdf8;">Usuarios</strong> y cambia su estado a <strong style="color:#34d399;">Activo</strong>.
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;color:rgba(100,116,139,0.7);">
      Este mensaje fue generado automáticamente por la plataforma SIEEG INTEGRADORES.
    </div>
  </div>
</body>
</html>`,
  })
}
