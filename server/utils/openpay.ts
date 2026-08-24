const isSandbox = process.env.OPENPAY_IS_SANDBOX !== 'false'
const BASE_URL  = isSandbox
  ? 'https://sandbox-api.openpay.mx/v1'
  : 'https://api.openpay.mx/v1'

const merchantId = process.env.OPENPAY_MERCHANT_ID ?? ''
const privateKey = process.env.OPENPAY_PRIVATE_KEY ?? ''

function authHeader() {
  return 'Basic ' + Buffer.from(`${privateKey}:`).toString('base64')
}

// ── Mensajes de error según requisitos de certificación OpenPay ──
export function openpayErrorMessage(e: any): string {
  const code: number | undefined = e?.data?.error_code
  if (code === 3003) return 'Tu pago no pudo ser realizado. Intenta con otra tarjeta'
  if (code === 3001 || code === 3004 || code === 3005 || code === 3009) {
    return 'El pago no pudo ser realizado, intenta de nuevo.'
  }
  if (code && code >= 3000 && code < 4000) {
    return 'Ocurrió un error, intenta de nuevo o comunícate con tu banco.'
  }
  if (code === 2004) return 'El número de tarjeta es inválido'
  if (code === 2005) return 'La tarjeta ha expirado'
  if (code === 2009) return 'El código de seguridad (CVV) es inválido'
  return e?.data?.description ?? e?.message ?? 'Ocurrió un error, intenta de nuevo o comunícate con tu banco.'
}

// ── Tipos ──
export interface OpenPayCharge {
  id: string
  status: string
  amount: number
  currency: string
  description: string
  authorization?: string
  method: string
  creation_date: string
  error_message?: string
  payment_method?: {
    type: string
    url?: string  // 3DS redirect URL when status is charge_pending
  }
}

export interface OpenPaySpeiCharge {
  id: string
  status: string
  amount: number
  currency: string
  description: string
  creation_date: string
  payment_method: {
    type:      string
    agreement: string
    bank:      string
    clabe:     string
    name:      string
  }
}

// ── Cargo con tarjeta (token de OpenPay.js) ──
export async function createCardCharge(payload: {
  sourceId:        string
  amount:          number
  description:     string
  deviceSessionId: string
  clientIp:        string
  redirectUrl?:    string  // si se provee, activa 3D Secure
  customer: {
    name:         string
    lastName:     string
    email:        string
    phoneNumber?: string
  }
}): Promise<OpenPayCharge> {
  if (!merchantId || !privateKey) {
    throw new Error('OpenPay no está configurado (OPENPAY_MERCHANT_ID / OPENPAY_PRIVATE_KEY)')
  }
  return await $fetch<OpenPayCharge>(`${BASE_URL}/${merchantId}/charges`, {
    method: 'POST',
    headers: {
      Authorization:     authHeader(),
      'X-Forwarded-For': payload.clientIp,
    },
    body: {
      method:            'card',
      source_id:         payload.sourceId,
      amount:            Math.round(payload.amount * 100) / 100,
      currency:          'MXN',
      description:       payload.description,
      device_session_id: payload.deviceSessionId,
      capture:           true,
      use_3d_secure:     !!payload.redirectUrl,
      redirect_url:      payload.redirectUrl ?? undefined,
      customer: {
        name:         payload.customer.name,
        last_name:    payload.customer.lastName,
        email:        payload.customer.email,
        phone_number: payload.customer.phoneNumber,
      },
    },
  })
}

// ── Cargo por transferencia SPEI ──
export async function createSpeiCharge(payload: {
  amount:      number
  description: string
  clientIp:    string
  customer: {
    name:         string
    lastName:     string
    email:        string
    phoneNumber?: string
  }
}): Promise<OpenPaySpeiCharge> {
  if (!merchantId || !privateKey) {
    throw new Error('OpenPay no está configurado')
  }
  return await $fetch<OpenPaySpeiCharge>(`${BASE_URL}/${merchantId}/charges`, {
    method: 'POST',
    headers: {
      Authorization:     authHeader(),
      'X-Forwarded-For': payload.clientIp,
    },
    body: {
      method:      'bank_account',
      amount:      Math.round(payload.amount * 100) / 100,
      currency:    'MXN',
      description: payload.description,
      customer: {
        name:         payload.customer.name,
        last_name:    payload.customer.lastName,
        email:        payload.customer.email,
        phone_number: payload.customer.phoneNumber,
      },
    },
  })
}

// ── Consultar cargo ──
export async function getCharge(chargeId: string): Promise<OpenPayCharge> {
  if (!merchantId || !privateKey) throw new Error('OpenPay no está configurado')
  return await $fetch<OpenPayCharge>(`${BASE_URL}/${merchantId}/charges/${chargeId}`, {
    headers: { Authorization: authHeader() },
  })
}
