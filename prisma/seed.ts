import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

function sha256(s: string) {
  return createHash('sha256').update(s).digest('hex')
}

async function main() {
  const users = [
    { id:'u1', name:'Ana García López',   email:'ana.garcia@empresa.com',     password:sha256('Admin2026!'),    role:'admin'    as const, department:'Tecnología',  status:'active'   as const, createdAt:'2024-01-15', lastLogin:'2026-06-03', purchaseLimit:500000, avatar:'AG' },
    { id:'u2', name:'Carlos Mendoza',     email:'carlos.mendoza@empresa.com', password:sha256('Compras2026!'),  role:'buyer'    as const, department:'Compras',     status:'active'   as const, createdAt:'2024-03-20', lastLogin:'2026-06-02', purchaseLimit:150000, avatar:'CM' },
    { id:'u3', name:'Sofía Ramírez',      email:'sofia.ramirez@empresa.com',  password:sha256('Finanzas2026!'), role:'approver' as const, department:'Finanzas',    status:'active'   as const, createdAt:'2024-02-10', lastLogin:'2026-06-03', purchaseLimit:300000, avatar:'SR' },
    { id:'u4', name:'Luis Torres',        email:'luis.torres@empresa.com',    password:sha256('Torres2026!'),   role:'buyer'    as const, department:'Operaciones', status:'inactive' as const, createdAt:'2024-05-01', lastLogin:'2026-05-28', purchaseLimit:100000, avatar:'LT' },
    { id:'u5', name:'María Flores',       email:'maria.flores@empresa.com',   password:sha256('RRHH2026!'),     role:'viewer'   as const, department:'RRHH',        status:'active'   as const, createdAt:'2025-01-10', lastLogin:'2026-06-01', purchaseLimit:null,   avatar:'MF' },
    { id:'u6', name:'Roberto Vega',       email:'roberto.vega@empresa.com',   password:sha256('Vega2026!'),     role:'buyer'    as const, department:'Manufactura', status:'pending'  as const, createdAt:'2026-05-30', lastLogin:null,        purchaseLimit:200000, avatar:'RV' },
  ]

  for (const u of users) {
    await prisma.user.upsert({
      where:  { email: u.email },
      update: {},
      create: u,
    })
  }

  console.log('✓ Seed completado — 6 usuarios creados')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
