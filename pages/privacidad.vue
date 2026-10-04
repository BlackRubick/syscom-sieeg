<template>
  <div class="lg">
    <SiteNavbar />
    <WhatsAppButton />

    <main class="lg-main">
      <header class="lg-head">
        <div class="lg-kicker">Legal</div>
        <h1>Aviso de Privacidad Integral</h1>
        <p class="lg-muted">Última actualización: 4 de octubre de 2026</p>
      </header>

      <section>
        <h2>1. Responsable de sus datos</h2>
        <p>
          <b>SIEEG Integradores</b> (en adelante «SIEEG»), con domicilio en Boulevard Belisario Domínguez #4213 L5, Tuxtla Gutiérrez, Chiapas, México,
          es responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares
          y su normativa aplicable. Contacto: <a href="mailto:contacto@sieeg.com.mx">contacto@sieeg.com.mx</a> · 961 333 6529.
        </p>
      </section>

      <section>
        <h2>2. Datos que recabamos</h2>
        <ul>
          <li><b>Identificación y contacto:</b> nombre, correo electrónico, teléfono y, en su caso, empresa.</li>
          <li><b>Fiscales y de entrega:</b> RFC, razón social, régimen fiscal, uso de CFDI, código postal y domicilio fiscal o de entrega.</li>
          <li><b>De su cuenta y compras:</b> usuario, contraseña (guardada cifrada, nunca la vemos), cotizaciones, pedidos, pagos registrados y garantías.</li>
          <li><b>Técnicos:</b> una cookie de sesión necesaria para mantenerle conectado y datos básicos de conexión (dirección IP) para seguridad.</li>
        </ul>
        <p>No recabamos datos personales sensibles. Si paga con tarjeta, los datos de la tarjeta los recibe directamente el procesador de pagos; SIEEG no los guarda.</p>
      </section>

      <section>
        <h2>3. Para qué usamos sus datos</h2>
        <p><b>Finalidades necesarias</b> (sin ellas no podemos darle el servicio):</p>
        <ul>
          <li>Crear y administrar su cuenta y darle acceso a la plataforma.</li>
          <li>Elaborar cotizaciones, procesar sus pedidos, comprar los productos a nuestros proveedores y enviarlos.</li>
          <li>Emitir sus facturas (CFDI) y cumplir obligaciones fiscales.</li>
          <li>Registrar pagos, atender garantías, devoluciones y aclaraciones.</li>
          <li>Enviarle avisos sobre el estado de sus pedidos, cotizaciones y su cuenta.</li>
        </ul>
        <p><b>Finalidades adicionales</b> (puede negarse sin afectar su servicio): enviarle promociones y novedades de productos.
          Para negarse, escriba a <a href="mailto:contacto@sieeg.com.mx">contacto@sieeg.com.mx</a> con el asunto «No promociones».</p>
      </section>

      <section>
        <h2>4. Con quién compartimos sus datos</h2>
        <ul>
          <li><b>Proveedores de producto</b> (p. ej. SYSCOM): nombre y domicilio de entrega para surtir y enviar su pedido.</li>
          <li><b>Paqueterías:</b> datos de entrega y teléfono.</li>
          <li><b>Proveedor autorizado de certificación de CFDI:</b> datos fiscales para timbrar sus facturas.</li>
          <li><b>Procesador de pagos</b>, cuando paga en línea.</li>
          <li><b>Autoridades</b> que lo requieran conforme a la ley (p. ej. el SAT).</li>
        </ul>
        <p>Estas transferencias son necesarias para cumplir la relación comercial con usted o una obligación legal, por lo que no requieren su consentimiento. No vendemos sus datos.</p>
      </section>

      <section>
        <h2>5. Sus derechos ARCO</h2>
        <p>
          Usted puede <b>Acceder</b> a sus datos, <b>Rectificarlos</b> si son inexactos, <b>Cancelarlos</b> cuando considere que no se requieren para las finalidades señaladas,
          u <b>Oponerse</b> a su uso para fines específicos. También puede revocar su consentimiento y limitar el uso o divulgación de sus datos.
        </p>
        <p>Para ejercerlos envíe un correo a <a href="mailto:contacto@sieeg.com.mx">contacto@sieeg.com.mx</a> con:</p>
        <ol>
          <li>Su nombre y un medio para responderle.</li>
          <li>Copia de una identificación oficial (o, si lo hace un representante, el documento que lo acredite).</li>
          <li>La descripción clara de los datos y del derecho que desea ejercer.</li>
          <li>Cualquier documento que ayude a localizar sus datos (por ejemplo, su número de cliente).</li>
        </ol>
        <p>
          Le responderemos en un máximo de 20 días hábiles y, si procede, haremos efectivo el cambio dentro de los 15 días hábiles siguientes.
          Puede corregir sus datos de contacto y fiscales en cualquier momento desde <b>Mi perfil</b>. Algunos datos deben conservarse el tiempo que exigen las leyes fiscales,
          aun si solicita la cancelación.
        </p>
      </section>

      <section>
        <h2>6. Cookies y tecnologías similares</h2>
        <p>
          Usamos únicamente una cookie de sesión necesaria para que pueda iniciar sesión y almacenamiento local del navegador para recordar, por ejemplo, el cliente elegido en el carrito.
          No usamos cookies de publicidad ni de rastreo de terceros. Puede borrar las cookies desde su navegador; si lo hace, tendrá que volver a iniciar sesión.
        </p>
      </section>

      <section>
        <h2>7. Seguridad y conservación</h2>
        <p>
          Protegemos sus datos con medidas administrativas, técnicas y físicas: conexión cifrada (HTTPS), contraseñas cifradas, acceso restringido por rol y respaldos.
          Conservamos sus datos mientras tenga una cuenta con nosotros y, después, el tiempo que exijan las obligaciones fiscales y comerciales.
        </p>
      </section>

      <section>
        <h2>8. Cambios a este aviso</h2>
        <p>
          Cualquier cambio a este aviso se publicará en esta misma página con su fecha de actualización. Si el cambio es relevante, también se lo informaremos por correo.
        </p>
        <p>
          Si considera que su derecho a la protección de datos fue vulnerado, puede acudir a la autoridad competente en materia de protección de datos personales.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing' })
useSeoMeta({
  title: 'Aviso de Privacidad — SIEEG Integradores',
  description: 'Cómo SIEEG Integradores recaba, usa y protege sus datos personales y cómo ejercer sus derechos ARCO.',
})
</script>

<style scoped>
.lg { min-height: 100vh; background: #F5F8FC; font-family: 'Inter', system-ui, sans-serif; color: #0B1B33; overflow-x: hidden; }
.lg-main { max-width: 800px; margin: 0 auto; padding: 56px 24px 100px; }
.lg-head { margin-bottom: 36px; padding-bottom: 28px; border-bottom: 1px solid rgba(21,112,239,0.25); }
.lg-kicker { font-size: 12px; font-weight: 600; color: #0B5BD3; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
.lg h1 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; letter-spacing: -1px; margin: 0 0 10px; }
.lg-muted { font-size: 14px; color: #5B6B82; margin: 0; }
.lg section { margin-bottom: 36px; }
.lg h2 { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; margin: 0 0 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(11,27,51,0.07); }
.lg p, .lg li { font-size: 15px; line-height: 1.8; color: #5B6B82; }
.lg p { margin: 0 0 12px; }
.lg ul, .lg ol { margin: 0 0 12px; padding-left: 22px; }
.lg b { color: #0B1B33; }
.lg a { color: #0B5BD3; font-weight: 600; }
@media (max-width: 640px) { .lg-main { padding: 36px 16px 80px; } }
</style>
