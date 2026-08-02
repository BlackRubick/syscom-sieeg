export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'buyer' | 'approver' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  lastLogin?: string
  avatar?: string
  fiscalCompleted: boolean
  fiscalRfc?: string
  fiscalRazonSocial?: string
  fiscalCodpos?: string
  fiscalEmail?: string
  fiscalUsocfdi?: string
  fiscalRegimen?: string
  fiscalPais?: string
  fiscalCalle?: string
  fiscalNumExt?: string
  fiscalNumInt?: string
  fiscalColonia?: string
  fiscalCiudad?: string
  fiscalDelegacion?: string
  fiscalLocalidad?: string
  fiscalEstado?: string
  fiscalNumregidtrib?: string
  fiscalNombre?: string
  fiscalApellidos?: string
  fiscalTelefono?: string
  discountPct?: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: 'MXN' | 'USD'
  category: string
  supplier: string
  supplierId: string
  sku: string
  stock: number
  unit: string
  images: string[]
  tags: string[]
  rating: number
  reviewCount: number
  leadTime: number
  featured: boolean
  discount?: number
  specs?: Record<string, string>
  satKey?: string
}

export interface CartItem {
  product: Product
  quantity: number
  notes?: string
}

export interface OrderItem {
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  images: string[]
  satKey?: string
}

export interface Order {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'processing' | 'shipped' | 'delivered'
  items: OrderItem[]
  total: number
  priority: string
  notes?: string
  syscomFolio?: string | null
  cfdiUid?: string | null
  auditLog?: { status: string; by: string; byName: string; at: string }[] | null
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  type: 'order' | 'approval' | 'delivery' | 'system' | 'alert'
  title: string
  message: string
  read: boolean
  createdAt: string
}

/* ── SYSCOM types ── */
export interface SyscomCategoria { id: string; nombre: string; nivel: number }

export interface SyscomProducto {
  producto_id: number | string
  modelo: string
  titulo: string
  total_existencia: number
  marca: string
  sat_key?: string
  img_portada?: string
  categorias?: SyscomCategoria[]
  'categorías'?: SyscomCategoria[]
  precios: { precio_especial?: string; precio_descuento?: string; precio_lista?: string }
}

export interface SyscomFactura {
  folio: string
  folio_pedido?: string
  fecha_creacion?: string
  fecha_entrega?: string
  estatus?: string
  estado?: string
  moneda?: string
  subtotal?: string | number
  iva?: string | number
  total?: string | number
  tipo_cambio?: string | number
  productos?: Array<{ modelo?: string; titulo?: string; descripcion?: string; cantidad?: string | number; subtotal?: string | number }>
  datos_entrega?: Partial<{ atencion_a: string; calle: string; num_exterior: string; colonia: string; ciudad: string; estado: string }>
  cliente?: Partial<{ num_cliente: string; email: string; telefono: string }>
}
