
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

const bubbleData = [
  { position: [-4, 2, -1], size: 0.42, color: "#ff8278" },
  { position: [3, -1.5, 0], size: 0.58, color: "#ffaaa0" },
  { position: [-2, -2, 1], size: 0.32, color: "#d95c63" },
  { position: [4, 2.5, -2], size: 0.48, color: "#ffb9aa" },
  { position: [0, 3, -1], size: 0.25, color: "#ff8278" },
  { position: [-4, -1, -2], size: 0.65, color: "#a93c4b" },
];

function Moon() {
  const { scene } = useGLTF("/models/moon_small.glb");
  const moonRef = useRef();

  useFrame((state, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <group ref={moonRef} position={[4.2, 2.3, -2]} scale={1.6}>
      <primitive object={scene} />
      <pointLight
        position={[0, 0, 1]}
        intensity={2}
        color="#ffb6a5"
        distance={5}
      />
    </group>
  );
}

function Bubble({ position, size, color, index }) {
  const bubbleRef = useRef();

  useFrame((state) => {
    if (!bubbleRef.current) return;

    const pointer = state.pointer;
    const time = state.clock.elapsedTime;

    const targetX = position[0] + pointer.x * (0.35 + size * 0.3);
    const targetY =
      position[1] + pointer.y * (0.35 + size * 0.3);

    bubbleRef.current.position.x +=
      (targetX - bubbleRef.current.position.x) * 0.025;

    bubbleRef.current.position.y +=
      (targetY - bubbleRef.current.position.y) * 0.025;

    bubbleRef.current.position.y +=
      Math.sin(time * 0.7 + index) * 0.0015;

    bubbleRef.current.rotation.x += 0.001;
    bubbleRef.current.rotation.y += 0.002;
  });

  return (
    <mesh
      ref={bubbleRef}
      position={position}
      scale={size}
    >
      <sphereGeometry args={[1, 64, 64]} />

      <meshPhysicalMaterial
        color={color}
        metalness={0.35}
        roughness={0.12}
        clearcoat={1}
        clearcoatRoughness={0.05}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

function SceneObjects() {
  return (
    <>
      <ambientLight intensity={0.55} />

      <directionalLight
        position={[-3, 4, 5]}
        intensity={2}
        color="#fff0e8"
      />

      <pointLight
        position={[0, 0, 3]}
        intensity={1.5}
        color="#ff786f"
      />

      <Suspense fallback={null}>
        <Moon />
      </Suspense>

      {bubbleData.map((bubble, index) => (
        <Bubble
          key={index}
          {...bubble}
          index={index}
        />
      ))}
    </>
  );
}

export default function SpaceScene() {
  return (
    <div className="space-scene">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <SceneObjects />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/moon_small.glb");
