<template>
  <div style="font-family:'Inter',system-ui,sans-serif;display:flex;flex-direction:column;gap:24px;">


    <!-- ══════════ HEADER ══════════ -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
        <div>
          <div style="display:flex;align-items:center;gap:10px;">
            <h1 style="font-size:24px;font-weight:900;color:#F1F5F9;margin:0;letter-spacing:-0.5px;">Catálogo</h1>
            <span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;background:linear-gradient(135deg,#0EA5E9,#22D3EE);color:white;letter-spacing:0.5px;">SIEEG</span>
          </div>
          <p style="font-size:12px;color:rgba(100,116,139,0.75);margin:4px 0 0;">
            {{ categories.length > 0 ? `${categories.length} categorías disponibles` : 'Cargando catálogo…' }}
          </p>
        </div>
        <div v-if="hasFilter" style="display:flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);">
          <Loader2 v-if="loading" :size="11" color="#38bdf8" class="spin" />
          <div v-else style="width:6px;height:6px;border-radius:50%;background:#0EA5E9;" />
          <span style="font-size:12px;font-weight:700;color:#38bdf8;">{{ loading ? 'Buscando…' : `${cantidad.toLocaleString('es-MX')} resultados` }}</span>
        </div>
      </div>
      <button v-if="hasFilter" @click="clearAll()" class="cc-btn-clear">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Limpiar todo
      </button>
    </div>

    <!-- ══════════ FILTER PANEL ══════════ -->
    <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

      <!-- Accent bar -->
      <div style="height:3px;background:linear-gradient(90deg,#0EA5E9,#22D3EE,#818cf8);"></div>

      <div style="padding:18px;display:flex;flex-direction:column;gap:14px;">

        <!-- ── Buscador protagonista ── -->
        <div style="position:relative;">
          <svg style="position:absolute;left:18px;top:50%;transform:translateY(-50%);pointer-events:none;" :style="{color:searchFocused?'#0EA5E9':'rgba(100,116,139,0.6)'}" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="search" placeholder="Buscar por nombre, modelo, marca o SKU…"
            @focus="searchFocused=true" @blur="searchFocused=false"
            :style="{
              width:'100%', height:'54px',
              background: searchFocused ? 'rgba(14,165,233,0.07)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${searchFocused ? '#0EA5E9' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: searchFocused ? '0 0 0 4px rgba(14,165,233,0.1)' : 'none',
              borderRadius:'13px', paddingLeft:'52px', paddingRight: search ? '48px' : '18px',
              fontSize:'15px', color:'#E2E8F0', outline:'none', fontFamily:'inherit',
              boxSizing:'border-box', transition:'all 0.2s'
            }" />
          <button v-if="search" @click="search=''"
            style="position:absolute;right:14px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#94a3b8;font-size:14px;transition:background 0.15s;"
            @mouseenter="e=>(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.18)'"
            @mouseleave="e=>(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.1)'">×</button>
        </div>

        <!-- ── Controles: sort + marca + chips activos ── -->
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">

          <!-- Sort -->
          <div style="position:relative;display:flex;align-items:center;flex-shrink:0;">
            <svg style="position:absolute;left:11px;pointer-events:none;color:rgba(100,116,139,0.65);" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>
            <select v-model="sortBy" @change="pagina=1"
              style="height:40px;padding-left:30px;padding-right:30px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:10px;font-size:13px;color:#CBD5E1;outline:none;appearance:none;cursor:pointer;font-family:inherit;min-width:155px;transition:border-color 0.15s;"
              @focus="e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(14,165,233,0.5)'"
              @blur="e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.12)'">
              <option v-for="o in SORT_OPTIONS" :key="o.value" :value="o.value" style="background:#0D1B35;">{{ o.label }}</option>
            </select>
            <ChevronDown :size="13" color="rgba(100,116,139,0.7)" style="position:absolute;right:9px;pointer-events:none;" />
          </div>

          <!-- Brand -->
          <div style="position:relative;flex-shrink:0;">
            <button @click="openBrandDrop()"
              :style="{
                height:'40px', padding:'0 12px', borderRadius:'10px',
                border:`1px solid ${activeBrandId?'rgba(14,165,233,0.4)':'rgba(255,255,255,0.12)'}`,
                background: activeBrandId ? 'rgba(14,165,233,0.12)' : 'rgba(255,255,255,0.05)',
                color: activeBrandId ? '#38bdf8' : '#CBD5E1',
                fontSize:'13px', fontWeight: activeBrandId ? 600 : 400,
                cursor:'pointer', fontFamily:'inherit',
                display:'flex', alignItems:'center', gap:'7px',
                minWidth:'138px', justifyContent:'space-between',
                transition:'all 0.15s'
              }">
              <div style="display:flex;align-items:center;gap:6px;overflow:hidden;">
                <Tag :size="13" :stroke-width="1.8" />
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:85px;">{{ activeBrandId ? (brands.find(b=>b.id===activeBrandId)?.nombre ?? activeBrandId) : 'Marca' }}</span>
              </div>
              <span v-if="activeBrandId" @click.stop="clearBrand()" style="font-size:15px;line-height:1;cursor:pointer;opacity:0.7;">×</span>
              <ChevronDown v-else :size="12" color="rgba(100,116,139,0.7)" />
            </button>
            <Transition name="dropdown">
              <div v-if="brandDropOpen" style="position:absolute;left:0;top:46px;width:248px;background:#0D1B35;border:1px solid rgba(255,255,255,0.1);border-radius:13px;overflow:hidden;z-index:50;box-shadow:0 16px 40px rgba(0,0,0,0.6);">
                <div style="padding:9px 9px 4px;">
                  <input v-model="brandSearch" autofocus placeholder="Buscar marca…"
                    style="width:100%;height:35px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0 10px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;" />
                </div>
                <div style="max-height:222px;overflow-y:auto;padding-bottom:6px;">
                  <div v-if="loadingBrands" style="padding:16px;text-align:center;font-size:12px;color:rgba(100,116,139,0.7);">Cargando marcas…</div>
                  <button v-else v-for="b in filteredBrands" :key="b.id" @click="selectBrand(b.id)"
                    :style="{display:'block',width:'100%',padding:'8px 14px',fontSize:'12px',color:activeBrandId===b.id?'#38bdf8':'#CBD5E1',background:activeBrandId===b.id?'rgba(14,165,233,0.1)':'transparent',border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left',fontWeight:activeBrandId===b.id?600:400}"
                    @mouseenter="e=>{ if(activeBrandId!==b.id)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)' }"
                    @mouseleave="e=>{ if(activeBrandId!==b.id)(e.currentTarget as HTMLElement).style.background='transparent' }">
                    {{ b.nombre }}
                  </button>
                </div>
              </div>
            </Transition>
            <div v-if="brandDropOpen" style="position:fixed;inset:0;z-index:40;" @click="brandDropOpen=false" />
          </div>

          <!-- Chips de filtros activos -->
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-left:auto;">
            <div v-if="dSearch" style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);font-size:11px;font-weight:600;color:#38bdf8;max-width:180px;">
              <Search :size="10" />
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">"{{ dSearch.length>18?dSearch.slice(0,18)+'…':dSearch }}"</span>
              <button @click="search=''" style="background:none;border:none;cursor:pointer;color:rgba(56,189,248,0.6);font-size:13px;padding:0 0 0 2px;line-height:1;transition:color 0.15s;" @mouseenter="e=>(e.currentTarget as HTMLElement).style.color='#fb7185'" @mouseleave="e=>(e.currentTarget as HTMLElement).style.color='rgba(56,189,248,0.6)'">×</button>
            </div>
            <div v-if="activeCategoryId" style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);font-size:11px;font-weight:600;color:#38bdf8;">
              <LayoutGrid :size="10" />
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px;">{{ categories.find(c=>c.id===activeCategoryId)?.nombre }}</span>
              <button @click="selectCategory(null)" style="background:none;border:none;cursor:pointer;color:rgba(56,189,248,0.6);font-size:13px;padding:0 0 0 2px;line-height:1;transition:color 0.15s;" @mouseenter="e=>(e.currentTarget as HTMLElement).style.color='#fb7185'" @mouseleave="e=>(e.currentTarget as HTMLElement).style.color='rgba(56,189,248,0.6)'">×</button>
            </div>
          </div>
        </div>

        <!-- ── Categorías ── -->
        <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:14px;">
          <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;" class="no-scrollbar">
            <button @click="selectCategory(null)"
              :style="{
                flexShrink:0, height:'34px', padding:'0 14px',
                borderRadius:'9px', fontSize:'12px',
                fontWeight: !activeCategoryId?700:400, cursor:'pointer',
                border: `1px solid ${!activeCategoryId?'rgba(14,165,233,0.4)':'rgba(255,255,255,0.08)'}`,
                fontFamily:'inherit',
                background: !activeCategoryId?'rgba(14,165,233,0.18)':'rgba(255,255,255,0.03)',
                color: !activeCategoryId?'#38bdf8':'rgba(100,116,139,0.75)',
                display:'flex', alignItems:'center', gap:'6px', whiteSpace:'nowrap',
                transition:'all 0.15s'
              }">
              <LayoutGrid :size="12" :stroke-width="!activeCategoryId?2.5:1.8" /> Todos
            </button>
            <template v-if="loadingCats">
              <div v-for="i in 7" :key="i" class="shimmer-bg" style="flex-shrink:0;height:34px;width:100px;border-radius:9px;" />
            </template>
            <button v-else v-for="cat in categories" :key="cat.id" @click="selectCategory(cat.id)"
              :style="{
                flexShrink:0, height:'34px', padding:'0 14px',
                borderRadius:'9px', fontSize:'12px',
                fontWeight: activeCategoryId===cat.id?700:400, cursor:'pointer',
                border: `1px solid ${activeCategoryId===cat.id?'rgba(14,165,233,0.4)':'rgba(255,255,255,0.08)'}`,
                fontFamily:'inherit',
                background: activeCategoryId===cat.id?'rgba(14,165,233,0.18)':'rgba(255,255,255,0.03)',
                color: activeCategoryId===cat.id?'#38bdf8':'rgba(100,116,139,0.75)',
                display:'flex', alignItems:'center', gap:'6px', whiteSpace:'nowrap',
                transition:'all 0.15s'
              }">
              <Package :size="12" :stroke-width="activeCategoryId===cat.id?2.5:1.8" /> {{ cat.nombre }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ══════════ ERROR ══════════ -->
    <div v-if="apiError" style="padding:13px 16px;border-radius:12px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.22);color:#fb7185;font-size:13px;display:flex;align-items:center;gap:10px;">
      <AlertCircle :size="15" style="flex-shrink:0;" />
      <span><strong>Error:</strong> {{ apiError }}</span>
    </div>

    <!-- ══════════ CARGANDO INICIAL ══════════ -->
    <div v-if="loadingCats || (loading && !products.length && !hasFilter)"
      style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 0;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);">
      <div style="width:60px;height:60px;border-radius:18px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.2);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <Loader2 :size="24" color="#38bdf8" :stroke-width="1.8" class="spin" />
      </div>
      <div style="font-size:16px;font-weight:700;color:#94a3b8;margin-bottom:6px;">Cargando inventario…</div>
      <div style="font-size:13px;color:rgba(71,85,105,0.9);">Conectando con el catálogo SIEEG</div>
    </div>

    <!-- ══════════ SKELETONS ══════════ -->
    <div v-else-if="loading && !products.length" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(258px,1fr));gap:16px;">
      <div v-for="i in 12" :key="i" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
        <div class="shimmer-bg" style="height:164px;" />
        <div style="padding:14px 16px;display:flex;flex-direction:column;gap:8px;">
          <div class="shimmer-bg" style="height:10px;width:56px;border-radius:20px;" />
          <div class="shimmer-bg" style="height:14px;width:88%;border-radius:6px;" />
          <div class="shimmer-bg" style="height:14px;width:66%;border-radius:6px;" />
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
            <div class="shimmer-bg" style="height:20px;width:88px;border-radius:6px;" />
            <div class="shimmer-bg" style="height:36px;width:92px;border-radius:9px;" />
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════ GRID DE PRODUCTOS ══════════ -->
    <div v-else-if="products.length">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(258px,1fr));gap:16px;">
        <div v-for="product in products" :key="product.id"
          class="cc-card"
          @mouseenter="hoveredId=product.id"
          @mouseleave="hoveredId=null">

          <!-- Imagen -->
          <div style="position:relative;height:164px;background:rgba(255,255,255,0.02);display:flex;align-items:center;justify-content:center;overflow:hidden;">
            <img v-if="product.images[0]" :src="product.images[0]" :alt="product.name"
              :style="{width:'100%',height:'100%',objectFit:'contain',padding:'14px',transition:'transform 0.3s',transform:hoveredId===product.id?'scale(1.05)':'scale(1)'}"
              @error="(e) => (e.currentTarget as HTMLImageElement).style.display='none'" />
            <div v-else style="width:62px;height:62px;border-radius:16px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.18);display:flex;align-items:center;justify-content:center;">
              <Package :size="26" color="#38bdf8" :stroke-width="1.6" />
            </div>
            <!-- Overlay on hover -->
            <div :style="{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(9,18,40,0.5) 0%,transparent 55%)',pointerEvents:'none',opacity:hoveredId===product.id?1:0,transition:'opacity 0.2s'}" />
            <!-- Badges top-left -->
            <div style="position:absolute;top:9px;left:9px;display:flex;gap:5px;">
              <span v-if="product.featured" style="font-size:9px;font-weight:700;padding:3px 7px;border-radius:5px;background:linear-gradient(135deg,#0EA5E9,#22D3EE);color:white;letter-spacing:0.3px;">DEST.</span>
              <span v-if="product.discount" style="font-size:9px;font-weight:700;padding:3px 7px;border-radius:20px;background:#10B981;color:white;">-{{ product.discount }}%</span>
            </div>
            <!-- Stock badge -->
            <span :style="{ ...stockBadgeStyle(product), position:'absolute', top:'9px', right:'9px', fontSize:'9px', fontWeight:600, padding:'3px 8px', borderRadius:'20px' }">{{ stockLabel(product) }}</span>
          </div>

          <!-- Contenido -->
          <div style="padding:14px 15px 15px;display:flex;flex-direction:column;">
            <!-- Categoría -->
            <span style="display:inline-block;font-size:10px;color:rgba(100,116,139,0.75);font-weight:500;background:rgba(255,255,255,0.05);padding:2px 8px;border-radius:20px;align-self:flex-start;margin-bottom:7px;">{{ product.category }}</span>
            <!-- Nombre -->
            <div :style="{fontSize:'13px',fontWeight:600,color:hoveredId===product.id?'#F1F5F9':'#CBD5E1',lineHeight:'1.4',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:'36px',marginBottom:'5px',transition:'color 0.15s'}">{{ product.name }}</div>
            <!-- SKU -->
            <div v-if="product.sku" style="font-size:10px;color:rgba(100,116,139,0.5);margin-bottom:7px;font-family:ui-monospace,monospace;letter-spacing:0.4px;">{{ product.sku }}</div>
            <!-- Proveedor -->
            <div style="font-size:11px;color:rgba(71,85,105,0.85);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:11px;">{{ product.supplier }}</div>
            <!-- Divisor -->
            <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:11px;" />
            <!-- Precio -->
            <div style="margin-bottom:13px;">
              <template v-if="product.price > 0">
                <div style="font-size:18px;font-weight:800;color:#F1F5F9;letter-spacing:-0.5px;line-height:1;">{{ fmtCurrency(product.price) }}</div>
                <div v-if="product.discount" style="font-size:11px;color:rgba(100,116,139,0.5);text-decoration:line-through;margin-top:3px;">{{ fmtCurrency(Math.round(product.price / (1 - product.discount / 100))) }}</div>
              </template>
              <div v-else style="font-size:12px;color:rgba(100,116,139,0.6);font-style:italic;">Consultar precio</div>
            </div>
            <!-- Acciones -->
            <div style="display:flex;gap:7px;">
              <button @click="handleAdd(product)" :disabled="product.stock===0"
                :style="{
                  flex:1, height:'37px', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px',
                  borderRadius:'9px', fontSize:'12px', fontWeight:600, cursor: product.stock===0 ? 'not-allowed' : 'pointer',
                  border: addedIds.has(product.id) ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(14,165,233,0.25)',
                  fontFamily:'inherit', opacity: product.stock===0 ? 0.35 : 1, transition:'all 0.2s',
                  background: addedIds.has(product.id) ? 'rgba(16,185,129,0.12)' : 'rgba(14,165,233,0.1)',
                  color: addedIds.has(product.id) ? '#34d399' : '#38bdf8'
                }">
                <svg v-if="addedIds.has(product.id)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {{ addedIds.has(product.id) ? 'Agregado' : 'Agregar' }}
              </button>
              <button @click="openDetail(product)"
                style="width:37px;height:37px;border-radius:9px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(100,116,139,0.7);flex-shrink:0;transition:all 0.2s;"
                @mouseenter="e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.1)';(e.currentTarget as HTMLElement).style.color='#CBD5E1'}"
                @mouseleave="e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLElement).style.color='rgba(100,116,139,0.7)'}"
                title="Ver detalle">
                <Eye :size="14" :stroke-width="1.8" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="paginas > 1" style="display:flex;align-items:center;justify-content:center;gap:12px;margin-top:36px;">
        <button @click="pagina=Math.max(1,pagina-1)" :disabled="pagina===1"
          style="display:inline-flex;align-items:center;gap:7px;height:40px;padding:0 20px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#CBD5E1;transition:all 0.15s;"
          :style="{opacity:pagina===1?0.35:1,cursor:pagina===1?'not-allowed':'pointer'}"
          @mouseenter="e=>{ if(pagina>1)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.09)' }"
          @mouseleave="e=>(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.05)'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Anterior
        </button>
        <div style="display:flex;align-items:baseline;gap:4px;padding:0 8px;">
          <span style="font-size:18px;font-weight:800;color:#F1F5F9;">{{ pagina }}</span>
          <span style="font-size:14px;color:rgba(100,116,139,0.45);">/</span>
          <span style="font-size:13px;color:rgba(100,116,139,0.65);font-weight:500;">{{ paginas }}</span>
        </div>
        <button @click="pagina=Math.min(paginas,pagina+1)" :disabled="pagina===paginas"
          style="display:inline-flex;align-items:center;gap:7px;height:40px;padding:0 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);color:#38bdf8;transition:all 0.15s;"
          :style="{opacity:pagina===paginas?0.35:1,cursor:pagina===paginas?'not-allowed':'pointer'}"
          @mouseenter="e=>{ if(pagina<paginas)(e.currentTarget as HTMLElement).style.background='rgba(14,165,233,0.18)' }"
          @mouseleave="e=>(e.currentTarget as HTMLElement).style.background='rgba(14,165,233,0.1)'">
          Siguiente
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <!-- ══════════ SIN RESULTADOS ══════════ -->
    <div v-else-if="hasFilter && !loading"
      style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);text-align:center;">
      <div style="width:60px;height:60px;border-radius:18px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.15);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <Search :size="22" color="rgba(100,116,139,0.5)" />
      </div>
      <div style="font-size:17px;font-weight:700;color:#94a3b8;margin-bottom:6px;">Sin resultados</div>
      <div style="font-size:13px;color:rgba(71,85,105,0.9);margin-bottom:20px;">Prueba con otra búsqueda o categoría</div>
      <button @click="clearAll()" class="cc-btn-clear">Limpiar filtros</button>
    </div>

  </div>

  <!-- Modal de detalle -->
  <ProductModal v-if="detailProduct" :product="detailProduct" :show="!!detailProduct" @close="detailProduct=null" />
