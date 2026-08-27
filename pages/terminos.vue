<template>
  <div style="min-height:100vh;background:#040C1A;font-family:'Inter',system-ui,sans-serif;color:#F1F5F9;overflow-x:hidden;">

    <!-- Fondo -->
    <div style="position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 60% 40% at 10% 0%,rgba(14,165,233,0.05) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 90% 100%,rgba(124,58,237,0.04) 0%,transparent 60%)" />

    <!-- NAVBAR -->
    <nav style="position:sticky;top:0;z-index:100;height:64px;display:flex;align-items:center;background:rgba(4,12,26,0.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.06);padding:0 24px;">
      <div style="width:100%;max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;">
        <NuxtLink to="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
          <img src="/logosieeg.jpg" alt="SIEEG" style="height:28px;width:28px;object-fit:contain;border-radius:6px;" />
          <span style="font-size:15px;font-weight:700;color:#F1F5F9;letter-spacing:-0.3px;">SIEEG <span style="color:#0EA5E9;">INTEGRADORES</span></span>
        </NuxtLink>
        <NuxtLink to="/" style="display:flex;align-items:center;gap:6px;font-size:13px;color:rgba(148,163,184,0.75);text-decoration:none;transition:color 0.2s;"
          @mouseenter="e => (e.currentTarget as HTMLElement).style.color='#F1F5F9'"
          @mouseleave="e => (e.currentTarget as HTMLElement).style.color='rgba(148,163,184,0.75)'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver al inicio
        </NuxtLink>
      </div>
    </nav>

    <!-- CONTENIDO -->
    <main style="position:relative;z-index:1;max-width:800px;margin:0 auto;padding:64px 24px 100px;">

      <!-- Encabezado -->
      <div style="margin-bottom:48px;">
        <div style="font-size:12px;font-weight:600;color:#38bdf8;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">Legal</div>
        <h1 style="font-size:clamp(28px,4vw,42px);font-weight:800;color:#F1F5F9;letter-spacing:-1px;margin-bottom:14px;">Términos y Condiciones</h1>
        <p style="font-size:14px;color:rgba(100,116,139,0.8);">Última actualización: 26 de agosto de 2026</p>
      </div>

      <!-- Divisor -->
      <div style="height:1px;background:linear-gradient(90deg,rgba(14,165,233,0.3),rgba(124,58,237,0.2),transparent);margin-bottom:48px;" />

      <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 40px 0;">
        Por favor, lea detenidamente estos términos y condiciones antes de utilizar nuestro servicio.
      </p>

      <!-- Sección: Interpretación y definiciones -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Interpretación y definiciones</h2>

        <h3 style="font-size:14px;font-weight:600;color:#38bdf8;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Interpretación</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 24px 0;">
          Las palabras cuyas letras iniciales están en mayúscula tienen significados definidos en las siguientes condiciones. Las siguientes definiciones tendrán el mismo significado independientemente de si aparecen en singular o en plural.
        </p>

        <h3 style="font-size:14px;font-weight:600;color:#38bdf8;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 16px 0;">Definiciones</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 16px 0;">A los efectos de estos Términos y Condiciones:</p>

        <div style="display:flex;flex-direction:column;gap:14px;">
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Afiliado</strong> significa una entidad que controla, está controlada por, o está bajo control común con una parte, donde "control" significa la propiedad del 50% o más de las acciones, participación en el patrimonio u otros valores con derecho a votar por la elección de los directores u otra autoridad de gestión.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">País/Estado</strong> se refiere a: México.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">La Compañía</strong> (denominada "la Compañía", "Nosotros" o "Nuestro" en estos Términos y Condiciones) se refiere a Sieeg, Boulevard Belisario Ingeniería Domínguez 4213 L5.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Dispositivo</strong> significa cualquier dispositivo que pueda acceder al Servicio, como un ordenador, un teléfono celular o una tableta digital.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Los bienes</strong> se refieren a los artículos ofrecidos para la venta en el Servicio.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Pedidos</strong> significa una solicitud de usted para comprar mercancías de nosotros.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">El servicio</strong> se refiere al sitio web.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Términos y Condiciones</strong> (también denominados "Términos") significa estos Términos y Condiciones, incluidos los documentos expresamente incorporados por referencia, que rigen su acceso y uso del Servicio y forman el acuerdo completo entre Usted y la Compañía con respecto al Servicio.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Servicio de redes sociales de terceros</strong> significa cualquier servicio o contenido (incluidos datos, información, productos o servicios) proporcionados por un tercero que se muestra, incluye, pone a disposición o se vincula a través del Servicio.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">El sitio web</strong> se refiere a Sieeg, accesible desde <span style="color:#38bdf8;">https://integradores.sieeg.com.mx/</span></p>
          </div>
          <div style="padding:14px 16px;background:rgba(14,165,233,0.04);border:1px solid rgba(14,165,233,0.1);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Usted</strong> se refiere a la persona que accede o utiliza el Servicio, o la empresa, u otra entidad legal en nombre de la cual dicha persona está accediendo o utilizando el Servicio, según corresponda.</p>
          </div>
        </div>
      </section>

      <!-- Sección: Reconocimiento -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Reconocimiento</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Estos son los Términos y Condiciones que rigen el uso de este Servicio y el acuerdo entre Usted y la Compañía. Estos Términos y Condiciones establecen los derechos y obligaciones de todos los usuarios con respecto al uso del Servicio.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Su acceso y uso del Servicio está condicionado a su aceptación y cumplimiento de estos Términos y Condiciones. Estos Términos y Condiciones se aplican a todos los visitantes, usuarios y otras personas que acceden o utilizan el Servicio.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Al acceder o utilizar el Servicio, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos Términos y Condiciones, entonces no puede acceder al Servicio.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Usted representa que tiene más de 18 años. La Compañía no permite que los menores de 18 años utilicen el Servicio.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Su acceso y uso del Servicio también está sujeto a Nuestra Política de Privacidad, que describe cómo recopilamos, usamos y divulgamos información personal. Lea detenidamente nuestra Política de privacidad antes de utilizar nuestro servicio.
        </p>
      </section>

      <!-- Sección: Colocación de pedidos -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Colocación de pedidos de mercancías</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 24px 0;">
          Al realizar un Pedido de Bienes a través del Servicio, Usted garantiza que Usted es legalmente capaz de celebrar contratos vinculantes.
        </p>

        <h3 style="font-size:14px;font-weight:600;color:#38bdf8;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Su información</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Si desea realizar un pedido de bienes disponibles en el Servicio, se le puede pedir que proporcione cierta información relevante para su pedido, incluido, entre otros, su nombre, su correo electrónico, su número de teléfono, su número de tarjeta de crédito, la fecha de vencimiento de su tarjeta de crédito, su dirección de facturación e información de envío.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Usted declara y garantiza que: (i) Usted tiene el derecho legal de usar cualquier tarjeta de crédito o débito u otro método(s) de pago en relación con cualquier Pedido; y que (ii) la información que Usted nos proporciona es verdadera, correcta y completa.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 24px 0;">
          Al enviar dicha información, Usted nos otorga el derecho de proporcionar la información al procesamiento de pagos de terceros con el fin de facilitar la finalización de su pedido.
        </p>

        <h3 style="font-size:14px;font-weight:600;color:#38bdf8;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Cancelación de pedido</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">
          Nos reservamos el derecho de rechazar o cancelar su pedido en cualquier momento por ciertas razones, incluyendo, pero no limitado a:
        </p>
        <ul style="padding-left:20px;margin:0 0 14px 0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#38bdf8;">—</span>Disponibilidad de mercancías</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#38bdf8;">—</span>Errores en la descripción o precios de los bienes</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#38bdf8;">—</span>Errores en su pedido</li>
        </ul>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 24px 0;">
          Nos reservamos el derecho de rechazar o cancelar su pedido si se sospecha de fraude o una transacción no autorizada o ilegal.
        </p>

        <h3 style="font-size:14px;font-weight:600;color:#38bdf8;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Derechos de cancelación de su pedido</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Cualquier Producto que compre solo puede ser devuelto de acuerdo con estos Términos y Condiciones y Nuestra Política de Devoluciones.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Nuestra Política de Devoluciones forma parte de estos Términos y Condiciones. Lea nuestra Política de devoluciones para obtener más información sobre su derecho a cancelar su pedido.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Su derecho a cancelar un Pedido solo se aplica a los Bienes que se devuelven en las mismas condiciones en que Usted los recibió. También debe incluir todas las instrucciones, documentos y envolturas del producto. Los productos que están dañados o no en las mismas condiciones en que los recibió o que se usan simplemente más allá de abrir el embalaje original no serán reembolsados. Por lo tanto, debe tener un cuidado razonable de los Bienes comprados mientras estén en Su poder.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Le reembolsaremos a más tardar 14 días a partir del día en que recibamos los Productos devueltos. Utilizaremos el mismo medio de pago que usted utilizó para el Pedido, y no incurrirá en ninguna tarifa por dicho reembolso.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">
          Usted no tendrá ningún derecho a cancelar un Pedido para el suministro de cualquiera de los siguientes Bienes:
        </p>
        <ul style="padding-left:20px;margin:0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#38bdf8;">—</span>El suministro de bienes hechos a sus especificaciones o claramente personalizados.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#38bdf8;">—</span>El suministro de bienes que según su naturaleza no son adecuados para ser devueltos, se deterioran rápidamente o cuando la fecha de vencimiento ha terminado.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#38bdf8;">—</span>El suministro de bienes que no son adecuados para el retorno debido a razones de protección de la salud o higiene y fueron desprecintados después del parto.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#38bdf8;">—</span>El suministro de bienes que, después de la entrega, según su naturaleza, se mezclan inseparablemente con otros artículos.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#38bdf8;">—</span>El suministro de contenido digital que no se suministra en un medio tangible si el rendimiento ha comenzado con su consentimiento expreso previo y usted ha reconocido su pérdida de derecho de cancelación.</li>
        </ul>
      </section>

      <!-- Sección: Disponibilidad, errores e inexactitudes -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Disponibilidad, errores e inexactitudes</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Estamos constantemente actualizando nuestra oferta de bienes en el servicio. Los Bienes disponibles en Nuestro Servicio pueden ser mal valorados, descritos de manera inexacta o no disponibles, y podemos experimentar retrasos en la actualización de información sobre nuestros Bienes en el Servicio y en Nuestra publicidad en otros sitios web.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          No podemos y no garantizamos la exactitud o integridad de ninguna información, incluidos los precios, las imágenes del producto, las especificaciones, la disponibilidad y los servicios. Nos reservamos el derecho de cambiar o actualizar la información y corregir errores, inexactitudes u omisiones en cualquier momento sin previo aviso.
        </p>
      </section>

      <!-- Sección: Política de precios -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Política de precios</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          La Compañía se reserva el derecho de revisar sus precios en cualquier momento antes de aceptar un pedido.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Los precios cotizados pueden ser revisados por la Compañía después de aceptar una Orden en caso de que cualquier ocurrencia afecte la entrega causada por la acción del gobierno, la variación en los derechos de aduana, el aumento de los gastos de envío, los costos de cambio más altos y cualquier otro asunto fuera del control de la Compañía. En ese caso, usted tendrá el derecho de cancelar su pedido.
        </p>
      </section>

      <!-- Sección: Pagos -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Pagos</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Todos los productos comprados están sujetos a un pago único. El pago se puede hacer a través de varios métodos de pago que tenemos disponibles, como Visa, MasterCard, Affinity Card, tarjetas American Express o métodos de pago en línea.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Las tarjetas de pago (tarjetas de crédito o tarjetas de débito) están sujetas a cheques de validación y autorización por parte del emisor de su tarjeta. Si no recibimos la autorización requerida, no seremos responsables de ningún retraso o no entrega de su pedido.
        </p>
      </section>

      <!-- Sección: Enlaces a otros sitios web -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Enlaces a otros sitios web</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Nuestro Servicio puede contener enlaces a sitios web o servicios de terceros que no son propiedad o están controlados por la Compañía.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          La Compañía no tiene control sobre, y no asume ninguna responsabilidad por, el contenido, las políticas de privacidad o las prácticas de cualquier sitio web o servicio de terceros. Además, usted reconoce y acepta que la Compañía no será responsable, directa o indirectamente, de ningún daño o pérdida causado o presuntamente causado por o en relación con el uso o la confianza en dicho contenido, bienes o servicios disponibles en o a través de cualquiera de dichos sitios web o servicios.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Le recomendamos encarecidamente que lea los términos y condiciones y las políticas de privacidad de los sitios web o servicios de terceros que visite.
        </p>
      </section>

      <!-- Sección: Redes sociales de terceros -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Enlaces de un servicio de redes sociales de terceros</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          El Servicio puede mostrar, incluir, poner a disposición o vincular a contenido o servicios proporcionados por un Servicio de Redes Sociales de Terceros. Un Servicio de Redes Sociales de Terceros no es propiedad ni está controlado por la Compañía, y la Compañía no respalda ni asume la responsabilidad de ningún Servicio de Redes Sociales de Terceros.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Usted reconoce y acepta que la Compañía no será responsable, directa o indirectamente, de ningún daño o pérdida causado o presuntamente causado por o en relación con su acceso o uso de cualquier Servicio de Redes Sociales de Terceros, incluido cualquier contenido, bienes o servicios disponibles a través de ellos. El uso de cualquier Servicio de Redes Sociales de Terceros se rige por los términos y las políticas de privacidad de ese Servicio de Redes Sociales de Terceros.
        </p>
      </section>

      <!-- Sección: Terminación -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Terminación</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Podemos terminar o suspender su acceso inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo, incluyendo, sin limitación, si usted incumple estos Términos y Condiciones.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Tras la terminación, su derecho a utilizar el Servicio cesará inmediatamente.
        </p>
      </section>

      <!-- Sección: Limitación de responsabilidad -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Limitación de responsabilidad</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Sin perjuicio de los daños y perjuicios en los que pueda incurrir, toda la responsabilidad de la Compañía y de cualquiera de sus proveedores bajo cualquier disposición de estos Términos y Su recurso exclusivo para todo lo anterior se limitará a la cantidad realmente pagada por Usted a través del Servicio o 100 USD si no ha comprado nada a través del Servicio.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          En la medida máxima permitida por la ley aplicable, en ningún caso la Compañía o sus proveedores serán responsables de ningún daño especial, incidental, indirecto o consecuente (incluyendo, pero no limitado a, daños por pérdida de ganancias, pérdida de datos u otra información, por interrupción comercial, por lesiones personales, pérdida de privacidad que surja de o de alguna manera relacionada con el uso o la incapacidad de usar el Servicio, software de terceros y/o hardware de terceros utilizado con el Servicio, o de cualquier otro modo).
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Algunos estados no permiten la exclusión de garantías implícitas o la limitación de responsabilidad por daños incidentales o consecuentes, lo que significa que algunas de las limitaciones anteriores pueden no aplicarse. En estos estados, la responsabilidad de cada parte se limitará en la mayor medida permitida por la ley.
        </p>
      </section>

      <!-- Sección: TAL CUAL -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">"TAL CUAL" y "SEGÚN DISPONIBILIDAD" — Exención de responsabilidad</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          El Servicio se proporciona a Usted "TAL CUAL" y "SEGÚN DISPONIBILIDAD" y con todos los fallos y defectos sin garantía de ningún tipo. En la medida máxima permitida por la ley aplicable, la Compañía, en su propio nombre y en nombre de sus Afiliados y sus respectivos licenciantes y proveedores de servicios, renuncia expresamente a todas las garantías, ya sean expresas, implícitas, legales o de otro tipo, con respecto al Servicio, incluidas todas las garantías implícitas de comerciabilidad, idoneidad para un propósito particular, título y no infracción.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Sin limitar lo anterior, ni la Compañía ni ninguno de los proveedores de la compañía hacen ninguna representación o garantía de ningún tipo, expreso o implícito: (i) en cuanto a la operación o disponibilidad del Servicio, o la información, contenido y materiales o productos incluidos en el mismo; (ii) que el Servicio será ininterrumpido o libre de errores; (iii) en cuanto a la exactitud, confiabilidad o moneda de cualquier información o contenido proporcionado a través del Servicio; o (iv) que el Servicio, su contenido o los servidores o redes conectadas al Servicio están libres de virus u otros componentes dañinos.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Algunas jurisdicciones no permiten la exclusión de ciertos tipos de garantías o limitaciones sobre los derechos legales aplicables de un consumidor, por lo que algunas o todas las exclusiones y limitaciones anteriores pueden no aplicarse a Usted. Pero en tal caso, las exclusiones y limitaciones establecidas en esta sección se aplicarán en la mayor medida posible según la ley aplicable.
        </p>
      </section>

      <!-- Sección: Ley aplicable -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Ley aplicable</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Las leyes del País/Estado, excluyendo sus conflictos de normas legales, regirán estos Términos y Su uso del Servicio. Su uso de la Aplicación también puede estar sujeto a otras leyes locales, estatales, nacionales o internacionales.
        </p>
      </section>

      <!-- Sección: Resolución de disputas -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Resolución de disputas</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Si usted tiene alguna preocupación o disputa sobre el Servicio, Usted acepta primero tratar de resolver la disputa de manera informal poniéndose en contacto con la Compañía.
        </p>
      </section>

      <!-- Sección: Para Usuarios de la UE -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Para Usuarios de la Unión Europea (UE)</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Si usted es un consumidor de la Unión Europea, se beneficiará de cualquier disposición obligatoria de la ley del país en el que reside.
        </p>
      </section>

      <!-- Sección: Cumplimiento legal de EE.UU. -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Cumplimiento legal de los Estados Unidos</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Usted declara y garantiza que (i) usted no está ubicado en un país que está sujeto al embargo del gobierno de los Estados Unidos, o que ha sido designado por el gobierno de los Estados Unidos como un país de "apoyo terrorista", y (ii) Usted no está incluido en ninguna lista del gobierno de los Estados Unidos de partes prohibidas o restringidas.
        </p>
      </section>

      <!-- Sección: Separabilidad y Exención -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Separabilidad y Exención</h2>

        <h3 style="font-size:14px;font-weight:600;color:#38bdf8;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Separabilidad</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 24px 0;">
          Si alguna disposición de estos Términos se considera inaplicable o inválida, dicha disposición se cambiará e interpretará para lograr los objetivos de dicha disposición en la mayor medida posible según la ley aplicable y las disposiciones restantes continuarán en pleno vigor y efecto.
        </p>

        <h3 style="font-size:14px;font-weight:600;color:#38bdf8;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Exención</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Excepto según lo dispuesto en el presente documento, el incumplimiento de un derecho o el incumplimiento de una obligación en virtud de estos Términos no afectará la capacidad de una parte para ejercer dicho derecho o exigir dicho cumplimiento en cualquier momento posterior ni la renuncia a un incumplimiento constituirá una renuncia a cualquier incumplimiento posterior.
        </p>
      </section>

      <!-- Sección: Interpretación de la traducción -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Interpretación de la traducción</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Estos Términos y Condiciones pueden haber sido traducidos si los hemos puesto a su disposición en nuestro Servicio. Usted acepta que el texto original en inglés prevalecerá en caso de una disputa.
        </p>
      </section>

      <!-- Sección: Cambios a estos Términos -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Cambios a estos Términos y Condiciones</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es importante, haremos esfuerzos razonables para proporcionar al menos 30 días de aviso antes de que entren en vigor nuevos términos. Lo que constituye un cambio material se determinará a nuestra entera discreción.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Al continuar accediendo o utilizando Nuestro Servicio después de que esas revisiones entren en vigencia, Usted acepta estar obligado por los términos revisados. Si no está de acuerdo con los nuevos términos, en su totalidad o en parte, por favor deje de utilizar el Servicio.
        </p>
      </section>

      <!-- Sección: Contáctenos -->
      <section style="margin-bottom:0;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Contáctenos</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 16px 0;">
          Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos:
        </p>
        <div style="display:inline-flex;align-items:center;gap:10px;padding:14px 20px;background:rgba(14,165,233,0.06);border:1px solid rgba(14,165,233,0.18);border-radius:10px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <a href="mailto:contacto@sieeg.com.mx" style="font-size:14px;color:#38bdf8;text-decoration:none;font-weight:500;">contacto@sieeg.com.mx</a>
        </div>
      </section>

    </main>

    <!-- FOOTER -->
    <footer style="border-top:1px solid rgba(255,255,255,0.06);padding:28px 24px;">
      <div style="max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
        <span style="font-size:12px;color:rgba(71,85,105,0.6);">© {{ new Date().getFullYear() }} SIEEG INTEGRADORES. Todos los derechos reservados.</span>
        <div style="display:flex;gap:16px;">
          <NuxtLink to="/terminos" style="font-size:12px;color:#38bdf8;text-decoration:none;">Términos y Condiciones</NuxtLink>
          <NuxtLink to="/privacidad" style="font-size:12px;color:rgba(71,85,105,0.7);text-decoration:none;transition:color 0.2s;"
            @mouseenter="e => (e.currentTarget as HTMLElement).style.color='rgba(148,163,184,0.9)'"
            @mouseleave="e => (e.currentTarget as HTMLElement).style.color='rgba(71,85,105,0.7)'">
            Políticas de Privacidad
          </NuxtLink>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing' })
</script>
