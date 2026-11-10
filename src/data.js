// Todo el contenido del portafolio vive aquí: para agregar un proyecto o cambiar un texto
// no hace falta tocar los componentes.
//
// IMÁGENES: guárdalas en public/media/<proyecto>/ y escribe la ruta en `src` con media('...').
//   Ejemplo: { label: 'Mesa de empaque', src: media('packcheck/mesa.webp'), alt: 'Operaria verificando una caja' }
//   Sin `src`, la página muestra el espacio "Captura pendiente".
// VIDEOS: agrega a un proyecto  video: { youtube: 'ID_DEL_VIDEO' }
//   o un archivo propio           video: { src: media('packcheck/demo.mp4'), poster: media('packcheck/poster.webp') }
//   Con `video`, aparece el botón "Ver video" en la tarjeta del proyecto.

const media = (path) => `${import.meta.env.BASE_URL}media/${path}`

export const profile = {
  name: 'Camila Beleño',
  fullName: 'Ing. Camila Andrea Beleño Cabrales',
  location: 'Colombia',
  email: 'cabcabrales1403@gmail.com',
  github: 'https://github.com/Camila-B14',
  githubLabel: 'github.com/Camila-B14',
}

export const filters = [
  { id: 'todos', label: 'Todos' },
  { id: 'vision', label: 'Visión artificial' },
  { id: 'web', label: 'Sistemas web' },
  { id: 'datos', label: 'Datos y tableros' },
  { id: 'auto', label: 'Automatización' },
]