</template>

<script setup lang="ts">
import { Search, ChevronDown, Package, AlertCircle, Loader2, LayoutGrid, Eye, Tag } from '@lucide/vue'
import { fetchCategorias, fetchProductos, fetchMarcas } from '~/composables/useSyscom'
import type { Product, SyscomCategoria } from '~/types'

definePageMeta({ middleware: 'auth' })

const cart = useCartStore()

const search        = ref('')
const dSearch       = ref('')  // debounced
const searchFocused = ref(false)
const sortBy        = ref('relevancia')
const pagina        = ref(1)
const categories    = ref<SyscomCategoria[]>([])
const activeCategoryId = ref<string | null>(null)
const brands        = ref<Array<{ id: string; nombre: string }>>([])
const activeBrandId = ref<string | null>(null)
const brandSearch   = ref('')
const brandDropOpen = ref(false)
const loadingBrands = ref(false)
const products      = ref<Product[]>([])
const cantidad      = ref(0)
const paginas       = ref(1)
const loading       = ref(false)
const loadingCats   = ref(true)
const apiError      = ref<string | null>(null)
const hoveredId     = ref<string | null>(null)
const addedIds      = ref(new Set<string>())
const detailProduct = ref<Product | null>(null)

const SORT_OPTIONS = [
  { value:'relevancia',  label:'Relevancia'   },
  { value:'precio:asc',  label:'Precio: menor' },
  { value:'precio:desc', label:'Precio: mayor' },
  { value:'topseller',   label:'Más vendidos'  },
]

