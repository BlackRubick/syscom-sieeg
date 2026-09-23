import { u as useRuntimeConfig, d as defineEventHandler, a as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { createHash } from 'crypto';
import { p as prisma } from '../../../_/prisma.mjs';
import nodemailer from 'nodemailer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

function createTransport() {
  const config = useRuntimeConfig();
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: Number(config.smtpPort) === 465,
    requireTLS: Number(config.smtpPort) === 587,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    },
    tls: { rejectUnauthorized: false }
  });
}
async function sendAccessRequestEmail(data) {
  const config = useRuntimeConfig();
  if (!config.smtpHost || !config.smtpUser || !config.smtpAdminTo) return;
  const transporter = createTransport();
  const companyLine = data.company ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Empresa</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9;">${data.company}</td></tr>` : "";
  const phoneLine = data.phone ? `<tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Tel\xE9fono</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9;">${data.phone}</td></tr>` : "";
  await transporter.sendMail({
    from: `"SIEEG INTEGRADORES" <${config.smtpUser}>`,
    to: config.smtpAdminTo,
    subject: `\u{1F64B} Nueva solicitud de acceso \u2014 ${data.name}`,
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
        Un nuevo prospecto llen\xF3 el formulario en tu sitio web y quiere ser cliente:
      </p>

      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;width:100px;">Nombre</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#f1f5f9;">${data.name}</td></tr>
        <tr><td style="padding:6px 0;color:#94a3b8;font-size:13px;">Correo</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#7DD3FC;">${data.email}</td></tr>
        ${companyLine}
        ${phoneLine}
      </table>

      <div style="margin-top:24px;padding:14px 16px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.2);border-radius:10px;font-size:13px;color:#94a3b8;">
        Para activar su acceso, entra al panel de administraci\xF3n \u2192 <strong style="color:#7DD3FC;">Usuarios</strong> y cambia su estado a <strong style="color:#22C55E;">Activo</strong>.
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.07);font-size:11px;color:rgba(100,118,142,0.7);">
      Este mensaje fue generado autom\xE1ticamente por la plataforma SIEEG INTEGRADORES.
    </div>
  </div>
</body>
</html>`
  });
}

const request_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const { name, email, company, phone } = body;
  if (!(name == null ? void 0 : name.trim()) || !(email == null ? void 0 : email.trim())) {
    throw createError({ statusCode: 400, message: "Nombre y correo son requeridos" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw createError({ statusCode: 400, message: "El correo no tiene un formato v\xE1lido" });
  }
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    if (existing.status === "pending") {
      throw createError({ statusCode: 409, message: "Ya existe una solicitud de acceso con este correo. Te contactaremos pronto." });
    }
    throw createError({ statusCode: 409, message: "Ya existe una cuenta asociada a este correo." });
  }
  const tempPassword = createHash("sha256").update(`pending-${email}-${Date.now()}-${Math.random()}`).digest("hex");
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: tempPassword,
      role: "buyer",
      status: "pending",
      createdAt: today,
      avatar: name.trim().split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase(),
      fiscalRazonSocial: (company == null ? void 0 : company.trim()) || null,
      fiscalTelefono: (phone == null ? void 0 : phone.trim()) || null
    }
  });
  const admins = await prisma.user.findMany({
    where: { role: "admin", status: "active" },
    select: { id: true }
  });
  if (admins.length > 0) {
    const companyPart = (company == null ? void 0 : company.trim()) ? ` (${company.trim()})` : "";
    const phonePart = (phone == null ? void 0 : phone.trim()) ? ` \xB7 Tel: ${phone.trim()}` : "";
    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        userId: admin.id,
        type: "alert",
        title: "\u{1F64B} Nueva solicitud de acceso",
        message: `${name.trim()}${companyPart} quiere ser cliente. Correo: ${email.toLowerCase().trim()}${phonePart}. Ve a Usuarios para activarlo.`,
        read: false
      }))
    });
  }
  sendAccessRequestEmail({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    company: (_a = company == null ? void 0 : company.trim()) != null ? _a : "",
    phone: (_b = phone == null ? void 0 : phone.trim()) != null ? _b : ""
  }).catch(() => {
  });
  return { success: true };
});

export { request_post as default };
//# sourceMappingURL=request.post.mjs.map
