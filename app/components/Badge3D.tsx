// app/components/Badge3D.tsx
'use client'
import * as THREE from 'three'
import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Text, Environment, Lightformer } from '@react-three/drei'
import { 
  BallCollider, 
  CuboidCollider, 
  Physics, 
  RigidBody, 
  useRopeJoint, 
  useSphericalJoint,
  RapierRigidBody 
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

interface Badge3DProps {
  name?: string
  title?: string
  className?: string
}

interface PortfolioBadgeProps {
  name: string
  title: string
}

export default function Badge3D({ 
  name = "John Doe", 
  title = "Full Stack Developer",
  className = ""
}: Badge3DProps) {
  return (
    <div className={`w-full h-96 ${className}`}>
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <PortfolioBadge name={name} title={title} />
        </Physics>
        <Environment background blur={0.75}>
          <color attach="background" args={['#1a1a1a']} />
          <Lightformer 
            intensity={2} 
            color="white" 
            position={[0, -1, 5]} 
            rotation={[0, 0, Math.PI / 3]} 
            scale={[100, 0.1, 1]} 
          />
          <Lightformer 
            intensity={3} 
            color="white" 
            position={[-1, -1, 1]} 
            rotation={[0, 0, Math.PI / 3]} 
            scale={[100, 0.1, 1]} 
          />
          <Lightformer 
            intensity={10} 
            color="white" 
            position={[-10, 0, 14]} 
            rotation={[0, Math.PI / 2, Math.PI / 3]} 
            scale={[100, 10, 1]} 
          />
        </Environment>
      </Canvas>
    </div>
  )
}

function PortfolioBadge({ name, title }: PortfolioBadgeProps) {
  const band = useRef<THREE.Mesh>(null)
  const fixed = useRef<RapierRigidBody>(null)
  const j1 = useRef<RapierRigidBody>(null)
  const j2 = useRef<RapierRigidBody>(null)
  const j3 = useRef<RapierRigidBody>(null)
  const card = useRef<RapierRigidBody>(null)

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()

  const { size } = useThree()
  const { width, height } = size

  const [curve] = useState(() =>
  new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ],
    false,
    'centripetal', // <- ini membuatnya lebih smooth
    0.5
  )
)


  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  const geometry = useMemo(() => {
    const g = new MeshLineGeometry()
    g.setPoints(curve.getPoints(32))
    return g
  }, [curve])

  const material = useMemo(() => {
    return new MeshLineMaterial({
      transparent: true,
      opacity: 0.8,
      color: new THREE.Color('#374151'),
      depthTest: false,
      resolution: new THREE.Vector2(width, height),
      lineWidth: 3
    })
  }, [width, height])

  useFrame((state) => {
  if (dragged && card.current) {
    vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
    dir.copy(vec).sub(state.camera.position).normalize()
    vec.add(dir.multiplyScalar(state.camera.position.length()))

    const bodies = [card, j1, j2, j3, fixed]
    bodies.forEach((ref) => ref.current?.wakeUp())

    card.current.setNextKinematicTranslation({
      x: vec.x - dragged.x,
      y: vec.y - dragged.y,
      z: vec.z - dragged.z
    })
  }

  if (fixed.current && band.current && card.current && j1.current && j2.current && j3.current) {
    // ✅ Perbaikan urutan titik tali
    curve.points[0].copy(fixed.current.translation())
    curve.points[1].copy(j1.current.translation())
    curve.points[2].copy(j2.current.translation())
    curve.points[3].copy(j3.current.translation())

    const g = band.current.geometry as any
    if (g.setPoints) g.setPoints(curve.getPoints(100))

    ang.copy(card.current.angvel())
    rot.copy(card.current.rotation())
    card.current.setAngvel({
      x: ang.x,
      y: ang.y - rot.y * 0.25,
      z: ang.z
    })
  }
})


  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} angularDamping={2} linearDamping={2} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} angularDamping={2} linearDamping={2}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} angularDamping={2} linearDamping={2}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} angularDamping={2} linearDamping={2}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody 
          position={[2, 0, 0]} 
          ref={card} 
          angularDamping={2} 
          linearDamping={2} 
          type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group 
            scale={1} 
            position={[0, 0, 0]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              const target = e.target as Element
              if ('releasePointerCapture' in target) {
                target.releasePointerCapture((e as any).pointerId)
              }
              drag(false)
            }}
            onPointerDown={(e) => {
              const target = e.target as Element
              if ('setPointerCapture' in target) {
                target.setPointerCapture((e as any).pointerId)
              }
              if (card.current) {
                const point = (e as any).point as THREE.Vector3
                const translation = card.current.translation()
                drag(new THREE.Vector3().copy(point).sub(vec.copy(translation)))
              }
            }}>
            <mesh position={[0, 0, -0.01]}>
              <boxGeometry args={[1.6, 2.25, 0.02]} />
              <meshPhysicalMaterial 
                color="#ffffff"
                clearcoat={1}
                clearcoatRoughness={0.1}
                roughness={0.2}
                metalness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.7, 2.35, 0.01]} />
              <meshPhysicalMaterial 
                color="#2563eb"
                clearcoat={1}
                clearcoatRoughness={0.05}
                roughness={0.1}
                metalness={0.8} />
            </mesh>
            <Text position={[0, -0.5, 0.02]} fontSize={0.20} color="White" anchorX="center" anchorY="middle" maxWidth={1.4}>
              {name}
            </Text>
            <Text position={[0, -0.7, 0.02]} fontSize={0.13} color="#6b7280" anchorX="center" anchorY="middle" maxWidth={1.4}>
              {title}
            </Text>
            <mesh position={[0, 0.3, 0.025]}>
              <circleGeometry args={[0.60, 30]} />
              <meshStandardMaterial color="#ccc" />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} geometry={geometry} material={material} />
    </>
  )
}