export const projects = [
  {
    id: 'packcheck',
    index: '01',
    name: 'PackCheck',
    categories: ['vision', 'web', 'datos'],
    status: { tone: 'live', label: 'En piloto en producción · desde oct. 2026' },
    tagline: 'Del corte de pedidos del día a la caja cerrada: todo el despacho controlado en un solo sistema.',
    summary:
      'Sistema web a la medida para el área de despacho de una empresa colombiana de e-commerce. Carga en bloque los documentos de pedidos que exportan las plataformas de venta, entiende qué lleva cada pedido, lo pasa de inmediato a la mesa de empaque y allí verifica cada caja con visión artificial antes de cerrarla. Cada rol tiene su vista y la operación se mide día a día.',
    flow: ['Carga masiva del día', 'Lectura de pedidos', 'Mesa de empaque', 'Visión artificial', 'Métricas diarias'],
    metrics: [
      { value: 77, of: 77, label: 'guías leídas y cuadradas en cortes reales' },
      { value: 0, of: 45, label: 'cajas incorrectas aprobadas en la prueba de visión', good: 'low' },
      { value: 14, of: 15, label: 'cajas correctas aprobadas en la misma prueba' },
      { value: 45, label: 'pruebas automáticas con documentos reales' },
    ],
    caseStudy: {
      problem:
        'Una bodega que despacha decenas de pedidos al día desde varias plataformas de venta, con presentaciones X2/X3, combos y clientes repetidos en varias guías. Revisar a mano qué lleva cada caja era lento, y un producto o una cantidad equivocada significaba devolución, reenvío y un cliente molesto.',
      solution: [
        'Carga masiva del corte del día: se suben de una vez los documentos que exportan las plataformas de pedidos y cada transportadora, y el sistema cuadra lo leído contra los totales del mismo documento.',
        'Interpretación del pedido: traduce cada publicación a los productos reales que van en la caja (presentaciones X2/X3 y combos) y detecta pedidos duplicados del mismo destinatario.',
        'Paso inmediato a la mesa de empaque: cada pedido entra en la cola del empacador con lo que debe llevar.',
        'Verificación con visión artificial: foto de la caja abierta, detección y reconocimiento de cada producto, lectura de etiquetas y una explicación clara de lo que falta, lo que sobra o lo que no se reconoce.',
        'Excepciones con autorización del supervisor, trazabilidad completa y foto de evidencia de cada caja.',
        'Roles con permisos y vistas propias, métricas diarias de la operación y reentrenamiento automático del modelo cada noche con las fotos nuevas.',
      ],
      role:
        'Diseño y desarrollo de punta a punta: levantamiento del proceso en bodega, lectura de documentos, reglas de negocio, modelo de datos, visión artificial, interfaz por rol, métricas, despliegue en Azure, plan de lanzamiento y manuales de usuario.',
    },
    stack: ['React', 'FastAPI', 'PostgreSQL', 'PyTorch', 'YOLO-World', 'DINOv2', 'RapidOCR', 'Azure'],
    shots: [
      { label: 'Caja correcta · empacada', src: media('packcheck/caja-correcta.webp'), alt: 'PackCheck aprueba una caja: los 8 productos detectados coinciden con la guía' },
      { label: 'Faltan productos', src: media('packcheck/falta-producto.webp'), alt: 'PackCheck rechaza una caja: faltan 2 unidades y hay productos que no van en el pedido' },
      { label: 'Objetos sin reconocer', src: media('packcheck/no-reconocidos.webp'), alt: 'PackCheck marca objetos no reconocidos y productos de otra marca en la caja' },
    ],
    gallery: [
      { label: 'Producto que no va en el pedido', src: media('packcheck/producto-extra.webp'), alt: 'PackCheck detecta un producto que no corresponde a la guía' },
    ],
    video: null,
    links: [],
    note: 'Código privado del cliente. Las imágenes son de pruebas reales en bodega.',
  },
  {
    id: 'importaciones',
    index: '02',
    name: 'Sistema de importaciones',
    categories: ['web', 'datos'],
    status: { tone: 'live', label: 'En uso · 2026' },
    tagline: 'Se sube la orden de compra y la factura en PDF, y el sistema arma la operación completa.',
    summary:
      'Sistema web a la medida, con su tablero de control, para el área de importaciones de una empresa colombiana. Lee las órdenes de compra y facturas del proveedor, detecta contenedores, referencias y precios, y calcula los vencimientos de pago con sus descuentos por pronto pago.',
    flow: ['PDF de orden y factura', 'Contenedores y referencias', 'Revisión', 'Pagos y vencimientos', 'Tablero'],
    metrics: [
      { value: 20, label: 'contenedores detectados en una sola carga de PDF' },
      { value: 22, label: 'referencias leídas de la misma orden de compra' },
      { value: 4, label: 'fechas de pago calculadas con su descuento por pronto pago' },
      { text: 'USD · COP', label: 'costos por referencia con la TRM de la factura' },
    ],
    caseStudy: {
      problem:
        'Cada importación llega con órdenes de compra y facturas de decenas de contenedores y referencias. Digitarlas, cruzarlas con el catálogo y vigilar los vencimientos de pago en archivos de Excel tomaba horas y dejaba espacio para errores costosos.',
      solution: [
        'Lectura automática de la orden de compra y la factura en PDF: proveedor, fechas, TRM, contenedores, referencias, cantidades y costos.',
        'Cruce de cada referencia detectada con el catálogo, y una pantalla de revisión para corregir antes de guardar.',
        'Cálculo de vencimientos a 45, 69 y 89 días con su descuento por pronto pago, y el pago pleno.',
        'Registro de pagos y notas crédito por operación.',
        'Sincronización con los archivos maestros en OneDrive y usuarios con roles.',
        'Tablero de control: inversión total, contenedores, unidades, llegadas del mes, historial de costos en USD y COP y referencias en producción.',
      ],
      role: 'Análisis del proceso, diseño de la base de datos, lectores de PDF, desarrollo del sistema web y del tablero, e interfaz.',
    },
    stack: ['PHP', 'Python', 'Streamlit', 'pandas', 'Plotly', 'Microsoft Graph', 'OneDrive'],
    shots: [
      { label: 'Carga de orden de compra y factura', src: media('importaciones/carga-factura.webp'), alt: 'El sistema detecta 20 contenedores y 22 referencias de una orden de compra y calcula los vencimientos de pago' },
      { label: 'Referencias por contenedor', src: media('importaciones/referencias.webp'), alt: 'Revisión de las referencias detectadas en cada contenedor, con datos confidenciales difuminados' },
      { label: 'Tablero de control', src: '' },
    ],
    video: null,
    links: [{ label: 'Código del tablero', href: 'https://github.com/Camila-B14/Dashboard_logistica_distribucion_PYS' }],
    note: 'Datos del proveedor, códigos y costos difuminados por confidencialidad.',
  },
  {
    id: 'ductos',
    index: '03',
    name: 'Sistema para fábrica de ductos',
    categories: ['web'],
    status: { tone: 'live', label: 'Sistema a la medida' },
    tagline: 'Un sistema hecho a la medida de la operación de una fábrica de ductos.',
    summary: 'Muy pronto: el proceso que resuelve, capturas del sistema y sus resultados.',
    pending: true,
    stack: ['Manufactura', 'Sistema web'],
  },
  {
    id: 'finanzas',
    index: '04',
    name: 'MVP para finanzas',
    categories: ['web', 'datos'],
    status: { tone: 'wait', label: 'MVP en desarrollo' },
    tagline: 'Un producto propio pensado para el público de finanzas.',
    summary: 'En construcción. Aquí se podrá seguir su avance y ver las primeras pantallas.',
    pending: true,
    stack: ['Producto propio', 'Finanzas'],
  },
  {
    id: 'n8n',
    index: '05',
    name: 'Automatizaciones con n8n',
    categories: ['auto'],
    status: { tone: 'wait', label: 'Documentando' },
    tagline: 'Flujos que conectan herramientas y le quitan tareas repetitivas a los equipos.',
    summary:
      'Cada flujo tendrá aquí qué automatiza, cuánto tiempo ahorra y una captura del lienzo de n8n.',
    pending: true,
    sketch: 'flow',
    stack: ['n8n', 'APIs', 'Webhooks'],
  },
]

