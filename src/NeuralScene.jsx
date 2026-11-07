import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* Red neuronal 3D con los colores de la marca: nodos que respiran, conexiones,
   pulsos de datos que viajan entre nodos y un núcleo geométrico que gira.
   Se pausa cuando no está en pantalla y queda quieta si el sistema pide menos movimiento. */

const LAVENDER = new THREE.Color('#b8a1d9')
const PURPLE = new THREE.Color('#8b5cc4')
const WHITE = new THREE.Color('#f5f1fa')

function rng(seed) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

function useGraph(count = 84) {
  return useMemo(() => {
    const rand = rng(14)
    const nodes = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const t = golden * i
      const radius = 2.6 + (rand() - 0.5) * 1.3
      nodes.push(new THREE.Vector3(Math.cos(t) * r * radius, y * radius * 0.92, Math.sin(t) * r * radius))
    }
    const edges = []
    const seen = new Set()
    nodes.forEach((a, i) => {
      nodes
        .map((b, j) => [j, a.distanceTo(b)])
        .filter(([j]) => j !== i)
        .sort((p, q) => p[1] - q[1])
        .slice(0, 3)
        .forEach(([j]) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`
          if (!seen.has(key)) {
            seen.add(key)
            edges.push([i, j])
          }
        })
    })
    const neighbors = nodes.map(() => [])
    edges.forEach(([a, b]) => {
      neighbors[a].push(b)
      neighbors[b].push(a)
    })
    const sizes = nodes.map(() => 0.022 + rand() * 0.036)
    return { nodes, edges, neighbors, sizes, rand }
  }, [count])
}

function Network({ reduce }) {
  const group = useRef()
  const core = useRef()
  const nodesRef = useRef()
  const pulsesRef = useRef()
  const { nodes, edges, neighbors, sizes, rand } = useGraph()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const lineGeo = useMemo(() => {
    const pos = new Float32Array(edges.length * 6)
    edges.forEach(([a, b], k) => {
      nodes[a].toArray(pos, k * 6)
      nodes[b].toArray(pos, k * 6 + 3)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [edges, nodes])

  const PULSES = 18
  const pulses = useMemo(
    () =>
      Array.from({ length: PULSES }, () => {
        const from = Math.floor(rand() * nodes.length)
        const to = neighbors[from][Math.floor(rand() * neighbors[from].length)]
        return { from, to, t: rand(), speed: 0.35 + rand() * 0.5 }
      }),
    [nodes, neighbors, rand],
  )

  useEffect(() => {
    nodes.forEach((p, i) => {
      dummy.position.copy(p)
      dummy.scale.setScalar(sizes[i] / 0.06)
      dummy.updateMatrix()
      nodesRef.current.setMatrixAt(i, dummy.matrix)
      const c = i % 7 === 0 ? WHITE : i % 3 === 0 ? PURPLE : LAVENDER
      nodesRef.current.setColorAt(i, c)
    })
    nodesRef.current.instanceMatrix.needsUpdate = true
    nodesRef.current.instanceColor.needsUpdate = true
  }, [nodes, sizes, dummy])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const d = Math.min(delta, 0.05)
    const g = group.current
    // giro lento + seguir el mouse con suavidad
    g.rotation.y += d * 0.12
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.35, 0.04)
    g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.35, 0.04)
    core.current.rotation.x -= d * 0.25
    core.current.rotation.y -= d * 0.18

    // nodos que respiran
    nodes.forEach((p, i) => {
      dummy.position.copy(p)
      dummy.scale.setScalar((sizes[i] / 0.06) * (1 + Math.sin(t * 1.6 + i) * 0.25))
      dummy.updateMatrix()
      nodesRef.current.setMatrixAt(i, dummy.matrix)
    })
    nodesRef.current.instanceMatrix.needsUpdate = true

    // pulsos de datos viajando por las conexiones
    pulses.forEach((p, i) => {
      p.t += d * p.speed
      if (p.t >= 1) {
        p.t = 0
        p.from = p.to
        const n = neighbors[p.from]
        p.to = n[Math.floor(rand() * n.length)]
      }
      dummy.position.lerpVectors(nodes[p.from], nodes[p.to], p.t)
      dummy.scale.setScalar(0.9 + Math.sin(p.t * Math.PI) * 0.8)
      dummy.updateMatrix()
      pulsesRef.current.setMatrixAt(i, dummy.matrix)
    })
    pulsesRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={group} rotation={[0.25, reduce ? 0.6 : 0, 0]}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={LAVENDER} transparent opacity={0.22} />
      </lineSegments>
      <instancedMesh ref={nodesRef} args={[null, null, nodes.length]}>
        <sphereGeometry args={[0.06, 14, 14]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={pulsesRef} args={[null, null, PULSES]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color={WHITE} toneMapped={false} transparent opacity={0.95} />
      </instancedMesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={PURPLE} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial color={LAVENDER} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export default function NeuralScene({ className }) {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)
  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    if (wrap.current) obs.observe(wrap.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduce ? 'demand' : visible ? 'always' : 'never'}
      >
        <Network reduce={reduce} />
      </Canvas>
    </div>
  )
}
