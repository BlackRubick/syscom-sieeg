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
        <div style="font-size:12px;font-weight:600;color:#a78bfa;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">Legal</div>
        <h1 style="font-size:clamp(28px,4vw,42px);font-weight:800;color:#F1F5F9;letter-spacing:-1px;margin-bottom:14px;">Política de Privacidad</h1>
        <p style="font-size:14px;color:rgba(100,116,139,0.8);">Última actualización: 26 de agosto de 2026</p>
      </div>

      <!-- Divisor -->
      <div style="height:1px;background:linear-gradient(90deg,rgba(124,58,237,0.3),rgba(14,165,233,0.2),transparent);margin-bottom:48px;" />

      <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
        Esta Política de Privacidad describe Nuestras políticas y procedimientos sobre la recopilación, uso y divulgación de su información cuando utiliza el Servicio y le informa sobre sus derechos de privacidad y cómo la ley lo protege.
      </p>
      <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 40px 0;">
        Utilizamos sus datos personales para proporcionar y mejorar el servicio. Recopilamos, utilizamos y divulgamos su información como se describe en esta Política de privacidad y, cuando lo exija la ley aplicable, solo cuando tengamos una base legal válida para hacerlo, incluido su consentimiento (donde se requiere el consentimiento).
      </p>

      <!-- Sección: Interpretación y definiciones -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Interpretación y definiciones</h2>

        <h3 style="font-size:14px;font-weight:600;color:#a78bfa;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Interpretación</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 24px 0;">
          Las palabras cuyas letras iniciales están en mayúscula tienen significados definidos en las siguientes condiciones. Las siguientes definiciones tendrán el mismo significado independientemente de si aparecen en singular o en plural.
        </p>

        <h3 style="font-size:14px;font-weight:600;color:#a78bfa;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 16px 0;">Definiciones</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 16px 0;">A los efectos de la presente Política de Privacidad:</p>

        <div style="display:flex;flex-direction:column;gap:14px;">
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Cuenta</strong> significa una cuenta única creada para que usted pueda acceder a nuestro servicio o partes de nuestro servicio.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Afiliado</strong> significa una entidad que controla, está controlada por, o está bajo control común con una parte, donde "control" significa la propiedad del 50% o más de las acciones, participación en el patrimonio u otros valores con derecho a votar por la elección de los directores u otra autoridad de gestión.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">La Compañía</strong> (denominada "la Compañía", "Nosotros" o "Nuestro" en esta Política de Privacidad) se refiere a Sieeg Ingeniería, Boulevard Belisario Dominguez 4213 L5.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Las cookies</strong> son pequeños archivos que se colocan en su computadora, dispositivo móvil o cualquier otro dispositivo por un sitio web, que contiene los detalles de su historial de navegación en ese sitio web, entre sus muchos usos.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">País/Estado</strong> se refiere a: México.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Dispositivo</strong> significa cualquier dispositivo que pueda acceder al Servicio, tal como un ordenador, un teléfono celular o una tableta digital.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Los Datos Personales</strong> (o "Información Personal") son cualquier información que se relacione con una persona identificada o identificable. Utilizamos "Datos personales" e "Información personal" indistintamente a menos que una ley utilice un término específico.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">El servicio</strong> se refiere al sitio web.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Proveedor de servicios</strong> significa cualquier persona física o jurídica que procesa los datos en nombre de la Compañía. Se refiere a terceras empresas o personas empleadas por la Compañía para facilitar el Servicio, para proporcionar el Servicio en nombre de la Compañía, para realizar servicios relacionados con el Servicio o para ayudar a la Compañía a analizar cómo se utiliza el Servicio.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Datos de uso</strong> se refiere a los datos recopilados automáticamente, ya sea generados por el uso del Servicio o desde la propia infraestructura del Servicio (por ejemplo, la duración de una visita a la página).</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Usuario</strong> significa cualquier persona que acceda o utilice el Servicio.</p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">El sitio web</strong> se refiere a integrador sieeg, accesible desde <span style="color:#a78bfa;">https://integradores.sieeg.com.mx/</span></p>
          </div>
          <div style="padding:14px 16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:14px;line-height:1.8;color:rgba(148,163,184,0.85);margin:0;"><strong style="color:#F1F5F9;">Usted</strong> se refiere a la persona que accede o utiliza el Servicio, o la empresa, u otra entidad legal en nombre de la cual dicha persona está accediendo o utilizando el Servicio, según corresponda.</p>
          </div>
        </div>
      </section>

      <!-- Sección: Recopilación y uso -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Recopilación y uso de su información personal</h2>

        <h3 style="font-size:14px;font-weight:600;color:#a78bfa;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Tipos de datos recopilados</h3>

        <h3 style="font-size:13px;font-weight:600;color:rgba(167,139,250,0.7);letter-spacing:0.3px;text-transform:uppercase;margin:0 0 12px 0;">Datos Personales</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">
          Al usar nuestro servicio, podemos pedirle que nos proporcione cierta información de identificación personal que se puede utilizar para contactarlo o identificarlo. La información de identificación personal puede incluir, pero no se limita a:
        </p>
        <ul style="padding-left:20px;margin:0 0 14px 0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Dirección de correo electrónico</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Nombre y apellido</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Número de teléfono</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Dirección, Estado, Provincia, código postal, Ciudad</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Información de la cuenta bancaria para pagar por productos y/o servicios dentro del Servicio</li>
        </ul>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">
          Cuando usted paga por un producto y/o un servicio a través de transferencia bancaria, podemos pedirle que proporcione información personal adicional para facilitar esta transacción y verificar su identidad y cumplir con los requisitos antifraude/legales. Dicha información puede incluir, sin limitación:
        </p>
        <ul style="padding-left:20px;margin:0 0 24px 0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Fecha de nacimiento</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Pasaporte o tarjeta nacional de identidad</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Declaración de tarjeta bancaria</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Otra información que lo vincula a una dirección</li>
        </ul>

        <h3 style="font-size:13px;font-weight:600;color:rgba(167,139,250,0.7);letter-spacing:0.3px;text-transform:uppercase;margin:0 0 12px 0;">Datos de uso</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Los datos de uso se recopilan automáticamente cuando se utiliza el Servicio.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Los datos de uso pueden incluir información como la dirección del protocolo de Internet de su dispositivo (p. ej. Dirección IP), tipo de navegador, versión del navegador, las páginas de Nuestro Servicio que visita, la hora y la fecha de su visita, el tiempo dedicado a esas páginas, identificadores de dispositivo únicos y otros datos de diagnóstico.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Cuando accede al Servicio por o a través de un dispositivo móvil, podemos recopilar cierta información automáticamente, incluyendo, pero no limitado a, el tipo de dispositivo móvil que utiliza, la identificación única de su dispositivo móvil, la dirección IP de su dispositivo móvil, su sistema operativo móvil, el tipo de navegador de Internet móvil que utiliza, identificadores de dispositivo únicos y otros datos de diagnóstico.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 24px 0;">
          También podemos recopilar información que su navegador envía cada vez que visita Nuestro Servicio o cuando accede al Servicio por o a través de un dispositivo móvil.
        </p>

        <h3 style="font-size:14px;font-weight:600;color:#a78bfa;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Tecnologías de seguimiento y cookies</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">
          Utilizamos tecnologías de seguimiento (como las cookies) para realizar un seguimiento de la actividad y mejorar nuestro servicio. Las tecnologías que utilizamos pueden incluir:
        </p>
        <ul style="padding-left:20px;margin:0 0 14px 0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:12px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Cookies o Cookies del navegador.</strong> Una cookie es un pequeño archivo colocado en su dispositivo. Puede indicar a su navegador que rechace todas las cookies o que indique cuándo se envía una cookie. Sin embargo, si no acepta Cookies, es posible que no pueda utilizar algunas partes de Nuestro Servicio.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Balizas Web.</strong> Ciertas secciones de Nuestro Servicio pueden contener pequeños archivos electrónicos conocidos como web beacons (también conocidos como gifs claros, etiquetas de píxeles y gifs de un solo píxel) que permiten a la Compañía, por ejemplo, contar a los usuarios que han visitado esas páginas y para otras estadísticas de sitios web relacionadas.</li>
        </ul>

        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Las cookies pueden ser cookies "persistentes" o "de sesión". Las cookies persistentes permanecen en su computadora personal o dispositivo móvil cuando se desconecta, mientras que las cookies de sesión se eliminan tan pronto como cierra su navegador web.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 16px 0;">
          Cuando lo exija la ley, utilizamos cookies no esenciales solo con su consentimiento. Puede retirar o cambiar su consentimiento en cualquier momento utilizando la configuración de su navegador/dispositivo. El retiro del consentimiento no afecta la legalidad del procesamiento basado en el consentimiento antes de su retiro.
        </p>

        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:24px;">
          <div style="padding:16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:13px;font-weight:600;color:#a78bfa;margin:0 0 6px 0;text-transform:uppercase;letter-spacing:0.4px;">Cookies Necesarias / Esenciales</p>
            <p style="font-size:13px;color:rgba(100,116,139,0.8);margin:0 0 6px 0;">Tipo: Cookies de sesión · Administrado por: Us</p>
            <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0;">Estas Cookies son esenciales para proporcionarle los servicios disponibles a través del Sitio Web y para permitirle utilizar algunas de sus funciones. Ayudan a autenticar a los usuarios y evitan el uso fraudulento de las cuentas de usuario.</p>
          </div>
          <div style="padding:16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:13px;font-weight:600;color:#a78bfa;margin:0 0 6px 0;text-transform:uppercase;letter-spacing:0.4px;">Política de Cookies / Aviso de Aceptación</p>
            <p style="font-size:13px;color:rgba(100,116,139,0.8);margin:0 0 6px 0;">Tipo: Cookies persistentes · Administrado por: Us</p>
            <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0;">Estas cookies identifican si los usuarios han aceptado el uso de cookies en el sitio web y registran las elecciones de consentimiento que usted ha realizado, de modo que podamos honrar esas elecciones en futuras visitas.</p>
          </div>
          <div style="padding:16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:13px;font-weight:600;color:#a78bfa;margin:0 0 6px 0;text-transform:uppercase;letter-spacing:0.4px;">Cookies de funcionalidad</p>
            <p style="font-size:13px;color:rgba(100,116,139,0.8);margin:0 0 6px 0;">Tipo: Cookies persistentes · Administrado por: Us</p>
            <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0;">Estas cookies nos permiten recordar las elecciones que realiza cuando utiliza el sitio web, como recordar los datos de inicio de sesión de su cuenta o la preferencia de idioma, para proporcionarle una experiencia más personal.</p>
          </div>
        </div>

        <h3 style="font-size:14px;font-weight:600;color:#a78bfa;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Uso de sus datos personales</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">La Compañía puede utilizar los Datos Personales para los siguientes fines:</p>
        <ul style="padding-left:20px;margin:0 0 14px 0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Proporcionar y mantener nuestro servicio,</strong> incluso para monitorear el uso de nuestro servicio.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Para gestionar su cuenta:</strong> para gestionar su registro como usuario del Servicio.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Para la ejecución de un contrato:</strong> el desarrollo, cumplimiento y compromiso del contrato de compra de los productos, artículos o servicios que ha adquirido o de cualquier otro contrato con nosotros a través del Servicio.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Para ponerse en contacto con usted:</strong> por correo electrónico, llamadas telefónicas, SMS u otras formas equivalentes de comunicación electrónica con respecto a actualizaciones o comunicaciones informativas relacionadas con las funcionalidades, productos o servicios contratados.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Para proporcionarle noticias y ofertas especiales</strong> sobre otros bienes, servicios y eventos similares a los que ya ha comprado. Puede optar por no participar en cualquier momento.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Para gestionar sus solicitudes:</strong> para atender y gestionar sus solicitudes a nosotros.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Para transferencias comerciales:</strong> podemos utilizar sus datos personales para evaluar o llevar a cabo una fusión, desinversión, reestructuración, reorganización, disolución u otra venta o transferencia de algunos o todos nuestros activos.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Para otros fines:</strong> como el análisis de datos, la identificación de tendencias de uso, la determinación de la eficacia de nuestras campañas promocionales y la evaluación y mejora de nuestro servicio.</li>
        </ul>

        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">Podemos compartir sus datos personales en las siguientes situaciones:</p>
        <ul style="padding-left:20px;margin:0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Con los proveedores de servicios:</strong> para monitorear y analizar el uso de nuestro servicio, para el procesamiento de pagos y para contactarlo.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Para transferencias comerciales:</strong> podemos compartir o transferir sus datos personales en relación con cualquier fusión, venta de activos de la Compañía, financiación o adquisición de la totalidad o una parte de nuestro negocio.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Con los afiliados:</strong> podemos compartir sus datos personales con nuestros afiliados, en cuyo caso requeriremos que esos afiliados cumplan con esta Política de privacidad.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:10px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Con otros usuarios:</strong> si nuestro servicio ofrece áreas públicas, cuando comparte datos personales o interactúa en las áreas públicas con otros usuarios, dicha información puede ser vista por todos los usuarios.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Con su consentimiento:</strong> podemos divulgar sus datos personales para cualquier otro propósito con su consentimiento.</li>
        </ul>
      </section>

      <!-- Sección: Mensajes de texto -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Mensajes de texto — Aviso de privacidad</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Usted tiene la opción de recibir mensajes de texto (SMS) de nosotros. Si opta por enviar mensajes de texto, le enviaremos actualizaciones, notificaciones y otras comunicaciones. Recopilaremos y almacenaremos la información que proporcione en relación con los mensajes de texto, como su número de teléfono, la fecha y el método de su consentimiento, y la entrega de mensajes y la información de lectura.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Ninguna información móvil será compartida o vendida a terceros o afiliados con fines de marketing o promocionales. Los números de teléfono y los registros de consentimiento que recopilamos para enviar mensajes de texto nunca se comparten con nadie para ningún propósito, excepto los Proveedores de Servicios que técnicamente tienen que manejarlos para entregar los textos.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">
          El consentimiento para recibir mensajes de texto no es una condición de ninguna compra o uso de nuestro Servicio. Si Usted consiente recibir SMS de Nosotros, Usted acepta recibir mensajes de texto relacionados con:
        </p>
        <ul style="padding-left:20px;margin:0 0 14px 0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Atención al cliente y soporte</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Notificaciones de cuenta, como recordatorios de actividad, estado o renovación</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Notificaciones de entrega y actualizaciones sobre el estado de una entrega</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Mensajes de autenticación, como contraseñas de una sola vez (OTP) y códigos de acceso</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Alertas de seguridad, como intentos sospechosos de inicio de sesión o actividad inusual de la cuenta</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Ofertas de marketing y promoción, descuentos y otros contenidos promocionales</li>
        </ul>
        <p style="font-size:13px;line-height:1.75;color:rgba(100,116,139,0.75);margin:0;">
          Responda STOP para optar por no participar. Responder AYUDA para soporte. Se pueden aplicar tarifas de mensajes y datos. La frecuencia de mensajería puede variar. Los transportistas no son responsables de los mensajes retrasados o no entregados.
        </p>
      </section>

      <!-- Sección: Retención -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Retención de sus datos personales</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          La Compañía conservará Sus Datos Personales solo durante el tiempo que sea necesario para los fines establecidos en esta Política de Privacidad. Conservaremos y utilizaremos sus datos personales en la medida necesaria para cumplir con nuestras obligaciones legales, resolver disputas y hacer cumplir nuestros acuerdos y políticas legales.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 16px 0;">
          Cuando sea posible, aplicamos períodos de retención más cortos y/o reducimos la identificabilidad mediante la eliminación, agregación o anonimización de datos. Los períodos de retención a continuación son los períodos máximos:
        </p>

        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;">
          <div style="padding:16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:13px;font-weight:600;color:#a78bfa;margin:0 0 8px 0;">Información de la cuenta</p>
            <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0;">Cuentas de usuario: se conservan durante la duración de la relación de su cuenta más hasta <strong style="color:#F1F5F9;">24 meses</strong> después del cierre de la cuenta.</p>
          </div>
          <div style="padding:16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:13px;font-weight:600;color:#a78bfa;margin:0 0 8px 0;">Datos de soporte al cliente</p>
            <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0 0 6px 0;">Tickets de soporte y correspondencia: hasta <strong style="color:#F1F5F9;">24 meses</strong> a partir de la fecha de cierre.</p>
            <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0;">Transcripciones de chat: hasta <strong style="color:#F1F5F9;">24 meses</strong> para fines de garantía de calidad.</p>
          </div>
          <div style="padding:16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:13px;font-weight:600;color:#a78bfa;margin:0 0 8px 0;">Datos de uso</p>
            <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0 0 6px 0;">Datos de análisis de sitios web (cookies, direcciones IP, identificadores de dispositivo): hasta <strong style="color:#F1F5F9;">24 meses</strong> a partir de la fecha de recopilación.</p>
            <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0;">Registros de servidores (direcciones IP, tiempos de acceso): hasta <strong style="color:#F1F5F9;">24 meses</strong> para monitoreo de seguridad.</p>
          </div>
          <div style="padding:16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
            <p style="font-size:13px;font-weight:600;color:#a78bfa;margin:0 0 8px 0;">Datos Financieros y de Transacción</p>
            <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0 0 6px 0;">Los datos de la tarjeta de crédito/débito no se almacenan en nuestros servidores; son procesados por nuestros proveedores de servicios de pago. Conservamos los registros de transacciones por hasta <strong style="color:#F1F5F9;">10 años</strong> para cumplir con las leyes fiscales y las regulaciones financieras.</p>
            <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0;">Registros de facturación y facturas: hasta <strong style="color:#F1F5F9;">10 años</strong> para cumplir con los requisitos contables y de cumplimiento tributario.</p>
          </div>
        </div>

        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">
          Podemos conservar los Datos Personales más allá de los períodos mencionados anteriormente por diferentes razones:
        </p>
        <ul style="padding-left:20px;margin:0 0 14px 0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Obligación legal:</strong> estamos obligados por ley a conservar datos específicos.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Reclamaciones legales:</strong> los datos son necesarios para establecer, ejercer o defender reclamaciones legales.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Su petición explícita:</strong> usted nos pide que conservemos información específica.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Limitaciones técnicas:</strong> existen datos en sistemas de copia de seguridad programados para eliminación de rutina.</li>
        </ul>

        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">
          Cuando expiran los períodos de retención, eliminamos o anonimizamos de forma segura los Datos Personales de acuerdo con los siguientes procedimientos:
        </p>
        <ul style="padding-left:20px;margin:0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Supresión:</strong> los datos personales se eliminan de nuestros sistemas y ya no se procesan activamente.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Retención de copia de seguridad:</strong> las copias residuales pueden permanecer en copias de seguridad cifradas durante un período limitado y no se restauran, excepto cuando sea necesario para la seguridad o el cumplimiento legal.</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span><strong style="color:#F1F5F9;">Anonimización:</strong> en algunos casos, convertimos los Datos personales en datos estadísticos anónimos que no pueden vincularse a usted. Estos datos anónimos pueden ser retenidos indefinidamente para investigación y análisis.</li>
        </ul>
      </section>

      <!-- Sección: Transferencia -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Transferencia de sus datos personales</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Su información, incluidos los Datos Personales, se procesa en las oficinas operativas de la Compañía y en cualquier otro lugar donde se encuentren las partes involucradas en el procesamiento. Esto significa que esta información puede ser transferida y mantenida en computadoras ubicadas fuera de su estado, provincia, país u otra jurisdicción gubernamental donde las leyes de protección de datos pueden diferir de las de su jurisdicción.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Cuando lo exija la ley aplicable, nos aseguraremos de que las transferencias internacionales de sus datos personales estén sujetas a las salvaguardias adecuadas. La Compañía tomará todas las medidas razonablemente necesarias para garantizar que sus datos se traten de manera segura y de acuerdo con esta Política de privacidad y no se realizará ninguna transferencia de sus datos personales a una organización o país a menos que haya controles adecuados.
        </p>
      </section>

      <!-- Sección: Borrar datos -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Borrar sus datos personales</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Usted tiene el derecho de eliminar o solicitar que ayudemos a eliminar los Datos personales que hemos recopilado sobre usted.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Nuestro Servicio puede darle la posibilidad de eliminar cierta información sobre Usted desde dentro del Servicio. Puede actualizar, modificar o eliminar su información en cualquier momento iniciando sesión en su cuenta y visitando la sección de configuración de la cuenta que le permite administrar su información personal.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          También puede ponerse en contacto con nosotros para solicitar el acceso, corregir o eliminar cualquier dato personal que nos haya proporcionado. Tenga en cuenta, sin embargo, que es posible que necesitemos retener cierta información cuando tenemos una obligación legal o una base legal para hacerlo.
        </p>
      </section>

      <!-- Sección: Divulgación -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Divulgación de sus datos personales</h2>

        <h3 style="font-size:14px;font-weight:600;color:#a78bfa;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Transacciones de negocios</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 24px 0;">
          Si la Compañía está involucrada en una fusión, adquisición o venta de activos, sus datos personales pueden ser transferidos. Proporcionaremos un aviso antes de que sus datos personales se transfieran y se sometan a una política de privacidad diferente.
        </p>

        <h3 style="font-size:14px;font-weight:600;color:#a78bfa;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Aplicación de la ley</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 24px 0;">
          Bajo ciertas circunstancias, la Compañía puede divulgar sus Datos Personales si así lo exige la ley o en respuesta a solicitudes válidas de las autoridades públicas (por ejemplo, un tribunal o una agencia gubernamental).
        </p>

        <h3 style="font-size:14px;font-weight:600;color:#a78bfa;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Otros requisitos legales</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 12px 0;">
          La Compañía puede divulgar sus datos personales en la creencia de buena fe de que dicha acción es necesaria para:
        </p>
        <ul style="padding-left:20px;margin:0;list-style:none;">
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Cumplir con una obligación legal</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Proteger y defender los derechos o bienes de la Compañía</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Prevenir o investigar posibles irregularidades en relación con el Servicio</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin-bottom:8px;padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Proteger la seguridad personal de los Usuarios del Servicio o del público</li>
          <li style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);padding-left:12px;position:relative;"><span style="position:absolute;left:0;color:#a78bfa;">—</span>Proteger contra la responsabilidad legal</li>
        </ul>
      </section>

      <!-- Sección: Seguridad -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Seguridad de sus datos personales</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          La seguridad de sus datos personales es importante para nosotros, pero recuerde que ningún método de transmisión a través de Internet, o método de almacenamiento electrónico, es 100% seguro. Si bien nos esforzamos por utilizar medios comercialmente razonables para proteger sus datos personales, no podemos garantizar su seguridad absoluta.
        </p>
      </section>

      <!-- Sección: Proveedores de servicio (Pagos) -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Información detallada sobre el tratamiento de sus datos personales</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 24px 0;">
          Los Proveedores de servicios que utilizamos pueden tener acceso a sus datos personales. Estos proveedores externos recopilan, almacenan, utilizan, procesan y transfieren información sobre su actividad en nuestro servicio de acuerdo con sus Políticas de privacidad.
        </p>

        <h3 style="font-size:14px;font-weight:600;color:#a78bfa;letter-spacing:0.5px;text-transform:uppercase;margin:0 0 12px 0;">Pagos</h3>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Podemos proporcionar productos y/o servicios de pago dentro del Servicio. En ese caso, podemos utilizar servicios de terceros para el procesamiento de pagos.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          No almacenaremos ni recogeremos los datos de su tarjeta de pago. Esa información se proporciona directamente a nuestros procesadores de pagos de terceros cuyo uso de su información personal se rige por su Política de privacidad. Estos procesadores de pagos se adhieren a los estándares establecidos por PCI-DSS según lo gestionado por el PCI Security Standards Council.
        </p>
        <div style="padding:16px;background:rgba(124,58,237,0.04);border:1px solid rgba(124,58,237,0.12);border-radius:10px;">
          <p style="font-size:13px;font-weight:600;color:#a78bfa;margin:0 0 6px 0;">OpenPay</p>
          <p style="font-size:14px;line-height:1.75;color:rgba(148,163,184,0.85);margin:0;">Su Política de Privacidad se puede ver en <span style="color:#a78bfa;">https://www.openpay.mx/aviso-privacidad</span></p>
        </div>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:14px 0 0 0;">
          Cuando usted paga por un producto y/o servicio a través de transferencia bancaria, podemos pedirle que proporcione información para facilitar esta transacción y verificar su identidad.
        </p>
      </section>

      <!-- Sección: Privacidad de menores -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Privacidad de los niños y menores</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          El Servicio no está dirigido a, y no recopilamos a sabiendas Información Personal de, cualquier persona menor de 16 años.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Si usted es un padre o tutor y cree que su hijo nos ha proporcionado información personal, póngase en contacto con nosotros. Si tenemos conocimiento de que hemos recopilado información personal de cualquier persona menor de 16 años, tomaremos medidas para eliminar esa información de nuestros servidores tan pronto como sea razonablemente posible.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Algunos países y estados establecen una edad más alta en la que un individuo puede dar su consentimiento para el procesamiento de su propia información personal. Cuando confiamos en el consentimiento como base legal y la ley aplicable a un Usuario establece una edad superior a 16 años, podemos requerir el consentimiento del padre o tutor de ese Usuario antes de recopilar y utilizar su Información personal.
        </p>
      </section>

      <!-- Sección: Enlaces a otros sitios -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Enlaces a otros sitios web</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Nuestro Servicio puede contener enlaces a otros sitios web que no son operados por nosotros. Si hace clic en un enlace de terceros, se le dirigirá al sitio de ese tercero. Le recomendamos encarecidamente que revise la Política de privacidad de cada sitio que visite.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          No tenemos control sobre y no asumimos ninguna responsabilidad por el contenido, las políticas de privacidad o las prácticas de cualquier sitio o servicio de terceros.
        </p>
      </section>

      <!-- Sección: Cambios -->
      <section style="margin-bottom:44px;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Cambios a esta Política de Privacidad</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Podemos actualizar nuestra política de privacidad de vez en cuando. Le notificaremos de cualquier cambio mediante la publicación de la nueva Política de privacidad en esta página.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 14px 0;">
          Le informaremos por correo electrónico y/o un aviso destacado en Nuestro Servicio, antes de que el cambio entre en vigencia y actualizaremos la fecha de "Última actualización" en la parte superior de esta Política de privacidad.
        </p>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0;">
          Se le recomienda que revise esta Política de privacidad periódicamente para cualquier cambio. Los cambios a esta Política de privacidad son efectivos cuando se publican en esta página.
        </p>
      </section>

      <!-- Sección: Contáctenos -->
      <section style="margin-bottom:0;">
        <h2 style="font-size:20px;font-weight:700;color:#F1F5F9;letter-spacing:-0.4px;margin:0 0 20px 0;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);">Contáctenos</h2>
        <p style="font-size:15px;line-height:1.85;color:rgba(148,163,184,0.85);margin:0 0 16px 0;">
          Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos:
        </p>
        <div style="display:inline-flex;align-items:center;gap:10px;padding:14px 20px;background:rgba(124,58,237,0.06);border:1px solid rgba(124,58,237,0.18);border-radius:10px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <a href="mailto:contacto@sieeg.com.mx" style="font-size:14px;color:#a78bfa;text-decoration:none;font-weight:500;">contacto@sieeg.com.mx</a>
        </div>
      </section>

    </main>

    <!-- FOOTER -->
    <footer style="border-top:1px solid rgba(255,255,255,0.06);padding:28px 24px;">
      <div style="max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
        <span style="font-size:12px;color:rgba(71,85,105,0.6);">© {{ new Date().getFullYear() }} SIEEG INTEGRADORES. Todos los derechos reservados.</span>
        <div style="display:flex;gap:16px;">
          <NuxtLink to="/terminos" style="font-size:12px;color:rgba(71,85,105,0.7);text-decoration:none;transition:color 0.2s;"
            @mouseenter="e => (e.currentTarget as HTMLElement).style.color='rgba(148,163,184,0.9)'"
            @mouseleave="e => (e.currentTarget as HTMLElement).style.color='rgba(71,85,105,0.7)'">
            Términos y Condiciones
          </NuxtLink>
          <NuxtLink to="/privacidad" style="font-size:12px;color:#a78bfa;text-decoration:none;">Políticas de Privacidad</NuxtLink>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing' })
</script>
