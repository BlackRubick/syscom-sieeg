<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" style="position:fixed;inset:0;background:rgba(2,6,14,0.82);backdrop-filter:blur(7px);z-index:2000;" @click.self="!saving && $emit('update:modelValue', false)" />
    </Transition>
    <Transition name="modal">
      <div v-if="modelValue" style="position:fixed;inset:0;z-index:2001;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="width:100%;max-width:600px;max-height:92vh;display:flex;flex-direction:column;">
          <!-- Borde degradado -->
          <div style="position:relative;display:flex;flex-direction:column;min-height:0;">
            <div style="position:absolute;inset:-1px;border-radius:22px;background:linear-gradient(135deg,rgba(245,158,11,0.5),rgba(14,165,233,0.3),rgba(124,58,237,0.2));z-index:0;pointer-events:none;" />
            <div style="position:relative;z-index:1;border-radius:22px;background:linear-gradient(160deg,#0D1B35,#09122A);box-shadow:0 32px 80px rgba(0,0,0,0.75);display:flex;flex-direction:column;min-height:0;">

              <!-- Header fijo -->
              <div style="padding:26px 28px 0;flex-shrink:0;">
                <div style="position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.7),transparent);border-radius:999px;" />
                <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:40px;height:40px;border-radius:12px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                      <FileText :size="18" color="#fbbf24" />
                    </div>
                    <div>
                      <div style="font-size:16px;font-weight:700;color:#F1F5F9;">Datos fiscales</div>
                      <div style="font-size:12px;color:rgba(100,116,139,0.8);margin-top:2px;">Necesarios para la emisión de facturas (CFDI)</div>
                    </div>
                  </div>
                  <button v-if="!required" @click="!saving && $emit('update:modelValue', false)"
                    style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(100,116,139,0.8);flex-shrink:0;">
                    <X :size="14" />
                  </button>
                </div>

                <!-- Tabs -->
                <div style="display:flex;gap:2px;background:rgba(255,255,255,0.04);border-radius:10px;padding:3px;margin:16px 0 0;">
                  <button v-for="tab in tabs" :key="tab.key" @click="activeTab=tab.key"
                    :style="{ flex:1, height:'32px', borderRadius:'8px', border:'none', fontSize:'12px', fontWeight: activeTab===tab.key ? 600:500, cursor:'pointer', fontFamily:'inherit', background: activeTab===tab.key ? 'linear-gradient(135deg,#0EA5E9,#0284C7)':'transparent', color: activeTab===tab.key ? '#fff':'rgba(100,116,139,0.8)', transition:'all 0.18s' }">
                    {{ tab.label }}
                  </button>
                </div>
              </div>

              <!-- Contenido scrollable -->
              <div style="overflow-y:auto;padding:20px 28px;flex:1;min-height:0;">

                <!-- Tab 1: Datos requeridos -->
                <div v-show="activeTab==='required'">
                  <p style="font-size:12px;color:rgba(100,116,139,0.75);margin:0 0 16px;">Los campos marcados con <span style="color:#fb7185;">*</span> son obligatorios.</p>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                    <div style="grid-column:1/-1;">
                      <FormField label="RFC" v-model="form.rfc" placeholder="XAXX010101000" :required="true" uppercase />
                      <p style="font-size:11px;color:rgba(100,116,139,0.6);margin:4px 0 0;">Escríbelo exactamente como aparece en tu constancia de situación fiscal.</p>
                    </div>
                    <div style="grid-column:1/-1;">
                      <FormField label="Razón Social (sin régimen capital)" v-model="form.razonSocial" placeholder="MI EMPRESA EJEMPLO" :required="true" uppercase />
                      <p style="font-size:11px;color:rgba(100,116,139,0.6);margin:4px 0 0;">Sin S.A. de C.V., S. de R.L., etc. Solo la razón social base.</p>
                    </div>
                    <FormField label="Código Postal" v-model="form.codpos" placeholder="06600" :required="true" uppercase />
                    <FormField label="Email para facturas" type="email" v-model="form.email" placeholder="facturacion@empresa.com" :required="true" />
                    <div>
                      <label style="display:block;font-size:11px;font-weight:500;color:rgba(148,163,184,0.85);margin-bottom:6px;">
                        Régimen Fiscal <span style="color:#fb7185;">*</span>
                      </label>
                      <select v-model="form.regimen" @focus="regimenFocus=true" @blur="regimenFocus=false"
                        :style="selectStyle(regimenFocus)">
                        <option value="" style="background:#0D1B35;" disabled>Selecciona...</option>
                        <option v-for="r in REGIMENES" :key="r.clave" :value="r.clave" style="background:#0D1B35;">{{ r.clave }} – {{ r.nombre }}</option>
                      </select>
                    </div>
                    <div>
                      <label style="display:block;font-size:11px;font-weight:500;color:rgba(148,163,184,0.85);margin-bottom:6px;">
                        País <span style="color:#fb7185;">*</span>
                      </label>
                      <select v-model="form.pais" @focus="paisFocus=true" @blur="paisFocus=false"
                        :style="selectStyle(paisFocus)">
                        <option value="" style="background:#0D1B35;" disabled>Selecciona...</option>
                        <option v-for="p in PAISES" :key="p.clave" :value="p.clave" style="background:#0D1B35;">{{ p.clave }} – {{ p.nombre }}</option>
                      </select>
                    </div>
                    <div>
                      <label style="display:block;font-size:11px;font-weight:500;color:rgba(148,163,184,0.85);margin-bottom:6px;">Uso de CFDI</label>
                      <select v-model="form.usocfdi" @focus="cfdiF=true" @blur="cfdiF=false"
                        :style="selectStyle(cfdiF)">
                        <option value="" style="background:#0D1B35;">Sin especificar</option>
                        <option v-for="c in USOS_CFDI" :key="c.clave" :value="c.clave" style="background:#0D1B35;">{{ c.clave }} – {{ c.nombre }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Tab 2: Domicilio fiscal -->
                <div v-show="activeTab==='address'">
                  <p style="font-size:12px;color:rgba(100,116,139,0.75);margin:0 0 16px;">Domicilio fiscal tal como aparece en tu constancia de situación fiscal.</p>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                    <div style="grid-column:1/-1;"><FormField label="Calle" v-model="form.calle" placeholder="AV. INSURGENTES SUR" uppercase /></div>
                    <FormField label="Número exterior" v-model="form.numeroExterior" placeholder="1234" uppercase />
                    <FormField label="Número interior" v-model="form.numeroInterior" placeholder="PISO 5" uppercase />
                    <FormField label="Colonia" v-model="form.colonia" placeholder="DEL VALLE" uppercase />
                    <FormField label="Ciudad" v-model="form.ciudad" placeholder="CIUDAD DE MÉXICO" uppercase />
                    <FormField label="Delegación / Municipio" v-model="form.delegacion" placeholder="BENITO JUÁREZ" uppercase />
                    <FormField label="Localidad" v-model="form.localidad" placeholder="" uppercase />
                    <FormField label="Estado" v-model="form.estado" placeholder="CIUDAD DE MÉXICO" uppercase />
                  </div>
                </div>

                <!-- Tab 3: Contacto adicional -->
                <div v-show="activeTab==='contact'">
                  <p style="font-size:12px;color:rgba(100,116,139,0.75);margin:0 0 16px;">Información adicional del contacto fiscal.</p>
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                    <FormField label="Nombre" v-model="form.nombre" placeholder="JUAN" uppercase />
                    <FormField label="Apellidos" v-model="form.apellidos" placeholder="PÉREZ GARCÍA" uppercase />
                    <FormField label="Teléfono" v-model="form.telefono" placeholder="5512345678" />
                    <div style="grid-column:1/-1;">
                      <FormField label="Núm. Registro ID Tributario (extranjeros)" v-model="form.numregidtrib" placeholder="SOLO SI APLICA" uppercase />
                      <p style="font-size:11px;color:rgba(100,116,139,0.6);margin:4px 0 0;">Solo requerido para residentes en el extranjero.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer fijo -->
              <div style="padding:16px 28px 24px;flex-shrink:0;border-top:1px solid rgba(255,255,255,0.06);">
                <Transition name="fade">
                  <div v-if="formError" style="padding:9px 12px;border-radius:8px;background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.25);font-size:12px;color:#fb7185;margin-bottom:12px;">{{ formError }}</div>
                </Transition>
                <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
                  <div style="font-size:11px;color:rgba(100,116,139,0.6);">
                    <span v-if="required">Completa los datos requeridos para continuar usando la plataforma.</span>
                    <span v-else>Puedes actualizar estos datos en cualquier momento.</span>
                  </div>
                  <div style="display:flex;gap:10px;flex-shrink:0;">
                    <button v-if="!required" type="button" @click="!saving && $emit('update:modelValue', false)"
                      style="height:38px;padding:0 18px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:13px;cursor:pointer;font-family:inherit;">
                      Cancelar
                    </button>
                    <button @click="handleSave" :disabled="saving"
                      :style="{ height:'38px', padding:'0 22px', borderRadius:'10px', border:'none', background: saving?'rgba(14,165,233,0.4)':'linear-gradient(135deg,#0EA5E9,#0284C7)', color:'white', fontSize:'13px', fontWeight:600, cursor:saving?'not-allowed':'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }">
                      {{ saving ? 'Guardando...' : 'Guardar datos fiscales' }}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { FileText, X } from '@lucide/vue'
import type { User } from '~/types'

const props = defineProps<{
  modelValue: boolean
  required?: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'completed': [user: User]
}>()

const auth = useAuthStore()

const activeTab = ref<'required' | 'address' | 'contact'>('required')
const saving    = ref(false)
const formError = ref('')
const regimenFocus = ref(false)
const paisFocus    = ref(false)
const cfdiF        = ref(false)

const tabs = [
  { key: 'required', label: 'Datos requeridos' },
  { key: 'address',  label: 'Domicilio fiscal' },
  { key: 'contact',  label: 'Contacto adicional' },
] as const

interface FiscalForm {
  rfc: string; razonSocial: string; codpos: string; email: string
  regimen: string; pais: string; usocfdi: string
  calle: string; numeroExterior: string; numeroInterior: string
  colonia: string; ciudad: string; delegacion: string; localidad: string; estado: string
  numregidtrib: string; nombre: string; apellidos: string; telefono: string
}

const form = ref<FiscalForm>({
  rfc: '', razonSocial: '', codpos: '', email: '', regimen: '', pais: 'MEX', usocfdi: '',
  calle: '', numeroExterior: '', numeroInterior: '',
  colonia: '', ciudad: '', delegacion: '', localidad: '', estado: '',
  numregidtrib: '', nombre: '', apellidos: '', telefono: '',
})

watch(() => props.modelValue, (open) => {
  if (!open) return
  activeTab.value = 'required'
  formError.value = ''
  const u = auth.user
  if (!u) return
  form.value = {
    rfc:            u.fiscalRfc          ?? '',
    razonSocial:    u.fiscalRazonSocial  ?? '',
    codpos:         u.fiscalCodpos       ?? '',
    email:          u.fiscalEmail        ?? u.email,
    regimen:        u.fiscalRegimen      ?? '',
    pais:           u.fiscalPais         ?? 'MEX',
    usocfdi:        u.fiscalUsocfdi      ?? '',
    calle:          u.fiscalCalle        ?? '',
    numeroExterior: u.fiscalNumExt       ?? '',
    numeroInterior: u.fiscalNumInt       ?? '',
    colonia:        u.fiscalColonia      ?? '',
    ciudad:         u.fiscalCiudad       ?? '',
    delegacion:     u.fiscalDelegacion   ?? '',
    localidad:      u.fiscalLocalidad    ?? '',
    estado:         u.fiscalEstado       ?? '',
    numregidtrib:   u.fiscalNumregidtrib ?? '',
    nombre:         u.fiscalNombre       ?? '',
    apellidos:      u.fiscalApellidos    ?? '',
    telefono:       u.fiscalTelefono     ?? '',
  }
})

const selectStyle = (focused: boolean) => ({
  width: '100%', height: '40px',
  background: focused ? 'rgba(14,165,233,0.06)' : '#0D1B35',
  border: `1px solid ${focused ? 'rgba(14,165,233,0.45)' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: '10px', padding: '0 12px', fontSize: '13px', color: '#E2E8F0',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.18s', cursor: 'pointer',
})

async function handleSave() {
  formError.value = ''
  if (!form.value.rfc || !form.value.razonSocial || !form.value.codpos || !form.value.email || !form.value.regimen || !form.value.pais) {
    activeTab.value = 'required'
    formError.value = 'Completa los campos requeridos: RFC, Razón Social, Código Postal, Email, Régimen Fiscal y País.'
    return
  }
  saving.value = true
  try {
    const data = await $fetch<{ user: User }>('/api/users/fiscal-data', {
      method: 'PATCH',
      body: {
        rfc:            form.value.rfc,
        razonSocial:    form.value.razonSocial,
        codpos:         form.value.codpos,
        email:          form.value.email,
        regimen:        form.value.regimen,
        pais:           form.value.pais,
        usocfdi:        form.value.usocfdi        || undefined,
        calle:          form.value.calle          || undefined,
        numeroExterior: form.value.numeroExterior || undefined,
        numeroInterior: form.value.numeroInterior || undefined,
        colonia:        form.value.colonia        || undefined,
        ciudad:         form.value.ciudad         || undefined,
        delegacion:     form.value.delegacion     || undefined,
        localidad:      form.value.localidad      || undefined,
        estado:         form.value.estado         || undefined,
        numregidtrib:   form.value.numregidtrib   || undefined,
        nombre:         form.value.nombre         || undefined,
        apellidos:      form.value.apellidos      || undefined,
        telefono:       form.value.telefono       || undefined,
      },
    })
    auth.setUser(data.user)
    emit('completed', data.user)
    emit('update:modelValue', false)
  } catch (e: unknown) {
    formError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al guardar los datos fiscales'
  } finally {
    saving.value = false
  }
}

const REGIMENES = [
  { clave: '601', nombre: 'General de Ley Personas Morales' },
  { clave: '603', nombre: 'Personas Morales con Fines no Lucrativos' },
  { clave: '605', nombre: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
  { clave: '606', nombre: 'Arrendamiento' },
  { clave: '607', nombre: 'Régimen de Enajenación o Adquisición de Bienes' },
  { clave: '608', nombre: 'Demás ingresos' },
  { clave: '610', nombre: 'Residentes en el Extranjero sin Establecimiento Permanente en México' },
  { clave: '611', nombre: 'Ingresos por Dividendos (socios y accionistas)' },
  { clave: '612', nombre: 'Personas Físicas con Actividades Empresariales y Profesionales' },
  { clave: '614', nombre: 'Ingresos por intereses' },
  { clave: '615', nombre: 'Régimen de los ingresos por obtención de premios' },
  { clave: '616', nombre: 'Sin obligaciones fiscales' },
  { clave: '620', nombre: 'Sociedades Cooperativas de Producción' },
  { clave: '621', nombre: 'Incorporación Fiscal' },
  { clave: '622', nombre: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
  { clave: '623', nombre: 'Opcional para Grupos de Sociedades' },
  { clave: '624', nombre: 'Coordinados' },
  { clave: '625', nombre: 'Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
  { clave: '626', nombre: 'Régimen Simplificado de Confianza (RESICO)' },
]

const USOS_CFDI = [
  { clave: 'G01', nombre: 'Adquisición de mercancias' },
  { clave: 'G02', nombre: 'Devoluciones, descuentos o bonificaciones' },
  { clave: 'G03', nombre: 'Gastos en general' },
  { clave: 'I01', nombre: 'Construcciones' },
  { clave: 'I02', nombre: 'Mobiliario y equipo de oficina por inversiones' },
  { clave: 'I03', nombre: 'Equipo de transporte' },
  { clave: 'I04', nombre: 'Equipo de computo y accesorios' },
  { clave: 'I05', nombre: 'Dados, troqueles, moldes, matrices y herramental' },
  { clave: 'I06', nombre: 'Comunicaciones telefónicas' },
  { clave: 'I07', nombre: 'Comunicaciones satelitales' },
  { clave: 'I08', nombre: 'Otra maquinaria y equipo' },
  { clave: 'D01', nombre: 'Honorarios médicos, dentales y gastos hospitalarios' },
  { clave: 'D02', nombre: 'Gastos médicos por incapacidad o discapacidad' },
  { clave: 'D03', nombre: 'Gastos funerales' },
  { clave: 'D04', nombre: 'Donativos' },
  { clave: 'D05', nombre: 'Intereses reales efectivamente pagados por créditos hipotecarios' },
  { clave: 'D06', nombre: 'Aportaciones voluntarias al SAR' },
  { clave: 'D07', nombre: 'Primas por seguros de gastos médicos' },
  { clave: 'D08', nombre: 'Gastos de transportación escolar obligatoria' },
  { clave: 'D09', nombre: 'Depósitos en cuentas para el ahorro y planes de pensiones' },
  { clave: 'D10', nombre: 'Pagos por servicios educativos (colegiaturas)' },
  { clave: 'S01', nombre: 'Sin efectos fiscales' },
  { clave: 'CP01', nombre: 'Pagos' },
  { clave: 'CN01', nombre: 'Nómina' },
]

const PAISES = [
  { clave: 'MEX', nombre: 'México' },
  { clave: 'USA', nombre: 'Estados Unidos' },
  { clave: 'CAN', nombre: 'Canadá' },
  { clave: 'ESP', nombre: 'España' },
  { clave: 'ARG', nombre: 'Argentina' },
  { clave: 'COL', nombre: 'Colombia' },
  { clave: 'CHL', nombre: 'Chile' },
  { clave: 'BRA', nombre: 'Brasil' },
  { clave: 'PER', nombre: 'Perú' },
  { clave: 'GTM', nombre: 'Guatemala' },
  { clave: 'DEU', nombre: 'Alemania' },
  { clave: 'GBR', nombre: 'Reino Unido' },
  { clave: 'FRA', nombre: 'Francia' },
  { clave: 'CHN', nombre: 'China' },
  { clave: 'JPN', nombre: 'Japón' },
]
</script>