export const services = [
  {
    title: 'Sistemas a medida para la operación',
    text: 'Aplicaciones web para bodega, despacho, importaciones o planta, pensadas para quien las usa todo el día.',
    tag: 'React · FastAPI · PostgreSQL',
  },
  {
    title: 'Visión artificial aplicada',
    text: 'Verificación con cámara de lo que entra y sale: productos, cantidades, etiquetas y evidencia fotográfica.',
    tag: 'YOLO · DINOv2 · OCR',
  },
  {
    title: 'Tableros de datos',
    text: 'Tus archivos de Excel convertidos en indicadores claros, alertas de vencimiento y detalle a un clic.',
    tag: 'Python · Streamlit · Plotly',
  },
  {
    title: 'Automatizaciones',
    text: 'Flujos que mueven información entre tus herramientas sin copiar y pegar.',
    tag: 'n8n · APIs · Microsoft 365',
  },
]

export const process = [
  { step: 'Entender', text: 'Voy a la operación, observo el proceso real y mido dónde se pierde tiempo o se cometen errores.' },
  { step: 'Diseñar', text: 'Defino el flujo, las reglas de negocio y las pantallas con quienes las van a usar.' },
  { step: 'Construir y probar', text: 'Desarrollo por etapas y pruebo con documentos y datos reales, no con ejemplos inventados.' },
  { step: 'Desplegar y acompañar', text: 'Pongo el sistema en producción, capacito por rol y dejo manuales y respaldos.' },
]

export const stack = [
  { group: 'Desarrollo web', items: ['React', 'Vite', 'FastAPI', 'SQLAlchemy', 'PostgreSQL'] },
  { group: 'Visión artificial', items: ['PyTorch', 'YOLO-World', 'DINOv2', 'RapidOCR'] },
  { group: 'Datos', items: ['Python', 'pandas', 'Plotly', 'Streamlit', 'Excel'] },
  { group: 'Nube y automatización', items: ['Azure', 'Microsoft Graph', 'Caddy', 'n8n'] },
]
