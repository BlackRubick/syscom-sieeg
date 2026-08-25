<template>
  <div style="min-height:100vh;background:#040C1A;font-family:'Inter',system-ui,sans-serif;color:#F1F5F9;overflow-x:hidden;">

    <!-- ───────────── NAVBAR ───────────── -->
    <nav :style="navStyle">
      <div style="width:100%;max-width:1200px;margin:0 auto;padding:0 24px;display:flex;align-items:center;gap:20px;">

        <NuxtLink to="/" style="display:flex;align-items:center;gap:10px;flex-shrink:0;text-decoration:none;">
          <span style="font-size:15px;font-weight:700;color:#F1F5F9;letter-spacing:-0.3px;">SIEEG <span style="color:#0EA5E9;">INTEGRADORES</span></span>
        </NuxtLink>

        <div class="nav-links" style="display:flex;gap:4px;margin-left:32px;">
          <a v-for="link in navLinks" :key="link.id" :href="'#' + link.id"
            @click.prevent="scrollTo(link.id)"
            style="padding:7px 14px;border-radius:8px;font-size:13px;font-weight:500;color:rgba(148,163,184,0.9);transition:all 0.2s;cursor:pointer;text-decoration:none;"
            @mouseenter="e => { (e.currentTarget as HTMLElement).style.color='#F1F5F9'; (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)'; }"
            @mouseleave="e => { (e.currentTarget as HTMLElement).style.color='rgba(148,163,184,0.9)'; (e.currentTarget as HTMLElement).style.background='transparent'; }">
            {{ link.label }}
          </a>
        </div>

        <div style="margin-left:auto;display:flex;align-items:center;gap:10px;">
          <a href="#contacto" @click.prevent="scrollTo('contacto')"
            class="hide-mobile"
            style="padding:8px 16px;border-radius:9px;font-size:13px;font-weight:500;color:rgba(148,163,184,0.9);border:1px solid rgba(255,255,255,0.1);background:transparent;cursor:pointer;text-decoration:none;transition:all 0.2s;"
            @mouseenter="e => { (e.currentTarget as HTMLElement).style.color='#F1F5F9'; (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)'; }"
            @mouseleave="e => { (e.currentTarget as HTMLElement).style.color='rgba(148,163,184,0.9)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.background='transparent'; }">
            Quiero comprar
          </a>
          <NuxtLink to="/login"
            style="display:flex;align-items:center;gap:7px;padding:8px 18px;border-radius:9px;font-size:13px;font-weight:600;color:white;background:linear-gradient(135deg,#0EA5E9,#0284C7);border:none;cursor:pointer;text-decoration:none;box-shadow:0 3px 14px rgba(14,165,233,0.3);transition:all 0.2s;"
            @mouseenter="e => (e.currentTarget as HTMLElement).style.boxShadow='0 6px 20px rgba(14,165,233,0.45)'"
            @mouseleave="e => (e.currentTarget as HTMLElement).style.boxShadow='0 3px 14px rgba(14,165,233,0.3)'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>
            </svg>
            Iniciar sesión
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- ───────────── HERO ───────────── -->
    <section id="inicio" ref="heroRef" style="position:relative;min-height:100vh;display:flex;align-items:center;padding:100px 24px 80px;overflow:hidden;"
      @mousemove="handleMouseMove">

      <!-- Orbs animados -->
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="orb orb-3" />

      <!-- Mouse glow -->
      <div :style="{ position:'absolute', inset:0, background:`radial-gradient(700px circle at ${mouseX}% ${mouseY}%, rgba(14,165,233,0.07) 0%, transparent 60%)`, pointerEvents:'none', transition:'background 0.1s' }" />

      <!-- Dot grid -->
      <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px);background-size:32px 32px;pointer-events:none;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);" />

      <!-- Línea horizontal decorativa -->
      <div class="hero-line-h" />

      <div style="position:relative;z-index:1;max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;" class="hero-grid">

        <!-- ── Columna izquierda: texto ── -->
        <div>
          <!-- Badge -->
          <div class="hero-badge">
            <span class="badge-dot" />
            DISTRIBUCIÓN B2B · MÉXICO
          </div>

          <!-- Headline -->
          <h1 class="hero-h1">
            Tu empresa merece<br />
            <span style="position:relative;display:inline-block;">
              <span class="hero-gradient-text" :style="{ opacity: wordVisible ? 1 : 0, transform: wordVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.35s ease, transform 0.35s ease', display:'inline-block' }">{{ currentWord }}</span>
              <span class="word-underline" />
            </span>
            <br />de primera calidad
          </h1>

          <!-- Subtitle -->
          <p class="hero-sub">
            Somos distribuidores especializados en tecnología para empresas.
            Catálogo completo, <span style="color:#38bdf8;font-weight:500;">precios preferenciales</span>
            y facturación CFDI inmediata.
          </p>

          <!-- CTAs -->
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:36px;">
            <a href="#contacto" @click.prevent="scrollTo('contacto')" class="btn-primary-hero">
              Quiero comprar con ustedes
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
            <NuxtLink to="/login" class="btn-ghost-hero">
              Ya soy cliente
            </NuxtLink>
          </div>

          <!-- Trust marks -->
          <div style="display:flex;gap:20px;flex-wrap:wrap;">
            <div v-for="t in trustMarks" :key="t" style="display:flex;align-items:center;gap:7px;font-size:12px;color:rgba(148,163,184,0.7);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              {{ t }}
            </div>
          </div>
        </div>

        <!-- ── Columna derecha: panel visual ── -->
        <div style="position:relative;display:flex;justify-content:center;align-items:center;" class="hero-visual">

          <!-- Glow detrás del panel -->
          <div style="position:absolute;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(14,165,233,0.18) 0%,rgba(124,58,237,0.12) 50%,transparent 70%);filter:blur(40px);pointer-events:none;" />

          <!-- Panel principal flotante -->
          <div class="floating-panel">
            <!-- Header del panel -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.07);">
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 6px #34d399;" />
                <span style="font-size:12px;font-weight:600;color:rgba(148,163,184,0.85);">Catálogo disponible</span>
              </div>
              <span style="font-size:11px;color:rgba(100,116,139,0.7);background:rgba(255,255,255,0.05);padding:3px 8px;border-radius:20px;border:1px solid rgba(255,255,255,0.08);">+5,000 SKUs</span>
            </div>

            <!-- Grid de categorías dentro del panel -->
            <div style="padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div v-for="item in panelItems" :key="item.name" class="panel-item">
                <div :style="{ width:'32px', height:'32px', borderRadius:'9px', background:item.gradient, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 12px ${item.glow}` }">
                  <span v-html="item.icon" />
                </div>
                <div>
                  <div style="font-size:12px;font-weight:600;color:#E2E8F0;line-height:1.3;">{{ item.name }}</div>
                  <div style="font-size:10px;color:rgba(100,116,139,0.75);margin-top:1px;">{{ item.sub }}</div>
                </div>
              </div>
            </div>

            <!-- Footer del panel -->
            <div style="padding:12px 18px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;">
              <span style="font-size:11px;color:rgba(100,116,139,0.7);">Precios desde</span>
              <span style="font-size:14px;font-weight:700;color:#F1F5F9;">Consultar <span style="color:#38bdf8;">→</span></span>
            </div>
          </div>

          <!-- Badge flotante: entrega -->
          <div class="float-badge float-badge-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span style="font-size:12px;font-weight:600;color:#F1F5F9;">Factura CFDI incluida</span>
          </div>

          <!-- Badge flotante: precio -->
          <div class="float-badge float-badge-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span style="font-size:12px;font-weight:600;color:#F1F5F9;">Precio preferencial</span>
          </div>

        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="scroll-indicator" @click="scrollTo('productos')">
        <div class="scroll-dot" />
      </div>
    </section>

    <!-- ───────────── QUÉ VENDEMOS ───────────── -->
    <section id="productos" style="padding:80px 24px;background:rgba(13,27,53,0.3);">
      <div style="max-width:1100px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:52px;">
          <div style="font-size:12px;font-weight:600;color:#38bdf8;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">Nuestros productos</div>
          <h2 style="font-size:clamp(26px,3.5vw,38px);font-weight:800;color:#F1F5F9;letter-spacing:-0.5px;margin-bottom:12px;">¿Qué puedes comprar con nosotros?</h2>
          <p style="font-size:15px;color:rgba(148,163,184,0.8);max-width:500px;margin:0 auto;">Manejamos un amplio catálogo de productos tecnológicos para todo tipo de empresa.</p>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">
          <div v-for="cat in categories" :key="cat.name"
            style="padding:26px 22px;border-radius:16px;background:linear-gradient(145deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;gap:14px;transition:transform 0.2s,border-color 0.2s,box-shadow 0.2s;cursor:default;"
            @mouseenter="e => { (e.currentTarget as HTMLElement).style.transform='translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(14,165,233,0.25)'; (e.currentTarget as HTMLElement).style.boxShadow='0 10px 32px rgba(14,165,233,0.08)'; }"
            @mouseleave="e => { (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.boxShadow='none'; }">
            <div :style="{ width:'44px', height:'44px', borderRadius:'11px', background:cat.gradient, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 14px ${cat.glow}` }">
              <span v-html="cat.icon" />
            </div>
            <div>
              <div style="font-size:15px;font-weight:700;color:#F1F5F9;margin-bottom:6px;">{{ cat.name }}</div>
              <div style="font-size:13px;color:rgba(148,163,184,0.75);line-height:1.6;">{{ cat.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────── POR QUÉ ELEGIRNOS ───────────── -->
    <section id="nosotros" style="padding:80px 24px;">
      <div style="max-width:1000px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:52px;">
          <div style="font-size:12px;font-weight:600;color:#38bdf8;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">Por qué elegirnos</div>
          <h2 style="font-size:clamp(26px,3.5vw,38px);font-weight:800;color:#F1F5F9;letter-spacing:-0.5px;">Lo que nos diferencia</h2>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;">
          <div v-for="b in benefits" :key="b.title" style="display:flex;flex-direction:column;align-items:flex-start;gap:12px;">
            <div :style="{ width:'42px', height:'42px', borderRadius:'11px', background:b.bg, border:b.border, display:'flex', alignItems:'center', justifyContent:'center' }">
              <span v-html="b.icon" />
            </div>
            <div>
              <div style="font-size:15px;font-weight:700;color:#F1F5F9;margin-bottom:5px;">{{ b.title }}</div>
              <div style="font-size:13px;color:rgba(148,163,184,0.78);line-height:1.65;">{{ b.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────── CONTACTO ───────────── -->
    <section id="contacto" style="padding:80px 24px 100px;background:rgba(13,27,53,0.3);">
      <div style="max-width:1100px;margin:0 auto;">

        <!-- Encabezado centrado -->
        <div style="text-align:center;margin-bottom:52px;">
          <div style="font-size:12px;font-weight:600;color:#38bdf8;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">Contáctanos</div>
          <h2 style="font-size:clamp(26px,3.5vw,38px);font-weight:800;color:#F1F5F9;letter-spacing:-0.5px;margin-bottom:12px;">Estamos para atenderte</h2>
          <p style="font-size:14px;color:rgba(148,163,184,0.8);line-height:1.65;max-width:480px;margin:0 auto;">
            Visítanos, llámanos o escríbenos. También puedes dejarnos tus datos y te contactamos a la brevedad.
          </p>
        </div>

        <!-- Grid dos columnas -->
        <div class="contact-grid">

          <!-- ── Columna izquierda: info de contacto ── -->
          <div style="display:flex;flex-direction:column;gap:16px;">

            <!-- Tarjeta: Visítanos -->
            <div style="padding:24px;border-radius:18px;background:linear-gradient(145deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
                <div style="width:38px;height:38px;border-radius:10px;background:rgba(14,165,233,0.12);border:1px solid rgba(14,165,233,0.22);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div style="font-size:14px;font-weight:700;color:#F1F5F9;">Visítanos</div>
              </div>
              <p style="font-size:13px;color:rgba(148,163,184,0.85);line-height:1.7;margin:0;">
                Boulevard Belisario Domínguez #4213 L5<br/>
                Tuxtla Gutiérrez, Chiapas
              </p>
            </div>

            <!-- Tarjeta: Horario -->
            <div style="padding:24px;border-radius:18px;background:linear-gradient(145deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
                <div style="width:38px;height:38px;border-radius:10px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div style="font-size:14px;font-weight:700;color:#F1F5F9;">Horario comercial</div>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
                  <span style="font-size:12px;color:rgba(100,116,139,0.8);">Lunes – Viernes</span>
                  <span style="font-size:12px;font-weight:600;color:#fbbf24;">07:00 – 20:00 hrs</span>
                </div>
                <div style="height:1px;background:rgba(255,255,255,0.05);" />
                <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
                  <span style="font-size:12px;color:rgba(100,116,139,0.8);">Sábados</span>
                  <span style="font-size:12px;font-weight:600;color:#fbbf24;">07:00 – 17:00 hrs</span>
                </div>
              </div>
            </div>

            <!-- Tarjeta: Teléfono y correo -->
            <div style="padding:24px;border-radius:18px;background:linear-gradient(145deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;gap:16px;">
              <!-- Teléfono -->
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:38px;height:38px;border-radius:10px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <div style="font-size:11px;color:rgba(100,116,139,0.7);font-weight:500;margin-bottom:2px;">Teléfono</div>
                  <a href="tel:9611180157" style="font-size:15px;font-weight:700;color:#34d399;text-decoration:none;letter-spacing:0.3px;">961 118 0157</a>
                </div>
              </div>
              <div style="height:1px;background:rgba(255,255,255,0.05);" />
              <!-- Correo -->
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:38px;height:38px;border-radius:10px;background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>
                  </svg>
                </div>
                <div>
                  <div style="font-size:11px;color:rgba(100,116,139,0.7);font-weight:500;margin-bottom:2px;">Correo electrónico</div>
                  <a href="mailto:contacto@sieeg.com.mx" style="font-size:13px;font-weight:600;color:#a78bfa;text-decoration:none;">contacto@sieeg.com.mx</a>
                </div>
              </div>
            </div>

          </div>

          <!-- ── Columna derecha: formulario ── -->
          <div>
            <div style="position:relative;">
              <div style="position:absolute;inset:-1px;border-radius:22px;background:linear-gradient(135deg,rgba(14,165,233,0.35) 0%,rgba(124,58,237,0.2) 60%,rgba(14,165,233,0.1) 100%);z-index:0;" />
              <div style="position:relative;z-index:1;border-radius:22px;background:linear-gradient(160deg,#0D1B35,#09122A);padding:36px 32px;box-shadow:0 24px 64px rgba(0,0,0,0.6);">

                <div style="font-size:15px;font-weight:700;color:#F1F5F9;margin-bottom:6px;">¿Listo para comprar con nosotros?</div>
                <p style="font-size:13px;color:rgba(148,163,184,0.7);margin-bottom:24px;line-height:1.6;">Déjanos tus datos y te contactamos para darte acceso con precios exclusivos.</p>

                <Transition name="fade">
                  <div v-if="requestSent" style="text-align:center;padding:20px 0;">
                    <div style="width:64px;height:64px;border-radius:50%;background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <h3 style="font-size:20px;font-weight:700;color:#F1F5F9;margin-bottom:10px;">¡Mensaje recibido!</h3>
                    <p style="font-size:14px;color:rgba(148,163,184,0.85);line-height:1.65;margin-bottom:24px;">
                      Gracias por tu interés. Nos pondremos en contacto contigo a la brevedad.
                    </p>
                    <button @click="requestSent = false; resetForm()"
                      style="padding:10px 24px;border-radius:9px;font-size:13px;font-weight:600;color:#0EA5E9;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);cursor:pointer;font-family:inherit;">
                      Enviar otra solicitud
                    </button>
                  </div>
                </Transition>

                <Transition name="fade">
                  <form v-if="!requestSent" @submit.prevent="handleRequest" style="display:flex;flex-direction:column;gap:16px;">

                    <div>
                      <label style="display:block;font-size:12px;font-weight:500;color:rgba(148,163,184,0.9);margin-bottom:7px;">Nombre completo *</label>
                      <div :style="fieldWrap(nameFocus)">
                        <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;" width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="nameFocus?'#0EA5E9':'rgba(100,116,139,0.7)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        <input v-model="form.name" type="text" placeholder="Juan García" required
                          @focus="nameFocus=true" @blur="nameFocus=false"
                          style="width:100%;height:46px;background:transparent;border:none;outline:none;padding-left:40px;padding-right:14px;font-size:14px;color:#F1F5F9;box-sizing:border-box;font-family:inherit;" />
                      </div>
                    </div>

                    <div>
                      <label style="display:block;font-size:12px;font-weight:500;color:rgba(148,163,184,0.9);margin-bottom:7px;">Correo electrónico *</label>
                      <div :style="fieldWrap(emailFocus)">
                        <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;" width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="emailFocus?'#0EA5E9':'rgba(100,116,139,0.7)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>
                        </svg>
                        <input v-model="form.email" type="email" placeholder="juan@miempresa.com" required
                          @focus="emailFocus=true" @blur="emailFocus=false"
                          style="width:100%;height:46px;background:transparent;border:none;outline:none;padding-left:40px;padding-right:14px;font-size:14px;color:#F1F5F9;box-sizing:border-box;font-family:inherit;" />
                      </div>
                    </div>

                    <div>
                      <label style="display:block;font-size:12px;font-weight:500;color:rgba(148,163,184,0.9);margin-bottom:7px;">Empresa</label>
                      <div :style="fieldWrap(companyFocus)">
                        <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;" width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="companyFocus?'#0EA5E9':'rgba(100,116,139,0.7)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        <input v-model="form.company" type="text" placeholder="Mi Empresa S.A. de C.V."
                          @focus="companyFocus=true" @blur="companyFocus=false"
                          style="width:100%;height:46px;background:transparent;border:none;outline:none;padding-left:40px;padding-right:14px;font-size:14px;color:#F1F5F9;box-sizing:border-box;font-family:inherit;" />
                      </div>
                    </div>

                    <div>
                      <label style="display:block;font-size:12px;font-weight:500;color:rgba(148,163,184,0.9);margin-bottom:7px;">Teléfono</label>
                      <div :style="fieldWrap(phoneFocus)">
                        <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;" width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="phoneFocus?'#0EA5E9':'rgba(100,116,139,0.7)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <input v-model="form.phone" type="tel" placeholder="+52 55 0000 0000"
                          @focus="phoneFocus=true" @blur="phoneFocus=false"
                          style="width:100%;height:46px;background:transparent;border:none;outline:none;padding-left:40px;padding-right:14px;font-size:14px;color:#F1F5F9;box-sizing:border-box;font-family:inherit;" />
                      </div>
                    </div>

                    <Transition name="fade">
                      <div v-if="reqError" style="padding:10px 14px;border-radius:10px;background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.25);font-size:13px;color:#fb7185;">
                        {{ reqError }}
                      </div>
                    </Transition>

                    <button type="submit" :disabled="reqLoading"
                      style="margin-top:4px;height:50px;border-radius:12px;border:none;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;box-shadow:0 4px 20px rgba(14,165,233,0.35);transition:all 0.2s;"
                      :style="{ opacity: reqLoading ? 0.8 : 1, cursor: reqLoading ? 'not-allowed' : 'pointer' }">
                      <div v-if="reqLoading" style="display:flex;align-items:center;gap:10px;">
                        <svg class="spin" style="width:15px;height:15px;" fill="none" viewBox="0 0 24 24">
                          <circle style="opacity:0.3" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                          <path style="opacity:0.9" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Enviando...
                      </div>
                      <div v-else style="display:flex;align-items:center;gap:8px;">
                        Quiero ser cliente
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </div>
                    </button>

                    <p style="text-align:center;font-size:11px;color:rgba(71,85,105,0.85);margin-top:2px;">
                      Nos pondremos en contacto contigo en menos de 24 horas.
                    </p>
                  </form>
                </Transition>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ───────────── FOOTER ───────────── -->
    <footer style="padding:36px 24px 28px;border-top:1px solid rgba(255,255,255,0.06);">
      <div style="max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="/logosieeg.jpg" alt="SIEEG" style="height:28px;width:28px;object-fit:contain;border-radius:6px;opacity:0.75;" />
          <span style="font-size:13px;font-weight:600;color:rgba(148,163,184,0.55);">SIEEG INTEGRADORES</span>
        </div>
        <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
          <NuxtLink to="/terminos" style="font-size:12px;color:rgba(71,85,105,0.75);text-decoration:none;transition:color 0.2s;"
            @mouseenter="e => (e.currentTarget as HTMLElement).style.color='rgba(148,163,184,0.9)'"
            @mouseleave="e => (e.currentTarget as HTMLElement).style.color='rgba(71,85,105,0.75)'">
            Términos y Condiciones
          </NuxtLink>
          <NuxtLink to="/privacidad" style="font-size:12px;color:rgba(71,85,105,0.75);text-decoration:none;transition:color 0.2s;"
            @mouseenter="e => (e.currentTarget as HTMLElement).style.color='rgba(148,163,184,0.9)'"
            @mouseleave="e => (e.currentTarget as HTMLElement).style.color='rgba(71,85,105,0.75)'">
            Políticas de Privacidad
          </NuxtLink>
          <p style="font-size:12px;color:rgba(71,85,105,0.7);margin:0;">© {{ new Date().getFullYear() }} SIEEG INTEGRADORES. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing', middleware: 'redirect-authenticated' })

const navLinks = [
  { id: 'inicio',    label: 'Inicio' },
  { id: 'productos', label: 'Productos' },
  { id: 'nosotros',  label: 'Nosotros' },
  { id: 'contacto',  label: 'Contacto' },
]

// ── Texto ciclante del hero ──
const heroRef = ref<HTMLElement | null>(null)
const cycleWords = ['cómputo', 'redes', 'servidores', 'periféricos', 'seguridad']
const wordIndex  = ref(0)
const wordVisible = ref(true)
const currentWord = computed(() => cycleWords[wordIndex.value])

let cycleInterval: ReturnType<typeof setInterval>
onMounted(() => {
  cycleInterval = setInterval(() => {
    wordVisible.value = false
    setTimeout(() => {
      wordIndex.value = (wordIndex.value + 1) % cycleWords.length
      wordVisible.value = true
    }, 380)
  }, 2600)
})
onUnmounted(() => clearInterval(cycleInterval))

// ── Mouse glow ──
const mouseX = ref(50)
const mouseY = ref(50)
function handleMouseMove(e: MouseEvent) {
  const rect = heroRef.value?.getBoundingClientRect()
  if (!rect) return
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100
  mouseY.value = ((e.clientY - rect.top)  / rect.height) * 100
}

// ── Panel items ──
const panelItems = [
  { name: 'Cómputo',     sub: 'Laptops · Desktops', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>', gradient:'linear-gradient(135deg,#0EA5E9,#0284C7)', glow:'rgba(14,165,233,0.4)' },
  { name: 'Redes',       sub: 'Switches · WiFi',     icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>', gradient:'linear-gradient(135deg,#7C3AED,#6D28D9)', glow:'rgba(124,58,237,0.35)' },
  { name: 'Servidores',  sub: 'NAS · UPS · Rack',    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6" y1="6" y2="6"/><line x1="6" x2="6" y1="18" y2="18"/></svg>', gradient:'linear-gradient(135deg,#f59e0b,#d97706)', glow:'rgba(245,158,11,0.35)' },
  { name: 'Seguridad',   sub: 'CCTV · Control',      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', gradient:'linear-gradient(135deg,#f43f5e,#e11d48)', glow:'rgba(244,63,94,0.35)' },
]

const trustMarks = ['Factura CFDI', 'Precios de distribuidor', 'Entrega a domicilio']

const categories = [
  {
    name: 'Cómputo y laptops',
    desc: 'Equipos de escritorio, laptops, all-in-one y workstations para oficina y trabajo remoto.',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>',
    gradient: 'linear-gradient(135deg,#0EA5E9,#0284C7)',
    glow:     'rgba(14,165,233,0.35)',
  },
  {
    name: 'Redes y conectividad',
    desc: 'Switches, routers, access points y cableado estructurado para tu infraestructura de red.',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
    gradient: 'linear-gradient(135deg,#7C3AED,#6D28D9)',
    glow:     'rgba(124,58,237,0.35)',
  },
  {
    name: 'Servidores y almacenamiento',
    desc: 'Servidores, NAS, UPS y soluciones de respaldo para empresas de cualquier tamaño.',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6" y1="6" y2="6"/><line x1="6" x2="6" y1="18" y2="18"/></svg>',
    gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    glow:     'rgba(245,158,11,0.3)',
  },
  {
    name: 'Impresión y periféricos',
    desc: 'Impresoras, multifuncionales, escáneres, teclados, monitores y accesorios de oficina.',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect width="10" height="8" x="7" y="14" rx="1"/></svg>',
    gradient: 'linear-gradient(135deg,#34d399,#059669)',
    glow:     'rgba(52,211,153,0.3)',
  },
  {
    name: 'Seguridad electrónica',
    desc: 'Cámaras IP, sistemas CCTV, control de acceso y alarmas para proteger tu negocio.',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    gradient: 'linear-gradient(135deg,#f43f5e,#e11d48)',
    glow:     'rgba(244,63,94,0.3)',
  },
  {
    name: 'Consumibles y accesorios',
    desc: 'Tintas, tóners, cables, memorias, baterías y todo lo que tu equipo necesita día a día.',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
    gradient: 'linear-gradient(135deg,#22d3ee,#0891b2)',
    glow:     'rgba(34,211,238,0.3)',
  },
]

const benefits = [
  {
    title: 'Precios preferenciales',
    desc:  'Accede a precios especiales negociados para empresas. Sin catálogos públicos — tus precios son exclusivos.',
    icon:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    bg:    'rgba(14,165,233,0.1)',
    border:'1px solid rgba(14,165,233,0.2)',
  },
  {
    title: 'Factura a tu empresa',
    desc:  'Genera facturas CFDI de cada compra al momento. Proceso 100% digital, sin trámites adicionales.',
    icon:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>',
    bg:    'rgba(52,211,153,0.1)',
    border:'1px solid rgba(52,211,153,0.2)',
  },
  {
    title: 'Entrega rápida',
    desc:  'Rastreamos cada pedido en tiempo real. Coordinamos envíos directamente a tu empresa o sucursal.',
    icon:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect width="13" height="10" x="9" y="11" rx="1"/><path d="M12 11V5"/><path d="M9 18h1m5 0h1"/><circle cx="11" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
    bg:    'rgba(245,158,11,0.1)',
    border:'1px solid rgba(245,158,11,0.2)',
  },
  {
    title: 'Atención personalizada',
    desc:  'Tienes un ejecutivo dedicado para cotizaciones, soporte y seguimiento de tus compras.',
    icon:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    bg:    'rgba(124,58,237,0.1)',
    border:'1px solid rgba(124,58,237,0.2)',
  },
]

const navStyle = {
  position: 'sticky' as const,
  top: '0',
  zIndex: '100',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(4,12,26,0.88)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function fieldWrap(focus: boolean) {
  return {
    position: 'relative' as const,
    borderRadius: '11px',
    background: focus ? 'rgba(14,165,233,0.07)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${focus ? 'rgba(14,165,233,0.55)' : 'rgba(255,255,255,0.12)'}`,
    transition: 'all 0.2s',
    boxShadow: focus ? '0 0 0 3px rgba(14,165,233,0.08)' : 'none',
  }
}

const form = reactive({ name: '', email: '', company: '', phone: '' })
const nameFocus    = ref(false)
const emailFocus   = ref(false)
const companyFocus = ref(false)
const phoneFocus   = ref(false)
const reqLoading   = ref(false)
const reqError     = ref('')
const requestSent  = ref(false)

function resetForm() {
  form.name = ''; form.email = ''; form.company = ''; form.phone = ''
  reqError.value = ''
}

async function handleRequest() {
  reqLoading.value = true
  reqError.value = ''
  try {
    await $fetch('/api/contact/request', {
      method: 'POST',
      body: { name: form.name, email: form.email, company: form.company, phone: form.phone },
    })
    requestSent.value = true
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    reqError.value = msg ?? 'Ocurrió un error. Por favor intenta de nuevo.'
  } finally {
    reqLoading.value = false
  }
}
</script>

<style>
/* ── Responsive ── */
@media (max-width: 640px) {
  .nav-links    { display: none !important; }
  .hide-mobile  { display: none !important; }
  .hero-grid    { grid-template-columns: 1fr !important; }
  .hero-visual  { display: none !important; }
  .hero-h1      { font-size: 38px !important; }
  .contact-grid { grid-template-columns: 1fr !important; }
}

/* ── Grid de contacto ── */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;
}
@media (max-width: 860px) {
  .contact-grid { grid-template-columns: 1fr !important; }
}

/* ── Orbs animados ── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(14,165,233,0.22) 0%, transparent 70%);
  top: -200px; left: -100px;
  animation: orbFloat1 18s ease-in-out infinite;
}
.orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%);
  bottom: -150px; right: -80px;
  animation: orbFloat2 22s ease-in-out infinite;
}
.orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(34,211,238,0.14) 0%, transparent 70%);
  top: 40%; left: 55%;
  animation: orbFloat3 14s ease-in-out infinite;
}
@keyframes orbFloat1 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%  { transform: translate(60px,-40px) scale(1.05); }
  66%  { transform: translate(-30px,60px) scale(0.95); }
}
@keyframes orbFloat2 {
  0%,100% { transform: translate(0,0) scale(1); }
  40%  { transform: translate(-50px,30px) scale(1.08); }
  70%  { transform: translate(40px,-50px) scale(0.96); }
}
@keyframes orbFloat3 {
  0%,100% { transform: translate(0,0); opacity:0.7; }
  50%  { transform: translate(-30px,-40px); opacity:1; }
}

/* ── Línea decorativa ── */
.hero-line-h {
  position: absolute;
  top: 50%; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(14,165,233,0.12) 30%, rgba(14,165,233,0.12) 70%, transparent);
  pointer-events: none;
}

/* ── Badge ── */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px 5px 10px;
  border-radius: 999px;
  background: rgba(14,165,233,0.08);
  border: 1px solid rgba(14,165,233,0.22);
  font-size: 11px;
  font-weight: 700;
  color: #38bdf8;
  letter-spacing: 1.2px;
  margin-bottom: 28px;
}
.badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #0EA5E9;
  box-shadow: 0 0 8px #0EA5E9;
  animation: pulse 1.8s ease-in-out infinite;
}

/* ── Headline ── */
.hero-h1 {
  font-size: clamp(38px, 4.5vw, 62px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -2px;
  color: #F1F5F9;
  margin-bottom: 22px;
}
.hero-gradient-text {
  background: linear-gradient(135deg, #0EA5E9 0%, #22D3EE 40%, #7C3AED 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: opacity 0.35s ease;
}
.word-underline {
  position: absolute;
  bottom: -4px; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #0EA5E9, #7C3AED);
  border-radius: 999px;
  animation: lineGrow 0.5s ease forwards;
  transform-origin: left;
}
@keyframes lineGrow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

/* ── Subtitle ── */
.hero-sub {
  font-size: 16px;
  color: rgba(148,163,184,0.82);
  line-height: 1.75;
  max-width: 480px;
  margin-bottom: 36px;
}

/* ── Botones ── */
.btn-primary-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 26px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #0EA5E9, #0284C7);
  border: none;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 4px 24px rgba(14,165,233,0.4);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary-hero::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; right: 0; bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transition: left 0.5s ease;
}
.btn-primary-hero:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(14,165,233,0.55); }
.btn-primary-hero:hover::before { left: 100%; }

.btn-ghost-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 26px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(226,232,240,0.85);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.btn-ghost-hero:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
  transform: translateY(-1px);
}

/* ── Panel visual flotante ── */
.floating-panel {
  width: 340px;
  border-radius: 20px;
  background: rgba(13,27,53,0.7);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(24px);
  box-shadow: 0 32px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05);
  animation: panelFloat 6s ease-in-out infinite;
  position: relative;
  z-index: 1;
}
@keyframes panelFloat {
  0%, 100% { transform: translateY(0px) rotate(0.3deg); }
  50%       { transform: translateY(-14px) rotate(-0.3deg); }
}

/* ── Items dentro del panel ── */
.panel-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  transition: background 0.2s, border-color 0.2s;
}
.panel-item:hover {
  background: rgba(14,165,233,0.06);
  border-color: rgba(14,165,233,0.18);
}

/* ── Badges flotantes ── */
.float-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(13,27,53,0.85);
  border: 1px solid rgba(255,255,255,0.12);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  z-index: 2;
  white-space: nowrap;
}
.float-badge-1 {
  top: 10px; right: -10px;
  animation: badgeFloat1 5s ease-in-out infinite;
}
.float-badge-2 {
  bottom: 16px; left: -16px;
  animation: badgeFloat2 6s ease-in-out infinite 1s;
}
@keyframes badgeFloat1 {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
@keyframes badgeFloat2 {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(8px); }
}

/* ── Scroll indicator ── */
.scroll-indicator {
  position: absolute;
  bottom: 28px; left: 50%;
  transform: translateX(-50%);
  width: 24px; height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.15);
  display: flex;
  justify-content: center;
  padding-top: 6px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}
.scroll-indicator:hover { opacity: 0.9; }
.scroll-dot {
  width: 4px; height: 8px;
  border-radius: 2px;
  background: #0EA5E9;
  animation: scrollDot 2s ease-in-out infinite;
}
@keyframes scrollDot {
  0%, 100% { transform: translateY(0); opacity: 1; }
  80%       { transform: translateY(14px); opacity: 0; }
}
</style>
