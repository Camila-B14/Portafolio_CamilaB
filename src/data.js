// Todo el contenido del portafolio vive aquí: para agregar un proyecto o cambiar un texto
// no hace falta tocar los componentes.

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
    categories: ['vision', 'web'],
    status: { tone: 'live', label: 'En piloto en producción · desde oct. 2026' },
    tagline: 'Ninguna caja sale de la bodega hasta que una foto y su peso coinciden con la guía.',
    summary:
      'Sistema web para el área de empaque de una empresa colombiana de e-commerce que despacha por Dropi. Verifica cada caja con visión artificial y báscula antes de cerrarla.',
    metrics: [
      { value: 77, of: 77, label: 'guías leídas y cuadradas en cortes reales' },
      { value: 0, of: 45, label: 'cajas incorrectas aprobadas en la prueba de visión', good: 'low' },
      { value: 14, of: 15, label: 'cajas correctas aprobadas en la misma prueba' },
      { value: 45, label: 'pruebas automáticas con documentos reales' },
    ],
    caseStudy: {
      problem:
        'Una bodega que despacha decenas de guías al día (51 en un corte típico), con presentaciones X2/X3, combos y clientes repetidos en varias guías. Un producto o una cantidad equivocada significa devolución, reenvío y un cliente molesto.',
      solution: [
        'Lectura de los PDF de despacho con un lector por transportadora (Envía, Interrapidísimo, Coordinadora) y cuadre automático contra los totales del mismo documento.',
        'Reglas que traducen cada publicación a lo que va realmente en la caja: presentaciones X2/X3 y combos.',
        'Detección de pedidos duplicados del mismo destinatario antes de empacar.',
        'Verificación por foto con detector de objetos, reconocimiento por similitud de imágenes y lectura de etiquetas para separar productos casi idénticos.',
        'Control por peso y reentrenamiento automático cada noche con las fotos nuevas.',
        'Usuarios por rol y trazabilidad: quién empacó, quién autorizó una excepción y por qué, con foto de evidencia.',
      ],
      role:
        'Diseño y desarrollo de punta a punta: levantamiento del proceso en bodega, lectura de documentos, reglas de negocio, modelo de datos, visión artificial, interfaz por rol, despliegue en Azure, plan de lanzamiento y manuales de usuario.',
    },
    stack: ['React', 'FastAPI', 'PostgreSQL', 'PyTorch', 'YOLO-World', 'DINOv2', 'RapidOCR', 'Azure'],
    shots: ['Mesa de empaque', 'Caja aprobada', 'Caja con error'],
    links: [],
    note: 'Código privado del cliente. Este caso muestra el proyecto.',
  },
  {
    id: 'importaciones',
    index: '02',
    name: 'Tablero de importaciones',
    categories: ['datos'],
    status: { tone: 'live', label: 'En uso · 2026' },
    tagline: 'La trazabilidad logística y financiera de cada importación, en una sola pantalla.',
    summary:
      'Dashboard para el área de planeación e importaciones de una empresa colombiana. Lee los archivos maestros desde OneDrive y los convierte en indicadores, alertas y detalle por operación.',
    metrics: [
      { text: '3', label: 'módulos: operaciones, detalle y producción' },
      { text: 'USD · COP', label: 'costos por referencia en ambas monedas' },
    ],
    caseStudy: {
      problem:
        'La información de cada importación vivía en archivos de Excel grandes: saber qué llegaba este mes, cuánto se había invertido o qué pagos estaban por vencer exigía filtrar a mano cada vez.',
      solution: [
        'Conexión segura a los archivos maestros en OneDrive por Microsoft Graph, con sincronización a un clic.',
        'Control general: inversión total, contenedores, unidades importadas y llegadas del mes.',
        'Historial de variaciones de costo por referencia en USD y COP.',
        'Detalle por operación con vencimientos financieros y referencias por contenedor.',
        'Seguimiento de las referencias que siguen en producción.',
      ],
      role: 'Análisis del proceso, modelo de datos sobre Excel, desarrollo del tablero y diseño de la interfaz.',
    },
    stack: ['Python', 'Streamlit', 'pandas', 'Plotly', 'Microsoft Graph', 'Excel'],
    shots: ['Control general de operaciones', 'Detalle por operación', 'Referencias en producción'],
    links: [{ label: 'Ver código', href: 'https://github.com/Camila-B14/Dashboard_logistica_distribucion_PYS' }],
  },
  {
    id: 'n8n',
    index: '03',
    name: 'Automatizaciones con n8n',
    categories: ['auto'],
    status: { tone: 'wait', label: 'Documentando' },
    tagline: 'Flujos que conectan herramientas y le quitan tareas repetitivas a los equipos.',
    summary:
      'Cada flujo tendrá aquí qué automatiza, cuánto tiempo ahorra y una captura del lienzo de n8n.',
    pending: true,
    stack: ['n8n', 'APIs', 'Webhooks'],
  },
]

export const services = [
  {
    title: 'Sistemas a medida para la operación',
    text: 'Aplicaciones web para bodega, empaque o despacho, pensadas para el operario que las usa todo el día.',
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
