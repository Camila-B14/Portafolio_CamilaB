import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { filters, process, profile, projects, services, stack } from './data.js'

const ease = [0.22, 1, 0.36, 1]

/* ------------------------------------------------------------------ utilidades */

// Aparece al entrar en pantalla, desde un estado ya visible (nunca opacidad 0).
function Reveal({ children, delay = 0, y = 28, className, as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0.35, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </M>
  )
}

function CountUp({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(to)
  useEffect(() => {
    if (!inView || reduce || to === 0) return
    const controls = animate(0, to, {
      duration: 1.4,
      ease,
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduce, to])
  return <span ref={ref}>{value}</span>
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])
  return active
}

/* ------------------------------------------------------------------ navegación */

const sections = [
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'proceso', label: 'Cómo trabajo' },
  { id: 'sobre-mi', label: 'Sobre mí' },
]
const sectionIds = ['inicio', ...sections.map((s) => s.id), 'contacto']

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />
}

function Nav() {
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => scrollY.on('change', (y) => setScrolled(y > 24)), [scrollY])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <a href="#inicio" className="brand" aria-label="Camila Beleño, ir al inicio">
          <span className="brand-mark" aria-hidden="true">CB</span>
          <span>{profile.name}</span>
        </a>
        <LayoutGroup id="nav">
          <nav aria-label="Secciones" className="nav-links">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : ''}>
                {active === s.id && (
                  <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                )}
                <span className="nav-label">{s.label}</span>
              </a>
            ))}
          </nav>
        </LayoutGroup>
        <motion.a href="#contacto" className="btn btn-solid nav-cta" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
          Hablemos
        </motion.a>
        <button
          id="menu-toggle"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          <motion.span className="bar" animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} />
          <motion.span className="bar" animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-mobile"
            className="menu-mobile"
            aria-label="Secciones"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="wrap">
              {[...sections, { id: 'contacto', label: 'Contacto' }].map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i + 0.1, ease }}
                >
                  <span className="mono">0{i + 1}</span> {s.label}
                </motion.a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ------------------------------------------------------------------ hero */

const slipRows = [
  { item: 'Producto A · presentación X2', check: '2 / 2' },
  { item: 'Producto B · combo', check: '1 / 1' },
  { item: 'Peso en báscula', check: '1,24 kg' },
  { item: 'Foto analizada', check: 'coincide' },
]

function PackingSlip() {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(reduce ? slipRows.length : 0)
  const [box, setBox] = useState(42)

  useEffect(() => {
    if (reduce) return setStep(slipRows.length)
    if (step >= slipRows.length) return
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 520)
    return () => clearTimeout(t)
  }, [step, reduce])

  const done = step >= slipRows.length
  const replay = () => {
    setBox((b) => b + 1)
    setStep(reduce ? slipRows.length : 0)
  }

  return (
    <motion.figure
      className="slip"
      initial={{ opacity: 0, y: 40, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease }}
      aria-label="Demostración: verificación de una caja en PackCheck"
    >
      <div className="slip-head">
        <div>
          <span className="mono">PackCheck · guía</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.b
              key={box}
              className="slip-box"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              Caja {String(box).padStart(4, '0')}
            </motion.b>
          </AnimatePresence>
        </div>
        <span className="mono slip-meta">Mesa 2<br />Corte 14:00</span>
      </div>

      <ol className="slip-rows">
        {slipRows.map((r, i) => {
          const checked = step > i
          const scanning = step === i && !reduce
          return (
            <li key={r.item} className={checked ? 'is-checked' : ''}>
              {scanning && <motion.span layoutId="scan" className="scan" transition={{ duration: 0.4, ease }} />}
              <span className="slip-item">{r.item}</span>
              <span className="slip-check">
                <span className="tnum">{r.check}</span>
                <motion.svg viewBox="0 0 20 20" className="tick" aria-hidden="true">
                  <motion.path
                    d="M4 10.5l4 4 8-9"
                    fill="none"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={false}
                    animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                    transition={{ duration: 0.35, ease }}
                  />
                </motion.svg>
              </span>
            </li>
          )
        })}
      </ol>

      <div className="slip-foot">
        <button id="slip-replay" className="link-btn" onClick={replay} disabled={!done}>
          Verificar otra caja ↻
        </button>
        <AnimatePresence>
          {done && (
            <motion.span
              key={`stamp-${box}`}
              className="stamp"
              initial={{ scale: 1.8, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: -5 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 16 }}
            >
              Empacada
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.figure>
  )
}

const headline = ['Software', 'que', 'cuida', 'lo', 'que', 'sale', 'de', 'la', 'bodega.']

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const ySlip = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section id="inicio" className="hero" ref={ref}>
      <div className="wrap hero-grid">
        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="dot" aria-hidden="true" /> Disponible para proyectos · {profile.location}
          </motion.p>
          <h1 className="hero-title" aria-label={headline.join(' ')}>
            {headline.map((w, i) => (
              <span className="word-mask" key={i} aria-hidden="true">
                <motion.span
                  className={`word ${w === 'cuida' ? 'word-mark' : ''}`}
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.055, ease }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="lede"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
          >
            Soy {profile.fullName}. Diseño y desarrollo sistemas para operaciones logísticas: verificación de
            empaque con visión artificial, tableros de control de importaciones y automatizaciones que le quitan
            trabajo manual a los equipos.
          </motion.p>
          <motion.div
            className="cta-row"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease }}
          >
            <motion.a href="#proyectos" className="btn btn-solid" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              Ver casos de estudio <span aria-hidden="true">→</span>
            </motion.a>
            <motion.a href="#contacto" className="btn btn-ghost" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              Contarme tu proyecto
            </motion.a>
          </motion.div>
          <motion.dl
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
          >
            <div><dt>Guías verificadas</dt><dd className="tnum">77/77</dd></div>
            <div><dt>Errores aprobados</dt><dd className="tnum">0</dd></div>
            <div><dt>Pruebas automáticas</dt><dd className="tnum">45</dd></div>
          </motion.dl>
        </div>
        <motion.div style={{ y: ySlip }} className="hero-visual">
          <PackingSlip />
        </motion.div>
      </div>
      <Marquee />
    </section>
  )
}

