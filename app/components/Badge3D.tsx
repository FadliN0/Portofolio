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
        <ambientLight intensity={Math.PI * 0.8} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <PortfolioBadge name={name} title={title} />
        </Physics>
        <Environment background blur={0.75}>
          <color attach="background" args={['#0f0820']} />
          <Lightformer 
            intensity={3} 
            color="#ff6b9d" 
            position={[0, -1, 5]} 
            rotation={[0, 0, Math.PI / 3]} 
            scale={[100, 0.1, 1]} 
          />
          <Lightformer 
            intensity={4} 
            color="#4ecdc4" 
            position={[-1, -1, 1]} 
            rotation={[0, 0, Math.PI / 3]} 
            scale={[100, 0.1, 1]} 
          />
          <Lightformer 
            intensity={8} 
            color="#45b7d1" 
            position={[-10, 0, 14]} 
            rotation={[0, Math.PI / 2, Math.PI / 3]} 
            scale={[100, 10, 1]} 
          />
          <Lightformer 
            intensity={5} 
            color="#96ceb4" 
            position={[10, 5, 2]} 
            rotation={[0, -Math.PI / 2, Math.PI / 4]} 
            scale={[50, 8, 1]} 
          />
        </Environment>
      </Canvas>
    </div>
  )
}

function PortfolioBadge({ name, title }: PortfolioBadgeProps) {
  const band = useRef<THREE.Mesh>(null!)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<RapierRigidBody>(null!)
  const j2 = useRef<RapierRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)
  const bgMesh = useRef<THREE.Mesh>(null!)
  const frameMesh = useRef<THREE.Mesh>(null!)
  const avatarMesh = useRef<THREE.Mesh>(null!)

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
      'chordal',
      0.1
    )
  )

  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  // Create gradient materials
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')!
    
    // Create radial gradient
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, '#ff6b9d')
    gradient.addColorStop(0.3, '#4ecdc4')
    gradient.addColorStop(0.6, '#45b7d1')
    gradient.addColorStop(1, '#96ceb4')
    
    context.fillStyle = gradient
    context.fillRect(0, 0, 256, 256)
    
    return new THREE.CanvasTexture(canvas)
  }, [])

  const frameGradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')!
    
    // Create linear gradient for frame
    const gradient = context.createLinearGradient(0, 0, 256, 256)
    gradient.addColorStop(0, '#ffd700')
    gradient.addColorStop(0.25, '#ff8c00')
    gradient.addColorStop(0.5, '#ff6b9d')
    gradient.addColorStop(0.75, '#8a2be2')
    gradient.addColorStop(1, '#4b0082')
    
    context.fillStyle = gradient
    context.fillRect(0, 0, 256, 256)
    
    return new THREE.CanvasTexture(canvas)
  }, [])

  const avatarGradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')!
    
    // Create circular gradient for avatar
    const gradient = context.createRadialGradient(128, 128, 20, 128, 128, 128)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(0.4, '#f0f9ff')
    gradient.addColorStop(0.7, '#dbeafe')
    gradient.addColorStop(1, '#3b82f6')
    
    context.fillStyle = gradient
    context.fillRect(0, 0, 256, 256)
    
    return new THREE.CanvasTexture(canvas)
  }, [])

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
    g.setPoints(curve.getPoints())
    return g
  }, [curve])

  const material = useMemo(() => {
    return new MeshLineMaterial({
      opacity: 0.9,
      color: new THREE.Color('#ff6b9d'),
      resolution: new THREE.Vector2(width, height),
      lineWidth: 4
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
      curve.points[0].copy(fixed.current.translation())
      curve.points[1].copy(j1.current.translation())
      curve.points[2].copy(j2.current.translation())
      curve.points[3].copy(j3.current.translation())

      const g = band.current.geometry as MeshLineGeometry
      if (g.setPoints) g.setPoints(curve.getPoints(100))

      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
        true
      )
    }

    // Subtle color animation without rotation
    const time = state.clock.elapsedTime
    if (bgMesh.current) {
      const material = bgMesh.current.material as THREE.MeshPhysicalMaterial
      material.emissiveIntensity = 0.2 + Math.sin(time * 0.5) * 0.1
    }
    if (frameMesh.current) {
      const material = frameMesh.current.material as THREE.MeshPhysicalMaterial
      material.emissiveIntensity = 0.1 + Math.sin(time * 0.3) * 0.05
    }
    if (avatarMesh.current) {
      const material = avatarMesh.current.material as THREE.MeshPhysicalMaterial
      material.emissiveIntensity = 0.1 + Math.sin(time * 0.7) * 0.08
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
                (target as HTMLElement).releasePointerCapture((e as unknown as React.PointerEvent).pointerId)
              }
              drag(false)
            }}
            onPointerDown={(e) => {
              const target = e.target as Element
              if ('setPointerCapture' in target) {
                (target as HTMLElement).setPointerCapture((e as unknown as React.PointerEvent).pointerId)
              }
              if (card.current) {
                const point = (e as unknown as React.PointerEvent & { point: THREE.Vector3 }).point
                const translation = card.current.translation()
                drag(new THREE.Vector3().copy(point).sub(vec.copy(translation)))
              }
            }}>
            
            {/* Background with gradient */}
            <mesh ref={bgMesh} position={[0, 0, -0.01]}>
              <boxGeometry args={[1.6, 2.25, 0.02]} />
              <meshPhysicalMaterial 
                map={gradientTexture}
                clearcoat={1}
                clearcoatRoughness={0.1}
                roughness={0.2}
                metalness={0.3}
                emissive="#111111"
                emissiveIntensity={0.2} />
            </mesh>
            
            {/* Frame with rainbow gradient */}
            <mesh ref={frameMesh} position={[0, 0, 0]}>
              <boxGeometry args={[1.7, 2.35, 0.01]} />
              <meshPhysicalMaterial 
                map={frameGradientTexture}
                clearcoat={1}
                clearcoatRoughness={0.05}
                roughness={0.1}
                metalness={0.8}
                emissive="#333333"
                emissiveIntensity={0.1} />
            </mesh>
            
            {/* Name text with glow effect */}
            <Text 
              position={[0, -0.5, 0.02]} 
              fontSize={0.20} 
              color="#ffffff" 
              anchorX="center" 
              anchorY="middle" 
              maxWidth={1.4}
              outlineWidth={0.01}
              outlineColor="#ff6b9d">
              {name}
            </Text>
            
            {/* Title text with different color */}
            <Text 
              position={[0, -0.7, 0.02]} 
              fontSize={0.13} 
              color="#4ecdc4" 
              anchorX="center" 
              anchorY="middle" 
              maxWidth={1.4}
              outlineWidth={0.005}
              outlineColor="#ffffff">
              {title}
            </Text>
            
            {/* Avatar with gradient */}
            <mesh ref={avatarMesh} position={[0, 0.3, 0.025]}>
              <circleGeometry args={[0.60, 30]} />
              <meshPhysicalMaterial 
                map={avatarGradientTexture}
                clearcoat={1}
                clearcoatRoughness={0.2}
                roughness={0.3}
                metalness={0.1}
                emissive="#0066cc"
                emissiveIntensity={0.1} />
            </mesh>
            
            {/* Inner circle for avatar */}
            <mesh position={[0, 0.3, 0.03]}>
              <circleGeometry args={[0.45, 30]} />
              <meshPhysicalMaterial 
                color="#ffffff"
                clearcoat={1}
                clearcoatRoughness={0.1}
                roughness={0.2}
                metalness={0.2}
                opacity={0.9}
                transparent />
            </mesh>
            
            {/* Decorative elements */}
            <mesh position={[-0.6, 0.8, 0.03]}>
              <circleGeometry args={[0.05, 8]} />
              <meshPhysicalMaterial 
                color="#ffd700"
                emissive="#ffd700"
                emissiveIntensity={0.5} />
            </mesh>
            
            <mesh position={[0.6, 0.8, 0.03]}>
              <circleGeometry args={[0.05, 8]} />
              <meshPhysicalMaterial 
                color="#ff6b9d"
                emissive="#ff6b9d"
                emissiveIntensity={0.5} />
            </mesh>
            
            <mesh position={[-0.6, -0.9, 0.03]}>
              <circleGeometry args={[0.04, 6]} />
              <meshPhysicalMaterial 
                color="#4ecdc4"
                emissive="#4ecdc4"
                emissiveIntensity={0.4} />
            </mesh>
            
            <mesh position={[0.6, -0.9, 0.03]}>
              <circleGeometry args={[0.04, 6]} />
              <meshPhysicalMaterial 
                color="#96ceb4"
                emissive="#96ceb4"
                emissiveIntensity={0.4} />
            </mesh>
            
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} geometry={geometry} material={material} />
    </>
  )
}