const hasFilter = computed(() => !!dSearch.value || !!activeCategoryId.value || !!activeBrandId.value)
const filteredBrands = computed(() => brands.value.filter(b => !brandSearch.value || b.nombre.toLowerCase().includes(brandSearch.value.toLowerCase())).slice(0, 40))

let debounceTimer: ReturnType<typeof setTimeout>
watch(search, (v) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { dSearch.value = v; pagina.value = 1 }, 250)
})

let loadId = 0

onMounted(async () => {
  const cats = await fetchCategorias()
  categories.value = cats
  loadingCats.value = false
  loadProducts()
})

watch([dSearch, activeCategoryId, activeBrandId, pagina, sortBy], loadProducts)

async function loadAllCategories(myId: number) {
  const seen = new Set<string>()
  for (const cat of categories.value) {
    if (myId !== loadId) return
    const r = await fetchProductos({ categoria: cat.id })
    if (myId !== loadId) return
    const fresh = r.products.filter(p => !seen.has(p.id))
    fresh.forEach(p => seen.add(p.id))
    products.value = [...products.value, ...fresh]
    cantidad.value = products.value.length
    if (loading.value && products.value.length > 0) loading.value = false
  }
  if (myId === loadId) loading.value = false
}

async function loadProducts() {
  const myId = ++loadId
  loading.value = true
  apiError.value = null
  products.value = []
  cantidad.value = 0

  if (!hasFilter.value) {
    paginas.value = 1
    loadAllCategories(myId)
    return
  }

  const r = await fetchProductos({
    busqueda:  dSearch.value || undefined,
    categoria: activeCategoryId.value ?? undefined,
    marca:     activeBrandId.value ?? undefined,
    pagina:    pagina.value,
    orden:     sortBy.value,
  })
  if (myId !== loadId) return
  products.value = r.products
  cantidad.value = r.cantidad
  paginas.value  = r.paginas
  if (r.error) apiError.value = r.error
  loading.value = false
}

