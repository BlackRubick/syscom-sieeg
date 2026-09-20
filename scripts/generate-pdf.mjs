import { writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Preguntas para la API SYSCOM</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

@page {
  size: Letter;
  margin: 2.54cm 2.8cm 2.54cm 3.0cm;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12pt;
  line-height: 2.0;
  color: #000;
  background: #fff;
  text-align: justify;
  hyphens: auto;
  -webkit-hyphens: auto;
  word-break: break-word;
  font-weight: 400;
}

/* PORTADA */
.portada {
  page-break-after: always;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 3cm 2cm;
}
.linea-top  { border-top: 3px solid #000; width: 100%; margin-bottom: 0.9cm; }
.linea-bot  { border-top: 1px solid #000; width: 100%; margin-top: 0.7cm; margin-bottom: 0.5cm; }
.p-titulo   { font-size: 20pt; font-weight: 400; letter-spacing: 0.02em; line-height: 1.4; margin-bottom: 0.4cm; color: #000; }
.p-sub      { font-size: 13pt; font-weight: 400; color: #000; }
.p-meta     { margin-top: 0.5cm; text-align: left; width: 100%; font-size: 11pt; line-height: 1.9; color: #000; }
.p-meta strong { display: inline-block; min-width: 5.5cm; font-weight: 400; }


/* SECCIONES */
.seccion { page-break-before: always; padding-top: 0.2cm; }

/* HEADINGS — sin negritas, todo negro */
h1 { font-family: Arial, Helvetica, sans-serif; font-size: 12pt; font-weight: 400; text-align: center; line-height: 2.0; margin: 0; page-break-after: avoid; color: #000; }
h2 { font-family: Arial, Helvetica, sans-serif; font-size: 12pt; font-weight: 400; text-align: left; line-height: 2.0; margin: 0; margin-top: 0.4cm; page-break-after: avoid; color: #000; text-decoration: underline; }
h3 { font-family: Arial, Helvetica, sans-serif; font-size: 14pt; font-weight: 400; text-align: left; line-height: 1.8; margin: 0; margin-top: 0.3cm; page-break-after: avoid; color: #000; }

/* PÁRRAFOS */
p {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12pt;
  font-weight: 400;
  line-height: 2.0;
  text-indent: 1.27cm;
  margin: 0;
  orphans: 4;
  widows: 4;
  text-align: justify;
  hyphens: auto;
  -webkit-hyphens: auto;
  word-spacing: 0.02em;
  color: #000;
}
p.ni   { text-indent: 0; }
p.hang { text-indent: -1.27cm; padding-left: 1.27cm; }

/* BADGE */
.badge { font-size: 9pt; font-weight: 400; border: 1px solid #000; padding: 0 4px; font-family: Arial, sans-serif; vertical-align: middle; color: #000; }

/* CÓDIGO */
code { font-family: 'Courier New', monospace; font-size: 10pt; color: #000; }

/* ENCABEZADO CORRIENTE */
.rhead { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; font-weight: 400; color: #000; text-transform: uppercase; letter-spacing: 0.03em; line-height: 1; }

/* PIE */
.pie { page-break-before: always; padding-top: 3cm; text-align: center; border-top: 1px solid #000; font-size: 10pt; color: #000; line-height: 1.8; font-family: Arial, Helvetica, sans-serif; font-weight: 400; }
</style>
</head>
<body>

<!-- PORTADA -->
<div class="portada">
  <div class="linea-top"></div>
  <div class="p-titulo">Preguntas Clave para la Documentación de la API de SYSCOM</div>
  <div class="p-sub">Integración con la Plataforma B2B SIEEG</div>
  <div class="linea-bot"></div>
  <div class="p-meta">
    <p><strong>Preparado por:</strong> Equipo de Desarrollo — SIEEG</p>
    <p><strong>Fecha:</strong> Julio de 2026</p>
    <p><strong>Versión:</strong> 1.0</p>
    <p><strong>Clasificación:</strong> Uso Interno / Confidencial</p>
  </div>
</div>

<!-- INTRODUCCIÓN -->
<div class="seccion">
<p class="rhead">PREGUNTAS CLAVE — API SYSCOM</p>
<h1>Preguntas Clave para la Documentación de la API de SYSCOM</h1>

<p>Las siguientes preguntas se han identificado a partir del análisis del código fuente de la plataforma SIEEG y representan las áreas de mayor incertidumbre técnica en la integración con la API de SYSCOM México (2024). Se presentan organizadas por tema y redactadas de forma directa para facilitar su envío al equipo de soporte técnico o consulta en la documentación oficial.</p>

<!-- ──────────────────────────────── -->
<h2>1. Catálogo y Productos</h2>

<h3>P1. ¿Cuál es el número máximo de productos que puede devolver el endpoint <code>/api/v1/productos</code> en una sola petición mediante el parámetro <code>per_page</code>?</h3>
<p>Actualmente consumimos ese endpoint sin especificar un límite de resultados, lo que nos impide saber cuántas páginas necesitamos solicitar para obtener el catálogo completo. ¿El valor máximo permitido es 50, 100, 200 o algún otro número? Conocer este dato nos permitirá calcular el número exacto de llamadas necesarias y mejorar los tiempos de carga del catálogo en nuestra plataforma.</p>

<h3>P2. ¿El endpoint de productos permite filtrar por <code>categoria_id</code> y paginar los resultados de forma independiente por categoría?</h3>
<p>Hoy nuestra plataforma realiza una petición separada por cada categoría de forma secuencial, lo que genera entre 20 y 40 llamadas en serie antes de poder mostrar el catálogo completo. Si el endpoint acepta un filtro por categoría con paginación por cursor, podríamos lanzar todas las peticiones en paralelo y reducir considerablemente el tiempo de carga. ¿Existe esa capacidad en la API?</p>

<h3>P3. De los campos <code>precio_especial</code>, <code>precio_lista</code> y <code>precio_descuento</code>, ¿cuál representa el precio neto que nosotros como distribuidores pagamos a SYSCOM?</h3>
<p>Nuestra plataforma aplica la prioridad <code>precio_especial</code> &gt; <code>precio_lista</code> &gt; <code>precio_descuento</code> para determinar el precio a mostrar, pero no tenemos certeza de cuál de esos campos es el precio real de costo para distribuidores. Necesitamos confirmarlo para evitar mostrar a nuestros clientes B2B precios de lista al público y para calcular correctamente nuestro margen de ganancia.</p>

<h3>P4. ¿Existe algún endpoint o parámetro que devuelva únicamente los productos actualizados a partir de una fecha determinada, similar a un filtro <code>updated_since</code>?</h3>
<p>Actualmente re-descargamos todo el catálogo cada vez que el caché expira. Si la API ofrece un filtro de novedades por fecha, podríamos sincronizar únicamente los cambios mediante un proceso nocturno, reduciendo el consumo de cuota de la API y el tiempo de actualización del catálogo.</p>

<h3>P5. ¿El parámetro <code>busqueda</code> aplica sobre el título del producto solamente, o también busca en número de modelo, SKU y nombre de marca de forma simultánea?</h3>
<p>Recibimos casos de clientes que buscan por número de parte del fabricante y no encuentran resultados, lo que sugiere que la búsqueda podría estar limitada al título. Necesitamos saber el alcance exacto del índice de búsqueda para decidir si debemos implementar filtros adicionales en nuestra interfaz o si la API ya cubre esos casos de uso.</p>

<h3>P6. ¿Cuál es el límite de peticiones por minuto que permite la API por credencial de cliente y qué sucede al superarlo?</h3>
<p>Cuando varios usuarios navegan el catálogo al mismo tiempo, nuestro servidor lanza múltiples peticiones concurrentes a la API. Necesitamos saber si existe un <em>rate limit</em> y cuál es su umbral para poder diseñar una cola de peticiones o un mecanismo de reintento con retroceso exponencial antes de recibir errores en producción.</p>

<!-- ──────────────────────────────── -->
<h2>2. Existencias y Disponibilidad</h2>

<h3>P7. ¿El campo <code>total_existencia</code> en la respuesta de productos refleja el stock en tiempo real o es una estimación que se actualiza en intervalos programados?</h3>
<p>Actualmente registramos órdenes sin verificar disponibilidad previa porque no sabemos qué tan confiable es ese campo al momento de la compra. Si el dato es en tiempo real, podemos agregar una validación de stock en el <em>checkout</em>. Si no lo es, ¿en qué momento el pedido podría ser rechazado por falta de inventario y de qué forma nos lo comunica la API?</p>

<h3>P8. ¿Existe un endpoint que permita consultar el stock de múltiples productos en una sola llamada, enviando un arreglo de SKUs o identificadores?</h3>
<p>Para validar el carrito antes de confirmar una orden necesitaríamos verificar la existencia de cada artículo. Si el carrito tiene 20 productos y debemos consultarlos uno a uno, eso implica 20 peticiones HTTP solo para esa validación. ¿Cuenta la API con un endpoint de tipo <em>batch</em> —por ejemplo, <code>POST /api/v1/productos/stock</code>— que acepte varios identificadores a la vez?</p>

<!-- ──────────────────────────────── -->
<h2>3. Pedidos y Carrito de Compra</h2>

<h3>P9. ¿Cuáles son todos los valores válidos para el campo <code>metodo_pago</code> al generar un pedido en <code>/api/v1/carrito/generar</code>?</h3>
<p>Actualmente enviamos de forma fija el código <code>03</code> (transferencia electrónica de fondos). Queremos saber si la API acepta otros métodos de pago como crédito a plazo, cheque o pago a 30 días, y cuáles son los códigos exactos para cada uno, con el fin de ofrecer más opciones de pago a nuestros clientes durante el proceso de compra.</p>

<h3>P10. ¿El payload del endpoint <code>/api/v1/carrito/generar</code> acepta campos opcionales adicionales como referencia de cliente, observaciones o fecha de entrega requerida?</h3>
<p>Hoy enviamos únicamente la dirección fiscal, el RFC, el uso de CFDI y los artículos del carrito. Necesitamos saber si podemos incluir información adicional que facilite la coordinación con el equipo de logística de SYSCOM, como una referencia interna de nuestra parte, comentarios especiales o una fecha de entrega solicitada.</p>

<h3>P11. ¿Cuáles son todos los valores posibles del campo <code>estatus</code> en la respuesta de <code>/api/v1/pedidos/{folio}</code> y qué significa cada uno?</h3>
<p>Actualmente nuestra plataforma solo reconoce los valores <em>entrega</em> y <em>recibido</em> para marcar un pedido como entregado, lo que nos limita a una vista muy simplificada del seguimiento. Si nos proporcionan el catálogo completo de estatus posibles —por ejemplo: en preparación, en almacén, en tránsito, entregado— podremos mostrar a nuestros clientes una línea de tiempo detallada de su pedido.</p>

<h3>P12. ¿Es posible cancelar un pedido en SYSCOM una vez que fue generado? ¿Existe un endpoint de cancelación y bajo qué condiciones puede utilizarse?</h3>
<p>Cuando un administrador rechaza una orden en nuestra plataforma después de haberla transmitido a SYSCOM, actualmente no tenemos forma de cancelarla del lado de SYSCOM. Esto genera pedidos activos en su sistema sin seguimiento de nuestra parte. ¿Cómo debemos proceder en ese escenario?</p>

<h3>P13. ¿SYSCOM ofrece notificaciones automáticas vía webhook cuando cambia el estatus de un pedido?</h3>
<p>Hoy tenemos que consultar manualmente el estado de cada pedido activo. Si SYSCOM ofrece webhooks, podríamos registrar una URL receptora en nuestra plataforma para recibir actualizaciones en tiempo real y eliminar por completo la necesidad de consultas periódicas. De ser así, ¿cuál es el proceso para registrar nuestra URL y cuál es el formato del payload que enviarían?</p>

<!-- ──────────────────────────────── -->
<h2>4. Precios, Tipo de Cambio y Margen de Ganancia</h2>

<h3>P14. ¿Con qué frecuencia se actualiza el tipo de cambio en el endpoint <code>/api/v1/tipocambio</code>: una vez al día, por hora o en tiempo real?</h3>
<p>Actualmente mantenemos ese dato en caché durante 30 minutos. Si la actualización real ocurre una vez al día, podemos extender ese tiempo sin riesgo de mostrar valores desactualizados, reduciendo el número de llamadas innecesarias a la API.</p>

<h3>P15. ¿Los precios que devuelve el endpoint <code>/api/v1/productos</code> ya incluyen IVA, o son precios netos antes de impuesto? <span class="badge">URGENTE</span></h3>
<p>Nuestra plataforma calcula y agrega el IVA al 16 % al momento de generar el CFDI 4.0. Si los precios de la API ya incluyen IVA, estaríamos duplicando el impuesto en el comprobante fiscal, lo que constituye un error grave ante el SAT. Por favor confirmen si los precios son con o sin IVA antes de que iniciemos operaciones en ambiente de producción.</p>

<h3>P16. ¿La API devuelve distintos niveles de precio según el tipo de cuenta —distribuidor, mayorista, precio sugerido de reventa— o el precio que recibimos es siempre el precio de costo para nosotros?</h3>
<p>Somos una plataforma de reventa B2B y necesitamos aplicar un porcentaje de margen de ganancia sobre el precio que obtenemos de la API antes de mostrárselo a nuestros clientes. Para configurarlo correctamente necesitamos saber: ¿el precio que nos devuelve la API es el precio neto que nosotros pagamos a SYSCOM, o ya incluye algún margen? ¿Existe un campo específico como <code>precio_distribuidor</code> o <code>precio_reventa_sugerido</code> que debamos usar como base para nuestro cálculo? ¿O debemos aplicar nuestro porcentaje directamente sobre <code>precio_especial</code>? La respuesta determina cómo configuraremos la lógica de precios en nuestra plataforma.</p>

</div>

<!-- PIE -->
<div class="pie">
  <p>SIEEG — Sistema de Compras B2B</p>
  <p>Versión 1.0 &nbsp;|&nbsp; Julio 2026 &nbsp;|&nbsp; Confidencial — Uso Interno</p>
</div>

</body>
</html>`

const htmlPath = resolve(root, 'Analisis_Integracion_SYSCOM_APA.html')
writeFileSync(htmlPath, html, 'utf-8')
console.log('HTML generado')

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const pdfPath = resolve(root, 'Analisis_Integracion_SYSCOM.pdf')

execSync(
  `"${chromePath}" \
    --headless=new \
    --disable-gpu \
    --no-sandbox \
    --disable-cache \
    --disk-cache-size=0 \
    --print-to-pdf="${pdfPath}" \
    --print-to-pdf-no-header \
    --no-pdf-header-footer \
    "file://${htmlPath}"`,
  { stdio: 'pipe', timeout: 120000 }
)

console.log('PDF listo:', pdfPath)
