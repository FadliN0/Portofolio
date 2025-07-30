"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, useTexture, Text } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import * as THREE from "three";

function Card() {
  const photoUrl = "/foto.png";
  const name = "Fadli Nofrizal";
  const title = "Fullstack Developer";
  const photoTexture = useTexture(photoUrl);

  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 2.25, 0.02]} />
        <meshPhysicalMaterial
          color="#f8f9fa"
          clearcoat={1}
          clearcoatRoughness={0.15}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0, 0.011]}>
        <planeGeometry args={[1.4, 2]} />
        <meshBasicMaterial color="#6366f1" />
      </mesh>
      <mesh position={[0, 0.5, 0.012]}>
        <circleGeometry args={[0.4, 64]} />
        <meshBasicMaterial
          map={photoTexture}
          toneMapped={false}
          side={THREE.DoubleSide}
          transparent={true}
        />
      </mesh>
      <Text position={[0, -0.3, 0.013]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle">
        {name}
      </Text>
      <Text position={[0, -0.5, 0.013]} fontSize={0.09} color="#d1d5db" anchorX="center" anchorY="middle">
        {title}
      </Text>
      <mesh position={[0, 1.2, 0.01]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshPhysicalMaterial color="#888" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.05, 0.01]}>
        <boxGeometry args={[0.15, 0.05, 0.02]} />
        <meshPhysicalMaterial color="#666" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

export default function Lanyard({
  position = [0, 4, 30] as [number, number, number],
  gravity = [0, -40, 0] as [number, number, number],
  fov = 25,
  transparent = true,
}) {
  return (
    <div className="relative z-0 w-full h-full flex justify-center items-center">
      <Canvas
        camera={{ position, fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 2]}
        resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Suspense fallback={null}>
            <Band />
          </Suspense>
        </Physics>
        <Environment blur={0.75}>
          {[[-1, -1, 1], [1, 1, 1], [-10, 0, 14]].map(([x, y, z], i) => (
            <Lightformer
              key={i}
              intensity={i === 2 ? 10 : 3}
              color="white"
              position={[x, y, z]}
              rotation={[0, i === 2 ? Math.PI / 2 : 0, Math.PI / 3]}
              scale={[100, i === 2 ? 10 : 0.1, 1]}
            />
          ))}
        </Environment>
      </Canvas>
    </div>
  );
}

function Band() {
  const texture = useTexture("/Lanyard (2).png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 5);

  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(), new THREE.Vector3(),
    new THREE.Vector3(), new THREE.Vector3(),
  ]));

  const [dragged, setDragged] = useState<false | THREE.Vector3>(false);
  const [hovered, setHovered] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.5]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.8, 0]]);

  useEffect(() => {
    document.body.style.cursor = hovered ? (dragged ? "grabbing" : "grab") : "auto";
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    [j1, j2].forEach(ref => {
      if (!ref.current) return;
      const body = ref.current as RapierRigidBody & { lerped?: THREE.Vector3 };
      body.lerped ??= new THREE.Vector3().copy(body.translation());
      const dist = body.lerped.distanceTo(body.translation());
      body.lerped.lerp(body.translation(), delta * (5 + Math.max(0.05, Math.min(1, dist)) * 10));
    });

    if (
      j1.current && j2.current && j3.current &&
      (j1.current as any).lerped &&
      (j2.current as any).lerped &&
      fixed.current
    ) {
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy((j2.current as any).lerped);
      curve.points[2].copy((j1.current as any).lerped);
      curve.points[3].copy(fixed.current.translation());
    }


    if (band.current) {
      const updated = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curve.points), 64, 0.1, 8, false);
      band.current.geometry.dispose();
      band.current.geometry = updated;
    }

    if (!card.current) return;
    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel(
  new THREE.Vector3(ang.x, ang.y - rot.y * 0.25, ang.z),
  true
);
});

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    const target = e.target as Element | null;
  target?.setPointerCapture(e.pointerId);
    setDragged(new THREE.Vector3().copy(e.point).sub(card.current.translation()));
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    const target = e.target as Element | null;
  target?.setPointerCapture(e.pointerId);
    setDragged(false);
  };

  return (
    <>
      <group position={[0, 6, 0]}>
        <RigidBody ref={fixed} type="fixed" colliders={false} angularDamping={4} linearDamping={4} />
        {[j1, j2, j3].map((ref, i) => (
          <RigidBody key={i} ref={ref} position={[0.8 + 0.2 * i, 0, 0]} type="dynamic" colliders={false} angularDamping={4} linearDamping={4}>
            <BallCollider args={[0.1]} />
          </RigidBody>
        ))}
        <RigidBody ref={card} position={[2, 0, 0]} type={dragged ? "kinematicPosition" : "dynamic"} colliders={false} angularDamping={4} linearDamping={4}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <Card />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <planeGeometry args={[0.3, curve.getLength(), 32, 1]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.8} metalness={0.1} transparent />
      </mesh>
    </>
  );
}