async function openBrandDrop() {
  brandDropOpen.value = true
  if (brands.value.length || loadingBrands.value) return
  loadingBrands.value = true
  brands.value = await fetchMarcas()
  loadingBrands.value = false
}

function selectBrand(id: string) { activeBrandId.value = id; brandDropOpen.value = false; brandSearch.value = ''; pagina.value = 1 }
function clearBrand() { activeBrandId.value = null; brandSearch.value = ''; pagina.value = 1 }
function selectCategory(id: string | null) { activeCategoryId.value = id; pagina.value = 1 }
function clearAll() { search.value = ''; dSearch.value = ''; activeCategoryId.value = null; clearBrand() }

function handleAdd(product: Product) {
  if (product.stock === 0) return
  cart.addItem(product)
  addedIds.value = new Set([...addedIds.value, product.id])
  setTimeout(() => { addedIds.value.delete(product.id); addedIds.value = new Set(addedIds.value) }, 1600)
}

function openDetail(p: Product) { detailProduct.value = p }

const fmtCurrency = (n: number) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(n)
function stockLabel(p: Product) { return p.stock > 10 ? 'En stock' : p.stock > 0 ? `Solo ${p.stock}` : 'Agotado' }
function stockBadgeStyle(p: Product) { return p.stock > 10 ? { background:'rgba(16,185,129,0.12)', color:'#34d399' } : p.stock > 0 ? { background:'rgba(245,158,11,0.12)', color:'#fbbf24' } : { background:'rgba(244,63,94,0.12)', color:'#fb7185' } }
</script>

<style scoped>
.cc-card {
  border-radius: 16px;
  background: linear-gradient(160deg, #0D1B35, #091228);
  border: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
  transition: border-color 0.22s, box-shadow 0.22s, transform 0.22s;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  cursor: default;
}
.cc-card:hover {
  border-color: rgba(14,165,233,0.28);
  box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(14,165,233,0.12);
  transform: translateY(-5px);
}
.cc-btn-clear {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 9px;
  background: rgba(244,63,94,0.08);
  border: 1px solid rgba(244,63,94,0.2);
  color: #fb7185;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, border-color 0.15s;
}
.cc-btn-clear:hover {
  background: rgba(244,63,94,0.14);
  border-color: rgba(244,63,94,0.3);
}
.dropdown-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-leave-active { transition: opacity 0.1s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-5px); }
</style>