function Marquee() {
  const words = ['Visión artificial', 'Sistemas web', 'Tableros de datos', 'Automatización', 'Logística', 'Despliegue en la nube']
  const reduce = useReducedMotion()
  const row = [...words, ...words]
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div
        className="marquee-track"
        animate={reduce ? {} : { x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {row.map((w, i) => (
          <span key={i}>{w}<i>✦</i></span>
        ))}
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ proyectos */

function Shot({ label, big }) {
  return (
    <motion.div className={`shot ${big ? 'shot-big' : ''}`} whileHover={{ scale: 1.015 }} transition={{ duration: 0.3 }}>
      <div className="shot-bar" aria-hidden="true"><i /><i /><i /></div>
      <div className="shot-body">
        <span className="mono">Captura pendiente</span>
        <span>{label}</span>
      </div>
    </motion.div>
  )
}

function Metric({ m }) {
  return (
    <div className="metric">
      <b className="tnum">
        {m.text ? m.text : <><CountUp to={m.value} />{m.of != null && <span className="of"> / {m.of}</span>}</>}
      </b>
      <span>{m.label}</span>
    </div>
  )
}

function CaseStudy({ p }) {
  return (
    <motion.div
      className="case"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="case-inner">
        <div>
          <h4 className="mono">El problema</h4>
          <p>{p.caseStudy.problem}</p>
          <h4 className="mono">Mi rol</h4>
          <p>{p.caseStudy.role}</p>
        </div>
        <div>
          <h4 className="mono">La solución</h4>
          <ol className="case-list">
            {p.caseStudy.solution.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06, ease }}
              >
                {s}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectCard({ p }) {
  const [open, setOpen] = useState(false)

  if (p.pending) {
    return (
      <motion.article layout className="project project-pending" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.45, ease }}>
        <div className="project-top">
          <span className="project-index mono">{p.index}</span>
          <span className={`status status-${p.status.tone}`}>{p.status.label}</span>
        </div>
        <div className="pending-grid">
          <div>
            <h3 className="project-name">{p.name}</h3>
            <p className="project-tagline">{p.tagline}</p>
            <p className="muted">{p.summary}</p>
          </div>
          <FlowSketch />
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      layout
      className="project"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="project-top">
        <span className="project-index mono">{p.index}</span>
        <span className={`status status-${p.status.tone}`}>{p.status.label}</span>
      </div>
      <div className="project-grid">
        <div className="project-copy">
          <h3 className="project-name">{p.name}</h3>
          <p className="project-tagline">{p.tagline}</p>
          <p className="muted">{p.summary}</p>
          <div className={`metrics metrics-${p.metrics.length}`}>
            {p.metrics.map((m, i) => <Metric key={i} m={m} />)}
          </div>
          <ul className="chips" aria-label="Tecnologías">
            {p.stack.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <div className="project-actions">
            <motion.button
              id={`case-${p.id}`}
              className="btn btn-solid"
              aria-expanded={open}
              aria-controls={`case-panel-${p.id}`}
              onClick={() => setOpen((o) => !o)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {open ? 'Cerrar caso' : 'Ver caso completo'}
              <motion.span aria-hidden="true" animate={{ rotate: open ? 45 : 0 }} className="plus">+</motion.span>
            </motion.button>
            {p.links.map((l) => (
              <a key={l.href} href={l.href} className="text-link" target="_blank" rel="noreferrer">{l.label} ↗</a>
            ))}
          </div>
          {p.note && <p className="note mono">{p.note}</p>}
        </div>
        <div className="shots">
          <Shot label={p.shots[0]} big />
          <Shot label={p.shots[1]} />
          <Shot label={p.shots[2]} />
        </div>
      </div>
      <div id={`case-panel-${p.id}`}>
        <AnimatePresence initial={false}>{open && <CaseStudy p={p} />}</AnimatePresence>
      </div>
    </motion.article>
  )
}

function FlowSketch() {
  const nodes = ['Disparador', 'Procesar', 'Decidir', 'Notificar']
  return (
    <div className="flow" aria-hidden="true">
      {nodes.map((n, i) => (
        <div key={n} className="flow-step">
          <motion.span
            className="flow-node"
            initial={{ opacity: 0.3, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i, ease }}
          >
            {n}
          </motion.span>
          {i < nodes.length - 1 && (
            <svg className="flow-line" viewBox="0 0 40 10">
              <motion.path
                d="M0 5 H34 M30 1 L36 5 L30 9"
                fill="none"
                strokeWidth="1.5"
                initial={{ pathLength: 0.2 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i + 0.1, duration: 0.5 }}
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

function Projects() {
  const [filter, setFilter] = useState('todos')
  const list = projects.filter((p) => filter === 'todos' || p.categories.includes(filter))
  return (
    <section id="proyectos" className="section">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">Casos de estudio</p>
            <h2 className="section-title">Proyectos que ya están trabajando</h2>
          </div>
          <LayoutGroup id="filters">
            <div className="filters" role="tablist" aria-label="Filtrar proyectos">
              {filters.map((f) => (
                <button
                  key={f.id}
                  id={`filter-${f.id}`}
                  role="tab"
                  aria-selected={filter === f.id}
                  className={filter === f.id ? 'is-active' : ''}
                  onClick={() => setFilter(f.id)}
                >
                  {filter === f.id && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span className="nav-label">{f.label}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </Reveal>
        <motion.div layout className="project-list">
          <AnimatePresence mode="popLayout">
            {list.map((p) => <ProjectCard key={p.id} p={p} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ servicios, proceso, stack */

function Services() {
  return (
    <section id="servicios" className="section section-alt">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">Servicios</p>
            <h2 className="section-title">En qué te puedo ayudar</h2>
          </div>
          <p className="section-sub">Trabajo con equipos de operación, logística y comercio electrónico que todavía resuelven a mano lo que un sistema podría hacer solo.</p>
        </Reveal>
        <div className="services">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="service-wrap">
              <motion.article className="service" whileHover="hover" initial="rest" animate="rest">
                <span className="mono service-n">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="mono service-tag">{s.tag}</span>
                <motion.span
                  className="service-fill"
                  aria-hidden="true"
                  variants={{ rest: { scaleY: 0 }, hover: { scaleY: 1 } }}
                  transition={{ duration: 0.45, ease }}
                />
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <section id="proceso" className="section">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">Cómo trabajo</p>
            <h2 className="section-title">De la bodega al despliegue</h2>
          </div>
        </Reveal>
        <div className="process" ref={ref}>
          <div className="process-rail" aria-hidden="true">
            <motion.div className="process-rail-fill" style={{ scaleY: line }} />
          </div>
          {process.map((p, i) => (
            <Reveal key={p.step} delay={0.05 * i} className="process-step">
              <span className="process-dot" aria-hidden="true">{i + 1}</span>
              <div>
                <h3>{p.step}</h3>
                <p>{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="sobre-mi" className="section section-alt">
      <div className="wrap about">
        <Reveal className="about-photo">
          <div className="photo-slot">
            <span className="brand-mark big" aria-hidden="true">CB</span>
            <span className="mono">Foto pendiente</span>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow">Sobre mí</p>
            <h2 className="section-title">Ingeniera entre la operación y el código.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="about-text">
              Entro a la bodega, entiendo cómo se mueve el producto y construyo la herramienta que hace falta. Me
              encargo de todo el camino: el levantamiento del proceso, el desarrollo, las pruebas con datos reales,
              el despliegue en la nube y los manuales para cada rol.
            </p>
            <p className="todo">Pendiente: carrera, universidad, años de experiencia y foto.</p>
          </Reveal>
          <Reveal delay={0.15} className="stack">
            {stack.map((g) => (
              <div key={g.group} className="stack-group">
                <h3 className="mono">{g.group}</h3>
                <ul className="chips">{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ contacto */

function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <section id="contacto" className="contact">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow eyebrow-dark">Contacto</p>
          <h2 className="contact-title">
            ¿Tienes un proceso que <span className="word-mark">se hace a mano</span>?
          </h2>
          <p className="contact-sub">Cuéntame cómo funciona hoy y te digo qué se puede automatizar.</p>
        </Reveal>
        <Reveal delay={0.1} className="contact-row">
          <div className="email-box">
            <span className="mono">Correo</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
          <motion.button id="copy-email" className="btn btn-tape" onClick={copy} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? 'ok' : 'copy'}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? 'Correo copiado ✓' : 'Copiar correo'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <motion.a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost-dark" whileHover={{ y: -2 }}>
            GitHub ↗
          </motion.a>
        </Reveal>
      </div>
      <footer className="wrap footer">
        <span>© 2026 {profile.fullName}</span>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>
    </section>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#proyectos" className="skip">Saltar a los proyectos</a>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Services />
        <Process />
        <About />
      </main>
      <Contact />
    </MotionConfig>
  )
}
